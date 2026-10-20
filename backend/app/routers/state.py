"""Per-profile app state for Rooted (shopping list, practice log, goals, programs...).

Each profile stores a handful of named JSON documents. Writes are
last-write-wins by the client's `updatedAt`, so a stale device can't
overwrite newer data from another device.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field, field_validator

from ..db import get_database
from .profiles import owned_profile

router = APIRouter(prefix="/profiles", tags=["state"])

#: The documents a profile may store. "journal" and "support" hold private
#: reflections and the safety plan; the app only syncs them when the person opts in.
STATE_KEYS = {"nourish", "practice", "wellness", "programs", "garden", "mealPlan", "foodLog", "bedtime", "calendar", "earth", "journal", "support"}
MAX_BYTES = 256 * 1024
#: MongoDB refuses documents nested deeper than 100 levels; app state is a few levels deep.
MAX_DEPTH = 32


def _depth(value: Any) -> int:
    """Nesting depth of a JSON value, computed without recursion."""
    deepest, stack = 0, [(value, 1)]
    while stack:
        v, d = stack.pop()
        if isinstance(v, (dict, list)):
            deepest = max(deepest, d)
            if d > MAX_DEPTH:
                break
            stack.extend((c, d + 1) for c in (v.values() if isinstance(v, dict) else v))
    return deepest


class StateIn(BaseModel):
    data: dict[str, Any] = Field(default_factory=dict)
    updatedAt: datetime

    @field_validator("data")
    @classmethod
    def check_depth(cls, v: dict[str, Any]) -> dict[str, Any]:
        if _depth(v) > MAX_DEPTH:
            raise ValueError(f"State is nested too deeply (max {MAX_DEPTH} levels)")
        return v


def _check_key(key: str) -> None:
    if key not in STATE_KEYS:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Unknown state key")


def _as_utc(d: datetime) -> datetime:
    return d if d.tzinfo else d.replace(tzinfo=timezone.utc)


@router.get("/{profile_id}/state")
async def get_state(profile: dict[str, Any] = Depends(owned_profile)) -> dict[str, Any]:
    docs = get_database().app_state.find({"profile_id": profile["_id"]})
    return {"keys": {d["key"]: {"data": d["data"], "updatedAt": _as_utc(d["updated_at"]).isoformat()} async for d in docs}}


@router.put("/{profile_id}/state/{key}")
async def put_state(key: str, body: StateIn, profile: dict[str, Any] = Depends(owned_profile)) -> dict[str, Any]:
    _check_key(key)
    if len(json.dumps(body.data, separators=(",", ":"))) > MAX_BYTES:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "State too large")
    db = get_database()
    incoming = _as_utc(body.updatedAt)
    existing = await db.app_state.find_one({"profile_id": profile["_id"], "key": key})
    if existing and _as_utc(existing["updated_at"]) > incoming:
        # A newer copy exists (from another device): hand it back instead of overwriting.
        raise HTTPException(status.HTTP_409_CONFLICT, "A newer version exists")
    await db.app_state.update_one(
        {"profile_id": profile["_id"], "key": key},
        {"$set": {"data": body.data, "updated_at": incoming}},
        upsert=True,
    )
    return {"key": key, "updatedAt": incoming.isoformat()}


@router.delete("/{profile_id}/state", status_code=status.HTTP_204_NO_CONTENT)
async def delete_state(profile: dict[str, Any] = Depends(owned_profile), key: str | None = None) -> Response:
    """Delete everything synced for this profile, or a single key."""
    query: dict[str, Any] = {"profile_id": profile["_id"]}
    if key:
        _check_key(key)
        query["key"] = key
    await get_database().app_state.delete_many(query)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
