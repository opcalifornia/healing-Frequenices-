from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import get_settings
from .db import get_database

_bearer = HTTPBearer(auto_error=False)
#: Pinned: decode only ever accepts this algorithm, so "none" and RS/HS confusion are refused.
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    # bcrypt.checkpw compares digests in constant time.
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except ValueError:
        return False


_DUMMY_HASH: str | None = None


def burn_password_check(password: str) -> None:
    """Spend the same bcrypt time as a real check, so a login for an unknown
    email takes as long as a wrong password (no timing-based enumeration)."""
    global _DUMMY_HASH
    if _DUMMY_HASH is None:
        _DUMMY_HASH = hash_password("not-a-real-password")
    verify_password(password, _DUMMY_HASH)


def create_token(user_id: str) -> str:
    s = get_settings()
    now = datetime.now(timezone.utc)
    payload = {"sub": user_id, "iat": now, "exp": now + timedelta(minutes=s.jwt_expire_minutes)}
    return jwt.encode(payload, s.jwt_secret, algorithm=ALGORITHM)


def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(
            token,
            get_settings().jwt_secret,
            algorithms=[ALGORITHM],
            options={"require": ["exp", "iat", "sub"], "verify_exp": True, "verify_iat": True},
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token") from exc
    return str(payload["sub"])


async def current_user(creds: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> dict[str, Any]:
    if creds is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not signed in")
    user_id = decode_token(creds.credentials)
    user = await get_database().users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Account not found")
    return user
