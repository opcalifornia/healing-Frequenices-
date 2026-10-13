"""Anonymous, aggregate product metrics.

The app sends a feature name from a fixed list and, for `app_open`, a coarse
"days since this device first opened the app" bucket. Nothing else: no user,
profile or device id, no health values, no timestamps finer than the day.
The server only adds 1 to a daily counter per (day, event, day_bucket). The
caller's IP is used for rate limiting in memory and is never stored, and the
endpoint takes no auth header on purpose, so counts cannot be tied to accounts.

`GET /api/metrics/summary` reads the counters back. It only exists when
METRICS_ADMIN_TOKEN is set, and needs that token in `X-Admin-Token`.
"""

from __future__ import annotations

import hmac
from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Any, Literal, Optional

from fastapi import APIRouter, Header, HTTPException, Query, Request, Response, status
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from pymongo import UpdateOne

from ..config import get_settings
from ..db import get_database
from ..ratelimit import client_ip, too_many

router = APIRouter(tags=["metrics"])

#: Keep in sync with METRIC_EVENTS in frontend/src/rooted/metrics.ts.
MetricEvent = Literal[
    "app_open",
    "first_win_started",
    "first_win_completed",
    "practice_completed",
    "program_day_completed",
    "calendar_event_added",
    "share_card_opened",
    "invite_sent",
    "guide_opened",
    "tour_completed",
    "tour_skipped",
]
DayBucket = Literal["0", "1", "2-6", "7-29", "30+"]

MAX_EVENTS = 50
#: 50 events of the longest name with a bucket is well under 4 KiB of JSON.
MAX_BODY = 8 * 1024


class EventIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    event: MetricEvent
    day_bucket: Optional[DayBucket] = None


class MetricsIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    events: list[EventIn] = Field(min_length=1, max_length=MAX_EVENTS)


def _utc_day(d: datetime | None = None) -> str:
    return (d or datetime.now(timezone.utc)).date().isoformat()


@router.post("/metrics", status_code=status.HTTP_204_NO_CONTENT)
async def record(request: Request) -> Response:
    wait = request.app.state.metrics_ip_limiter.hit(client_ip(request))
    if wait:
        raise too_many(wait)
    # Read the raw body rather than declaring a JSON body parameter: the app
    # sends with navigator.sendBeacon as text/plain (a CORS "simple" request,
    # so no preflight), which FastAPI would not parse as JSON.
    body = await request.body()
    if len(body) > MAX_BODY:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Too many events")
    try:
        payload = MetricsIn.model_validate_json(body)
    except ValidationError as exc:
        raise RequestValidationError(exc.errors()) from None

    day = _utc_day()
    counts = Counter((e.event, e.day_bucket if e.event == "app_open" else None) for e in payload.events)
    ops = [
        UpdateOne({"day": day, "event": event, "day_bucket": bucket}, {"$inc": {"count": n}}, upsert=True)
        for (event, bucket), n in counts.items()
    ]
    await get_database().metrics_daily.bulk_write(ops, ordered=False)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def _rate(num: int, den: int) -> float | None:
    return round(num / den, 4) if den else None


@router.get("/metrics/summary")
async def summary(days: int = Query(30, ge=1, le=366), x_admin_token: str | None = Header(None)) -> dict[str, Any]:
    expected = get_settings().metrics_admin_token
    if not expected:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not Found")
    if not x_admin_token or not hmac.compare_digest(x_admin_token.encode(), expected.encode()):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthorized")

    today = datetime.now(timezone.utc)
    start = _utc_day(today - timedelta(days=days - 1))
    end = _utc_day(today)
    rows = await get_database().metrics_daily.find({"day": {"$gte": start, "$lte": end}}, {"_id": 0}).to_list(None)

    daily: dict[str, dict[str, int]] = {}
    totals: Counter[str] = Counter()
    opens_by_bucket: Counter[str] = Counter()
    for r in rows:
        n = int(r.get("count", 0))
        daily.setdefault(r["day"], {})
        daily[r["day"]][r["event"]] = daily[r["day"]].get(r["event"], 0) + n
        totals[r["event"]] += n
        if r["event"] == "app_open" and r.get("day_bucket"):
            opens_by_bucket[r["day_bucket"]] += n

    started, completed = totals["first_win_started"], totals["first_win_completed"]
    day0, day1 = opens_by_bucket["0"], opens_by_bucket["1"]
    return {
        "from": start,
        "to": end,
        "days": days,
        "totals": dict(totals),
        "daily": [{"day": d, "events": daily[d]} for d in sorted(daily)],
        "app_open_by_day_bucket": dict(opens_by_bucket),
        "funnel": {
            "first_win_started": started,
            "first_win_completed": completed,
            "first_win_completion_rate": _rate(completed, started),
            # Devices opening on their first day vs. the day after. A proxy for
            # day-2 return: the window edges and device changes blur it a little.
            "new_devices": day0,
            "returned_next_day": day1,
            "day2_return_rate": _rate(day1, day0),
        },
    }
