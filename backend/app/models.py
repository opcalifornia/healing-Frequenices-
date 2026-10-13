"""Request/response schemas. Catalog documents are passed through as stored
(camelCase, matching the front end's types.ts)."""

from __future__ import annotations

import re

from pydantic import BaseModel, EmailStr, Field, field_validator

SOLFEGGIO = {174, 285, 396, 417, 528, 639, 741, 852, 963}
AMBIENCES = ("rain", "waterfall", "stream", "rainforest")


#: A few of the most common passwords that pass the length rule. Small on
#: purpose (NIST 800-63B asks for a blocklist; this catches the worst offenders).
COMMON_PASSWORDS = {
    "password", "password1", "password123", "12345678", "123456789", "1234567890",
    "qwertyuiop", "qwerty123", "iloveyou", "11111111", "00000000", "abcdefgh",
    "abc12345", "sunshine", "princess", "football", "baseball", "welcome1",
    "letmein1", "trustno1", "passw0rd", "starwars", "whatever", "superman",
}


class Credentials(BaseModel):
    """Login body. No strength rules here: an old password must still work, and
    a 422 for short input would only reveal the policy, not the account."""

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    #: Invite code of the person who shared the link, if any.
    ref: str | None = Field(default=None, min_length=4, max_length=16, pattern=r"^[A-Za-z0-9_-]+$")

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        # bcrypt only looks at the first 72 bytes; longer passwords would be silently truncated.
        if len(v.encode()) > 72:
            raise ValueError("Password is too long. Please use 72 characters or fewer")
        if v.lower() in COMMON_PASSWORDS or len(set(v)) < 3:
            raise ValueError("That password is too easy to guess. Try a longer phrase")
        return v


class UserOut(BaseModel):
    id: str
    email: str
    plan: str = "free"
    refCode: str | None = None


class AuthOut(BaseModel):
    token: str
    user: UserOut


#: The healing symbols a profile picture may use (see frontend/src/rooted/symbols.tsx).
#: Profile photos are never sent to the server; only this id is.
SYMBOLS = {"crystal", "tree", "wave", "lotus", "moon", "sun", "mountain", "feather", "leaf", "flame", "stone", "seedling", "shell", "star", "heart", "bowl", "dewdrop", "lantern", "bonsai", "aurora", "mandala", "constellation"}


def _check_symbol(v: str | None) -> str | None:
    if v is not None and v not in SYMBOLS:
        raise ValueError("Unknown symbol")
    return v


class ProfileIn(BaseModel):
    name: str = Field(min_length=1, max_length=20)
    hue: int = Field(ge=0, le=360)
    kids: bool = False
    symbol: str | None = None

    _symbol = field_validator("symbol")(_check_symbol)


class ProfilePatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=20)
    hue: int | None = Field(default=None, ge=0, le=360)
    symbol: str | None = None

    _symbol = field_validator("symbol")(_check_symbol)


class ProfileOut(BaseModel):
    id: str
    name: str
    hue: int
    kids: bool = False
    symbol: str | None = None


class ProgressIn(BaseModel):
    # Seconds; nothing in the catalog runs longer than a day. Rejects NaN/Infinity too.
    position: float = Field(ge=0, le=7 * 24 * 3600, allow_inf_nan=False)
    duration: float = Field(ge=0, le=7 * 24 * 3600, allow_inf_nan=False)


class CustomSessionIn(BaseModel):
    id: str
    name: str = Field(min_length=1, max_length=40)
    carrier: float = Field(ge=100, le=400)
    beat: float = Field(ge=0.5, le=40)
    noise: str | None = None
    solfeggio: int | None = None
    isochronic: bool = False
    ambience: str | None = None
    music: str | None = None
    createdAt: str | None = Field(default=None, max_length=40)

    @field_validator("id")
    @classmethod
    def check_id(cls, v: str) -> str:
        if not re.fullmatch(r"c-[a-z0-9]{4,32}", v):
            raise ValueError("custom session ids look like c-xxxxxxxx")
        return v

    @field_validator("noise")
    @classmethod
    def check_noise(cls, v: str | None) -> str | None:
        if v not in (None, "pink", "brown", "surf"):
            raise ValueError("noise must be pink, brown, surf or null")
        return v

    @field_validator("ambience")
    @classmethod
    def check_ambience(cls, v: str | None) -> str | None:
        if v not in (None, *AMBIENCES):
            raise ValueError("unknown nature soundscape")
        return v

    @field_validator("music")
    @classmethod
    def check_music(cls, v: str | None) -> str | None:
        if v not in (None, "sleep", "meditate", "relax", "focus", "energize"):
            raise ValueError("unknown music style")
        return v

    @field_validator("solfeggio")
    @classmethod
    def check_solfeggio(cls, v: int | None) -> int | None:
        if v is not None and v not in SOLFEGGIO:
            raise ValueError("not a solfeggio tone")
        return v
