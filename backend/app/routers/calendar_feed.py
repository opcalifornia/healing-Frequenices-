"""Live calendar feed for a profile's health calendar.

Apple Calendar, Google Calendar and Outlook can "subscribe" to a calendar URL
and refresh it on their own. The profile owner creates a secret link; the
feed endpoint serves the synced health events as iCalendar, with no login,
so the URL itself is the credential. Making a new link turns the old one off.
"""

from __future__ import annotations

import re
import secrets
from datetime import date, datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel

from ..config import get_settings
from ..db import get_database
from .profiles import owned_profile

router = APIRouter(tags=["calendar"])

TOKEN_RE = re.compile(r"^[A-Za-z0-9_-]{20,64}$")
TIME_RE = re.compile(r"^\d{2}:\d{2}$")
DAY_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
RRULES = {"daily": "FREQ=DAILY", "weekdays": "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR", "weekly": "FREQ=WEEKLY"}


class FeedIn(BaseModel):
    rotate: bool = False


def _feed_url(request: Request, token: str) -> str:
    base = get_settings().api_public_url or str(request.base_url)
    return f"{base.rstrip('/')}/api/calendar/{token}.ics"


@router.post("/profiles/{profile_id}/calendar-feed")
async def create_feed(request: Request, body: FeedIn | None = None, profile: dict[str, Any] = Depends(owned_profile)) -> dict[str, str]:
    db = get_database()
    existing = await db.calendar_feeds.find_one({"profile_id": profile["_id"]})
    if existing and not (body and body.rotate):
        token = existing["token"]
    else:
        token = secrets.token_urlsafe(24)
        await db.calendar_feeds.update_one(
            {"profile_id": profile["_id"]},
            {"$set": {"token": token, "created_at": datetime.now(timezone.utc)}},
            upsert=True,
        )
    return {"url": _feed_url(request, token)}


@router.delete("/profiles/{profile_id}/calendar-feed", status_code=status.HTTP_204_NO_CONTENT)
async def delete_feed(profile: dict[str, Any] = Depends(owned_profile)) -> Response:
    await get_database().calendar_feeds.delete_many({"profile_id": profile["_id"]})
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/calendar/{token}.ics")
async def feed(token: str) -> Response:
    if not TOKEN_RE.match(token):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    db = get_database()
    sub = await db.calendar_feeds.find_one({"token": token})
    if not sub:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    doc = await db.app_state.find_one({"profile_id": sub["profile_id"], "key": "calendar"})
    events = (doc or {}).get("data", {}).get("events") or []
    body = build_ics(events if isinstance(events, list) else [], get_settings().app_url)
    return Response(
        content=body,
        media_type="text/calendar; charset=utf-8",
        headers={"Cache-Control": "private, max-age=300", "Content-Disposition": 'inline; filename="rooted.ics"'},
    )


# --------------------------------------------------------------------------
# iCalendar output (mirrors frontend/src/rooted/calendarIcs.ts)
# --------------------------------------------------------------------------


def _text(s: str) -> str:
    return s.replace("\\", "\\\\").replace("\n", "\\n").replace(",", "\\,").replace(";", "\\;")


def _fold(line: str) -> str:
    if len(line) <= 74:
        return line
    return "\r\n ".join(line[i : i + 73] for i in range(0, len(line), 73))


def _vevent(e: dict[str, Any], app_url: str, stamp: str) -> list[str]:
    day, time = str(e.get("date", "")), str(e.get("time", ""))
    if not DAY_RE.match(day) or not TIME_RE.match(time):
        return []
    try:
        start = datetime.combine(date.fromisoformat(day), datetime.strptime(time, "%H:%M").time())
        minutes = max(5, min(int(e.get("minutes") or 15), 24 * 60))
    except (ValueError, TypeError):
        return []
    end = start + timedelta(minutes=minutes)
    fmt = "%Y%m%dT%H%M%S"
    to = e.get("to") if isinstance(e.get("to"), str) and str(e.get("to")).startswith("/") else "/"
    desc = "\n".join(x for x in [str(e.get("note") or ""), f"Open in Rooted: {app_url.rstrip('/')}{to}"] if x)
    lines = [
        "BEGIN:VEVENT",
        f"UID:{re.sub(r'[^A-Za-z0-9-]', '', str(e.get('id', '')))[:60] or 'event'}@rooted",
        f"DTSTAMP:{stamp}",
        f"DTSTART:{start.strftime(fmt)}",
        f"DTEND:{end.strftime(fmt)}",
    ]
    rule = RRULES.get(str(e.get("repeat")))
    if rule:
        lines.append(f"RRULE:{rule}")
        skips = e.get("skip") if isinstance(e.get("skip"), dict) else {}
        lines += [f"EXDATE:{d.replace('-', '')}T{time.replace(':', '')}00" for d in sorted(skips) if DAY_RE.match(d)]
    lines += [
        f"SUMMARY:{_text(str(e.get('title') or 'Rooted')[:200])}",
        f"DESCRIPTION:{_text(desc[:1000])}",
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        f"DESCRIPTION:{_text(str(e.get('title') or 'Rooted')[:200])}",
        "TRIGGER:-PT5M",
        "END:VALARM",
        "END:VEVENT",
    ]
    return lines


def build_ics(events: list[Any], app_url: str, now: datetime | None = None) -> str:
    stamp = (now or datetime.now(timezone.utc)).strftime("%Y%m%dT%H%M%SZ")
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Rooted//Health calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:Rooted health",
        "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
        "X-PUBLISHED-TTL:PT1H",
    ]
    for e in events[:500]:
        if isinstance(e, dict):
            lines += _vevent(e, app_url, stamp)
    lines.append("END:VCALENDAR")
    return "\r\n".join(_fold(l) for l in lines) + "\r\n"
