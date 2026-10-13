"""Feedback from people using the app.

Anyone can send a short message ("this confused me", "I love this") from
inside the app. The server stores the message, a category, the screen it was
sent from and, only if the person chooses to type one, a way to reply. It never
stores an account, profile or device id, and the caller's IP is used for rate
limiting in memory only. The endpoint takes no auth header on purpose.

`GET /api/feedback` reads messages back. It only exists when
METRICS_ADMIN_TOKEN is set, and needs that token in `X-Admin-Token`.
"""

from __future__ import annotations

import hmac
from datetime import datetime, timezone
from typing import Any, Literal, Optional

from fastapi import APIRouter, Header, HTTPException, Query, Request, Response, status
from pydantic import BaseModel, ConfigDict, Field, field_validator

from ..config import get_settings
from ..db import get_database
from ..ratelimit import client_ip, too_many

router = APIRouter(tags=["feedback"])

#: Keep in sync with FEEDBACK_KINDS in frontend/src/rooted/feedback.ts.
FeedbackKind = Literal["confusing", "bug", "idea", "love"]


class FeedbackIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    kind: FeedbackKind
    message: str = Field(min_length=1, max_length=2000)
    page: Optional[str] = Field(default=None, max_length=120)
    contact: Optional[str] = Field(default=None, max_length=160)

    @field_validator("message")
    @classmethod
    def _message(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Please write a few words")
        return v

    @field_validator("page", "contact")
    @classmethod
    def _optional(cls, v: Optional[str]) -> Optional[str]:
        v = (v or "").strip()
        return v or None


@router.post("/feedback", status_code=status.HTTP_204_NO_CONTENT)
async def send(payload: FeedbackIn, request: Request) -> Response:
    wait = request.app.state.feedback_ip_limiter.hit(client_ip(request))
    if wait:
        raise too_many(wait)
    await get_database().feedback.insert_one(
        {
            "kind": payload.kind,
            "message": payload.message,
            # Only the route (for example "/breathe"), never a query string.
            "page": payload.page.split("?")[0] if payload.page else None,
            "contact": payload.contact,
            "created_at": datetime.now(timezone.utc),
        }
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/feedback")
async def read(limit: int = Query(100, ge=1, le=500), x_admin_token: str | None = Header(None)) -> dict[str, Any]:
    expected = get_settings().metrics_admin_token
    if not expected:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not Found")
    if not x_admin_token or not hmac.compare_digest(x_admin_token.encode(), expected.encode()):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthorized")
    rows = await get_database().feedback.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for r in rows:
        r["created_at"] = r["created_at"].isoformat()
    return {"count": len(rows), "feedback": rows}
