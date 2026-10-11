"""Request/response schemas. Catalog documents are passed through as stored
(camelCase, matching the front end's types.ts)."""

from __future__ import annotations

import re

from pydantic import BaseModel, EmailStr, Field, field_validator

SOLFEGGIO = {174, 285, 396, 417, 528, 639, 741, 852, 963}
AMBIENCES = ("rain", "waterfall", "stream", "rainforest")


class Credentials(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    id: str
    email: str
    plan: str = "free"


class AuthOut(BaseModel):
    token: str
    user: UserOut


class ProfileIn(BaseModel):
    name: str = Field(min_length=1, max_length=20)
    hue: int = Field(ge=0, le=360)
    kids: bool = False


class ProfilePatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=20)
    hue: int | None = Field(default=None, ge=0, le=360)


class ProfileOut(BaseModel):
    id: str
    name: str
    hue: int
    kids: bool = False


class ProgressIn(BaseModel):
    position: float = Field(ge=0)
    duration: float = Field(ge=0)


class CustomSessionIn(BaseModel):
    id: str
    name: str = Field(min_length=1, max_length=40)
    carrier: float = Field(ge=100, le=400)
    beat: float = Field(ge=0.5, le=40)
    noise: str | None = None
    solfeggio: int | None = None
    isochronic: bool = False
    ambience: str | None = None
    createdAt: str | None = None

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

    @field_validator("solfeggio")
    @classmethod
    def check_solfeggio(cls, v: int | None) -> int | None:
        if v is not None and v not in SOLFEGGIO:
            raise ValueError("not a solfeggio tone")
        return v
