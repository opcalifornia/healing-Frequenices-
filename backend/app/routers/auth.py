from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from ..db import get_database
from ..models import AuthOut, Credentials, ProfileOut, UserOut
from ..security import create_token, current_user, hash_password, verify_password
from .profiles import profile_out

router = APIRouter(tags=["auth"])


def user_out(u: dict[str, Any]) -> UserOut:
    return UserOut(id=u["_id"], email=u["email"], plan=u.get("plan", "free"))


@router.post("/auth/register", response_model=AuthOut, status_code=status.HTTP_201_CREATED)
async def register(body: Credentials) -> AuthOut:
    db = get_database()
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with that email already exists")
    now = datetime.now(timezone.utc)
    user = {
        "_id": f"u-{uuid.uuid4().hex}",
        "email": email,
        "password_hash": hash_password(body.password),
        "plan": "free",
        "stripe_customer_id": None,
        "created_at": now,
    }
    try:
        await db.users.insert_one(user)
    except DuplicateKeyError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with that email already exists") from exc
    # Every account starts with one profile, like the reference app.
    name = email.split("@")[0][:20].capitalize() or "Listener"
    await db.profiles.insert_one({"_id": f"p-{uuid.uuid4().hex[:16]}", "user_id": user["_id"], "name": name, "hue": 262, "kids": False, "created_at": now})
    return AuthOut(token=create_token(user["_id"]), user=user_out(user))


@router.post("/auth/login", response_model=AuthOut)
async def login(body: Credentials) -> AuthOut:
    user = await get_database().users.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Email or password is incorrect")
    return AuthOut(token=create_token(user["_id"]), user=user_out(user))


@router.get("/me")
async def me(user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    profiles = [profile_out(p) async for p in get_database().profiles.find({"user_id": user["_id"]}).sort("created_at", 1)]
    return {"user": user_out(user), "profiles": [ProfileOut.model_validate(p) for p in profiles]}
