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
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except ValueError:
        return False


def create_token(user_id: str) -> str:
    s = get_settings()
    now = datetime.now(timezone.utc)
    payload = {"sub": user_id, "iat": now, "exp": now + timedelta(minutes=s.jwt_expire_minutes)}
    return jwt.encode(payload, s.jwt_secret, algorithm=ALGORITHM)


def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, get_settings().jwt_secret, algorithms=[ALGORITHM])
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
