"""Who may play what. Everything is free today; when Stripe launches, check
`user["plan"]` against a title's `plan` field here."""

from __future__ import annotations

from typing import Any


def can_play(user: dict[str, Any] | None, title: dict[str, Any]) -> bool:
    required = title.get("plan", "free")
    if required == "free":
        return True
    return bool(user and user.get("plan") == required)
