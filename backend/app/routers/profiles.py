"""Profiles and each profile's library: favorites, continue listening, custom sessions."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Response, status

from ..config import get_settings
from ..db import get_database
from ..models import CustomSessionIn, ProfileIn, ProfileOut, ProfilePatch, ProgressIn
from ..security import current_user

router = APIRouter(prefix="/profiles", tags=["profiles"])


def profile_out(p: dict[str, Any]) -> dict[str, Any]:
    return {"id": p["_id"], "name": p["name"], "hue": p["hue"], "kids": p.get("kids", False)}


async def owned_profile(profile_id: str, user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    p = await get_database().profiles.find_one({"_id": profile_id, "user_id": user["_id"]})
    if not p:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")
    return p


async def title_exists(title_id: str) -> None:
    if not await get_database().titles.find_one({"_id": title_id}, {"_id": 1}):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Title not found")


@router.get("", response_model=list[ProfileOut])
async def list_profiles(user: dict[str, Any] = Depends(current_user)) -> list[dict[str, Any]]:
    return [profile_out(p) async for p in get_database().profiles.find({"user_id": user["_id"]}).sort("created_at", 1)]


@router.post("", response_model=ProfileOut, status_code=status.HTTP_201_CREATED)
async def create_profile(body: ProfileIn, user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    db = get_database()
    if await db.profiles.count_documents({"user_id": user["_id"]}) >= get_settings().max_profiles:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Profile limit reached")
    doc = {"_id": f"p-{uuid.uuid4().hex[:16]}", "user_id": user["_id"], **body.model_dump(), "created_at": datetime.now(timezone.utc)}
    await db.profiles.insert_one(doc)
    return profile_out(doc)


@router.patch("/{profile_id}", response_model=ProfileOut)
async def update_profile(body: ProfilePatch, profile: dict[str, Any] = Depends(owned_profile)) -> dict[str, Any]:
    patch = body.model_dump(exclude_none=True)
    if patch:
        await get_database().profiles.update_one({"_id": profile["_id"]}, {"$set": patch})
    return profile_out({**profile, **patch})


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(profile: dict[str, Any] = Depends(owned_profile)) -> Response:
    db = get_database()
    if await db.profiles.count_documents({"user_id": profile["user_id"]}) <= 1:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "An account needs at least one profile")
    pid = profile["_id"]
    await db.profiles.delete_one({"_id": pid})
    for coll in (db.favorites, db.progress, db.custom_sessions, db.app_state):
        await coll.delete_many({"profile_id": pid})
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{profile_id}/library")
async def library(profile: dict[str, Any] = Depends(owned_profile)) -> dict[str, Any]:
    db = get_database()
    pid = profile["_id"]
    favorites = [f["title_id"] async for f in db.favorites.find({"profile_id": pid}).sort("created_at", -1)]
    progress = [
        {"titleId": p["title_id"], "position": p["position"], "duration": p["duration"], "updatedAt": p["updated_at"].isoformat()}
        async for p in db.progress.find({"profile_id": pid}).sort("updated_at", -1).limit(30)
    ]
    custom = [{k: v for k, v in c.items() if k not in ("_id", "profile_id")} async for c in db.custom_sessions.find({"profile_id": pid}).sort("createdAt", -1)]
    return {"favorites": favorites, "continue": progress, "custom": custom}


@router.put("/{profile_id}/favorites/{title_id}", status_code=status.HTTP_204_NO_CONTENT)
async def add_favorite(title_id: str, profile: dict[str, Any] = Depends(owned_profile)) -> Response:
    await title_exists(title_id)
    await get_database().favorites.update_one(
        {"profile_id": profile["_id"], "title_id": title_id},
        {"$setOnInsert": {"created_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{profile_id}/favorites/{title_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_favorite(title_id: str, profile: dict[str, Any] = Depends(owned_profile)) -> Response:
    await get_database().favorites.delete_one({"profile_id": profile["_id"], "title_id": title_id})
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{profile_id}/continue/{title_id}", status_code=status.HTTP_204_NO_CONTENT)
async def save_progress(title_id: str, body: ProgressIn, profile: dict[str, Any] = Depends(owned_profile)) -> Response:
    await title_exists(title_id)
    await get_database().progress.update_one(
        {"profile_id": profile["_id"], "title_id": title_id},
        {"$set": {"position": body.position, "duration": body.duration, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{profile_id}/continue/{title_id}", status_code=status.HTTP_204_NO_CONTENT)
async def clear_progress(title_id: str, profile: dict[str, Any] = Depends(owned_profile)) -> Response:
    await get_database().progress.delete_one({"profile_id": profile["_id"], "title_id": title_id})
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{profile_id}/custom-sessions", status_code=status.HTTP_201_CREATED)
async def save_custom(body: CustomSessionIn, profile: dict[str, Any] = Depends(owned_profile)) -> dict[str, Any]:
    db = get_database()
    if await db.custom_sessions.count_documents({"profile_id": profile["_id"]}) >= 100:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Custom session limit reached")
    doc = body.model_dump()
    doc["createdAt"] = doc["createdAt"] or datetime.now(timezone.utc).isoformat()
    await db.custom_sessions.replace_one({"_id": f"{profile['_id']}:{body.id}"}, {**doc, "_id": f"{profile['_id']}:{body.id}", "profile_id": profile["_id"]}, upsert=True)
    return doc


@router.delete("/{profile_id}/custom-sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_custom(session_id: str, profile: dict[str, Any] = Depends(owned_profile)) -> Response:
    await get_database().custom_sessions.delete_one({"_id": f"{profile['_id']}:{session_id}"})
    return Response(status_code=status.HTTP_204_NO_CONTENT)
