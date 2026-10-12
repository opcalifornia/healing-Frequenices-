from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pymongo.errors import DuplicateKeyError

from ..db import get_database
from ..models import AuthOut, Credentials, ProfileOut, RegisterIn, UserOut
from ..ratelimit import client_ip, too_many
from ..security import burn_password_check, create_token, current_user, hash_password, verify_password
from .profiles import profile_out

router = APIRouter(tags=["auth"])


def user_out(u: dict[str, Any]) -> UserOut:
    return UserOut(id=u["_id"], email=u["email"], plan=u.get("plan", "free"), refCode=u.get("ref_code"))


def new_ref_code() -> str:
    """Short, unambiguous invite code (no 0/O/1/l/I)."""
    alphabet = "abcdefghjkmnpqrstuvwxyz23456789"
    return "".join(secrets.choice(alphabet) for _ in range(8))


#: Collections keyed by profile_id that hold a profile's data.
PROFILE_DATA = ("favorites", "progress", "custom_sessions", "app_state", "calendar_feeds")


def _limit_auth(request: Request, action: str, email: str) -> None:
    """Brute-force guard: 30 attempts per IP and 10 per email per 15 minutes.

    The IP budget is higher than the email budget because households and
    mobile carriers share addresses. A per-email limit means someone can
    briefly lock a known address out of login; that is the usual tradeoff for
    stopping password guessing spread across many IPs.
    """
    s = request.app.state
    wait = s.auth_ip_limiter.hit(f"ip:{client_ip(request)}")
    if wait is None:
        wait = s.auth_email_limiter.hit(f"{action}:{email}")
    if wait is not None:
        raise too_many(wait)


@router.post("/auth/register", response_model=AuthOut, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterIn, request: Request) -> AuthOut:
    db = get_database()
    email = body.email.lower()
    _limit_auth(request, "register", email)
    # A 409 tells the caller the address has an account. That is deliberate UX
    # (people need to know to sign in instead); the rate limit above keeps it
    # from being used to test addresses in bulk.
    if await db.users.find_one({"email": email}):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with that email already exists")
    now = datetime.now(timezone.utc)
    referrer = await db.users.find_one({"ref_code": body.ref}) if body.ref else None
    user = {
        "_id": f"u-{uuid.uuid4().hex}",
        "email": email,
        "password_hash": hash_password(body.password),
        "plan": "free",
        "stripe_customer_id": None,
        "created_at": now,
        "ref_code": new_ref_code(),
        "referred_by": referrer["_id"] if referrer else None,
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
async def login(body: Credentials, request: Request) -> AuthOut:
    email = body.email.lower()
    _limit_auth(request, "login", email)
    user = await get_database().users.find_one({"email": email})
    if not user:
        burn_password_check(body.password)  # same timing as a wrong password
    if not user or not verify_password(body.password, user["password_hash"]):
        # One message for unknown email and wrong password: no account enumeration.
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Email or password is incorrect")
    request.app.state.auth_email_limiter.reset(f"login:{email}")
    return AuthOut(token=create_token(user["_id"]), user=user_out(user))


@router.get("/me")
async def me(user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    profiles = [profile_out(p) async for p in get_database().profiles.find({"user_id": user["_id"]}).sort("created_at", 1)]
    return {"user": user_out(user), "profiles": [ProfileOut.model_validate(p) for p in profiles]}


@router.get("/me/referrals")
async def referrals(user: dict[str, Any] = Depends(current_user)) -> dict[str, Any]:
    """The account's invite code and how many people signed up with it. Only a count: never who."""
    db = get_database()
    code = user.get("ref_code")
    if not code:
        code = new_ref_code()
        await db.users.update_one({"_id": user["_id"]}, {"$set": {"ref_code": code}})
    joined = await db.users.count_documents({"referred_by": user["_id"]})
    return {"code": code, "joined": joined}


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(user: dict[str, Any] = Depends(current_user)) -> Response:
    """Delete the account and everything stored for it (right to erasure).

    Profile data goes first and the user record last, so a failure part-way
    leaves an account that can still sign in and retry. Existing tokens stop
    working once the user record is gone (current_user looks it up).
    """
    # TODO(billing): once Stripe launches, cancel any active subscription for
    # user["stripe_customer_id"] here before deleting the record.
    db = get_database()
    profile_ids = [p["_id"] async for p in db.profiles.find({"user_id": user["_id"]}, {"_id": 1})]
    if profile_ids:
        for name in PROFILE_DATA:
            await db[name].delete_many({"profile_id": {"$in": profile_ids}})
        await db.profiles.delete_many({"user_id": user["_id"]})
    # Friends this person invited keep their accounts; just drop the link back.
    await db.users.update_many({"referred_by": user["_id"]}, {"$set": {"referred_by": None}})
    await db.users.delete_one({"_id": user["_id"]})
    return Response(status_code=status.HTTP_204_NO_CONTENT)
