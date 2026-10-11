from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from ..db import get_database
from ..security import current_user
from ..services import storage
from ..services.entitlements import can_play

router = APIRouter(prefix="/media", tags=["media"])


@router.get("/{title_id}/{kind}")
async def media_url(title_id: str, kind: str, user: dict[str, Any] = Depends(current_user)) -> dict[str, str]:
    """Signed URL for a hosted asset (kind = audio | video). Generated sessions need none."""
    title = await get_database().titles.find_one({"_id": title_id})
    key = (title or {}).get("media", {}).get(kind)
    if not key:
        raise HTTPException(404, "No hosted media for this title")
    if not can_play(user, title):
        raise HTTPException(402, "Upgrade required")
    try:
        return {"url": storage.signed_url(key)}
    except storage.StorageNotConfigured as exc:
        raise HTTPException(501, "Hosted media is not available yet") from exc
