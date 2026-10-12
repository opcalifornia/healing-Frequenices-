"""Circles: small private groups doing a program together.

Members see only each other's chosen display name, how many days of the
program they've completed, and cheers. Nothing else from anyone's data is
shared. Membership belongs to a profile, since program progress is per profile.
"""

from __future__ import annotations

import re
import secrets
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, ConfigDict, Field

from ..db import get_database
from .profiles import owned_profile

router = APIRouter(prefix="/profiles/{profile_id}/circles", tags=["circles"])

MAX_MEMBERS = 12
MAX_CIRCLES_PER_PROFILE = 10
MAX_CHEERS = 200
CODE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"
PROGRAM_RE = r"^[a-z0-9-]{1,40}$"


class CircleIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    programId: str = Field(pattern=PROGRAM_RE)
    name: str = Field(min_length=1, max_length=40)
    displayName: str = Field(min_length=1, max_length=24)


class JoinIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str = Field(pattern=r"^[a-z0-9]{8}$")
    displayName: str = Field(min_length=1, max_length=24)


class CheerIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    to: str = Field(pattern=r"^m-[a-f0-9]{12}$")


def _clean(text: str) -> str:
    return re.sub(r"[\x00-\x1f<>]", "", text).strip()[:40] or "Friend"


def _today() -> str:
    return datetime.now(timezone.utc).date().isoformat()


async def _days_done(profile_id: str, program_id: str) -> int:
    doc = await get_database().app_state.find_one({"profile_id": profile_id, "key": "programs"}, {"data": 1})
    enrolled = ((doc or {}).get("data") or {}).get("enrolled") or {}
    done = (enrolled.get(program_id) or {}).get("done") or {}
    return len(done) if isinstance(done, dict) else 0


async def _view(c: dict[str, Any], profile_id: str) -> dict[str, Any]:
    today = _today()
    members = []
    for m in c["members"]:
        members.append({
            "id": m["id"],
            "name": m["name"],
            "daysDone": await _days_done(m["profile_id"], c["program_id"]),
            "cheersToday": sum(1 for ch in c.get("cheers", []) if ch["to"] == m["id"] and ch["day"] == today),
            "you": m["profile_id"] == profile_id,
        })
    return {"id": c["_id"], "name": c["name"], "programId": c["program_id"], "code": c["code"], "members": members}


def _member(c: dict[str, Any], profile_id: str) -> dict[str, Any] | None:
    return next((m for m in c["members"] if m["profile_id"] == profile_id), None)


async def _count_mine(profile_id: str) -> int:
    return await get_database().circles.count_documents({"members.profile_id": profile_id})


@router.get("")
async def list_circles(profile: dict[str, Any] = Depends(owned_profile)) -> list[dict[str, Any]]:
    cur = get_database().circles.find({"members.profile_id": profile["_id"]})
    return [await _view(c, profile["_id"]) async for c in cur]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_circle(body: CircleIn, profile: dict[str, Any] = Depends(owned_profile)) -> dict[str, Any]:
    if await _count_mine(profile["_id"]) >= MAX_CIRCLES_PER_PROFILE:
        raise HTTPException(status.HTTP_409_CONFLICT, "You're in the maximum number of circles")
    db = get_database()
    for _ in range(5):
        code = "".join(secrets.choice(CODE_ALPHABET) for _ in range(8))
        if not await db.circles.find_one({"code": code}, {"_id": 1}):
            break
    c = {
        "_id": f"c-{uuid.uuid4().hex[:16]}",
        "name": _clean(body.name),
        "program_id": body.programId,
        "code": code,
        "created_at": datetime.now(timezone.utc),
        "members": [{"id": f"m-{secrets.token_hex(6)}", "profile_id": profile["_id"], "name": _clean(body.displayName)[:24]}],
        "cheers": [],
    }
    await db.circles.insert_one(c)
    return await _view(c, profile["_id"])


@router.post("/join")
async def join_circle(body: JoinIn, profile: dict[str, Any] = Depends(owned_profile)) -> dict[str, Any]:
    db = get_database()
    c = await db.circles.find_one({"code": body.code})
    if not c:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No circle with that code")
    if _member(c, profile["_id"]):
        return await _view(c, profile["_id"])
    if len(c["members"]) >= MAX_MEMBERS:
        raise HTTPException(status.HTTP_409_CONFLICT, "This circle is full")
    if await _count_mine(profile["_id"]) >= MAX_CIRCLES_PER_PROFILE:
        raise HTTPException(status.HTTP_409_CONFLICT, "You're in the maximum number of circles")
    m = {"id": f"m-{secrets.token_hex(6)}", "profile_id": profile["_id"], "name": _clean(body.displayName)[:24]}
    await db.circles.update_one({"_id": c["_id"]}, {"$push": {"members": m}})
    c["members"].append(m)
    return await _view(c, profile["_id"])


@router.post("/{circle_id}/cheer", status_code=status.HTTP_204_NO_CONTENT)
async def cheer(circle_id: str, body: CheerIn, profile: dict[str, Any] = Depends(owned_profile)) -> Response:
    db = get_database()
    c = await db.circles.find_one({"_id": circle_id})
    me = _member(c, profile["_id"]) if c else None
    if not c or not me:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Circle not found")
    if body.to == me["id"] or not any(m["id"] == body.to for m in c["members"]):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Pick someone else in the circle")
    today = _today()
    # One cheer per person, per friend, per day.
    if any(ch["from"] == me["id"] and ch["to"] == body.to and ch["day"] == today for ch in c.get("cheers", [])):
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    await db.circles.update_one({"_id": circle_id}, {"$push": {"cheers": {"$each": [{"from": me["id"], "to": body.to, "day": today}], "$slice": -MAX_CHEERS}}})
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{circle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def leave(circle_id: str, profile: dict[str, Any] = Depends(owned_profile)) -> Response:
    db = get_database()
    c = await db.circles.find_one({"_id": circle_id})
    me = _member(c, profile["_id"]) if c else None
    if not c or not me:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Circle not found")
    if len(c["members"]) <= 1:
        await db.circles.delete_one({"_id": circle_id})
    else:
        await db.circles.update_one({"_id": circle_id}, {"$set": {"members": [m for m in c["members"] if m["profile_id"] != profile["_id"]], "cheers": [ch for ch in c.get("cheers", []) if me["id"] not in (ch["from"], ch["to"])]}})
    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def remove_profile_from_circles(profile_id: str) -> None:
    """Called when a profile or account is deleted."""
    db = get_database()
    async for c in db.circles.find({"members.profile_id": profile_id}):
        me = _member(c, profile_id)
        if len(c["members"]) <= 1:
            await db.circles.delete_one({"_id": c["_id"]})
        else:
            await db.circles.update_one({"_id": c["_id"]}, {"$set": {"members": [m for m in c["members"] if m["profile_id"] != profile_id], "cheers": [ch for ch in c.get("cheers", []) if me["id"] not in (ch["from"], ch["to"])]}})
