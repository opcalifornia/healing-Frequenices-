"""GAIA endpoints. Off unless GAIA_ENABLED is set and an Anthropic API key is configured.

GET  /api/gaia/status   -> {"enabled": bool} for the signed-in account
POST /api/gaia/chat     -> a text/event-stream of GAIA events (see app/gaia/agent.py)

Nothing GAIA hears is stored here: the conversation lives on the person's device and is
sent with each message. Only counts for rate limits are kept, in memory.
"""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from typing import Any, AsyncIterator, Literal

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel, ConfigDict, Field, field_validator

from ..config import get_settings
from ..db import get_database
from ..gaia.agent import run_turn
from ..gaia.safety import CONSIDERATIONS, active_flags
from ..ratelimit import too_many
from ..security import _bearer, current_user, decode_token

log = logging.getLogger("gaia")
router = APIRouter(tags=["gaia"])


class Turn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    role: Literal["user", "assistant"]
    text: str = Field(min_length=1, max_length=4000)


class Profile(BaseModel):
    """A small snapshot the app sends with each message. All optional, all on the person's terms."""

    model_config = ConfigDict(extra="ignore")
    name: str | None = Field(default=None, max_length=40)
    goals: list[str] = Field(default_factory=list, max_length=8)
    considerations: list[str] = Field(default_factory=list, max_length=10)
    activity: str | None = Field(default=None, max_length=20)
    minutes_per_day: int | None = Field(default=None, ge=0, le=180)
    wake: str | None = Field(default=None, max_length=8)
    bed: str | None = Field(default=None, max_length=8)
    allergens: list[str] = Field(default_factory=list, max_length=14)
    recent: list[str] = Field(default_factory=list, max_length=12)
    local_time: str | None = Field(default=None, max_length=40)

    @field_validator("considerations")
    @classmethod
    def known_only(cls, v: list[str]) -> list[str]:
        return [c for c in v if c in CONSIDERATIONS]

    @field_validator("goals", "allergens", "recent")
    @classmethod
    def short_items(cls, v: list[str]) -> list[str]:
        return [s[:80] for s in v if isinstance(s, str)]


class ChatIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    messages: list[Turn] = Field(min_length=1, max_length=30)
    profile: Profile = Field(default_factory=Profile)

    @field_validator("messages")
    @classmethod
    def ends_with_user(cls, v: list[Turn]) -> list[Turn]:
        if v[0].role != "user" or v[-1].role != "user":
            raise ValueError("The conversation must start and end with the person's message")
        return v


@lru_cache(maxsize=1)
def _client() -> Any:
    import anthropic  # imported lazily so the app runs without the package when GAIA is off

    return anthropic.AsyncAnthropic(api_key=get_settings().anthropic_api_key)


def get_gaia_client() -> Any:
    return _client()


def _allowed(user: dict[str, Any] | None) -> bool:
    s = get_settings()
    if not (s.gaia_enabled and s.anthropic_api_key) or not user:
        return False
    allow = {e.lower() for e in s.gaia_allowed_emails}
    return not allow or str(user.get("email", "")).lower() in allow


async def _optional_user(creds: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> dict[str, Any] | None:
    if creds is None:
        return None
    try:
        user_id = decode_token(creds.credentials)
    except HTTPException:
        return None
    return await get_database().users.find_one({"_id": user_id})


@router.get("/gaia/status")
async def gaia_status(user: dict[str, Any] | None = Depends(_optional_user)) -> dict[str, bool]:
    return {"enabled": _allowed(user)}


@router.post("/gaia/chat")
async def gaia_chat(body: ChatIn, request: Request, user: dict[str, Any] = Depends(current_user), client: Any = Depends(get_gaia_client)) -> StreamingResponse:
    if not _allowed(user):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not Found")
    key = str(user["_id"])
    for limiter in (request.app.state.gaia_hour_limiter, request.app.state.gaia_day_limiter):
        wait = limiter.hit(key)
        if wait:
            raise too_many(wait)

    s = get_settings()
    profile = body.profile.model_dump(exclude_none=True)
    flags_on = active_flags(body.profile.considerations)
    history = [{"role": t.role, "content": t.text} for t in body.messages]

    async def events() -> AsyncIterator[bytes]:
        try:
            async for ev in run_turn(client, history=history, profile=profile, flags_on=flags_on, model=s.gaia_model, screen_model=s.gaia_screen_model):
                yield f"data: {json.dumps(ev)}\n\n".encode()
        except Exception:  # noqa: BLE001 - report kindly, log for us
            log.exception("gaia turn failed")
            yield f"data: {json.dumps({'type': 'error', 'message': 'GAIA hit a snag. Please try again in a moment.'})}\n\n".encode()
            yield f"data: {json.dumps({'type': 'done'})}\n\n".encode()

    return StreamingResponse(events(), media_type="text/event-stream", headers={"Cache-Control": "no-store", "X-Accel-Buffering": "no"})
