from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, Query

from ..db import get_database
from ..services.catalog import load_catalog, search

router = APIRouter(tags=["catalog"])


async def _catalog() -> dict[str, Any]:
    return await load_catalog(get_database())


@router.get("/catalog")
async def get_catalog() -> dict[str, Any]:
    """Everything the app shell needs in one cacheable response."""
    return await _catalog()


@router.get("/sections")
async def list_sections() -> list[dict[str, str]]:
    c = await _catalog()
    return [{"id": s["id"], "name": s["name"]} for s in c["sections"].values()]


@router.get("/sections/{section_id}")
async def get_section(section_id: str) -> dict[str, Any]:
    c = await _catalog()
    section = c["sections"].get(section_id)
    if not section:
        raise HTTPException(404, "Section not found")
    ids = set(section["heroIds"]) | {i for r in section["rails"] for i in r["titleIds"]}
    return {"section": section, "titles": {i: c["titles"][i] for i in ids}}


@router.get("/sections/{section_id}/rails/{rail_id}")
async def get_rail(section_id: str, rail_id: str) -> dict[str, Any]:
    c = await _catalog()
    section = c["sections"].get(section_id)
    rail = next((r for r in section["rails"] if r["id"] == rail_id), None) if section else None
    if not rail:
        raise HTTPException(404, "Rail not found")
    return {**rail, "titles": [c["titles"][i] for i in rail["titleIds"]]}


@router.get("/titles")
async def list_titles(
    kind: str | None = Query(None, pattern="^(session|program|show)$"),
    goal: str | None = None,
    band: str | None = None,
    limit: int = Query(100, ge=1, le=500),
) -> list[dict[str, Any]]:
    c = await _catalog()
    out = [
        t
        for t in c["titles"].values()
        if (not kind or t["kind"] == kind) and (not goal or t.get("goal") == goal) and (not band or t.get("band") == band)
    ]
    return out[:limit]


@router.get("/sessions")
async def list_sessions() -> list[dict[str, Any]]:
    """Playable titles: single sessions and Deep Sync programs."""
    c = await _catalog()
    return [t for t in c["titles"].values() if t["kind"] in ("session", "program")]


@router.get("/titles/{title_id}")
async def get_title(title_id: str) -> dict[str, Any]:
    c = await _catalog()
    t = c["titles"].get(title_id)
    if not t:
        raise HTTPException(404, "Title not found")
    return t


@router.get("/titles/{title_id}/episodes")
async def get_episodes(title_id: str, season: int | None = Query(None, ge=1)) -> dict[str, Any]:
    t = await get_title(title_id)
    seasons = t.get("seasons") or []
    if not seasons:
        raise HTTPException(404, "This title has no episodes")
    if season is not None:
        seasons = [s for s in seasons if s["number"] == season]
        if not seasons:
            raise HTTPException(404, "Season not found")
    return {"titleId": title_id, "comingSoon": bool(t.get("comingSoon")), "seasons": seasons}


@router.get("/articles")
async def list_articles() -> list[dict[str, Any]]:
    c = await _catalog()
    return [{k: v for k, v in a.items() if k != "body"} for a in c["articles"]]


@router.get("/articles/{slug}")
async def get_article(slug: str) -> dict[str, Any]:
    c = await _catalog()
    a = next((a for a in c["articles"] if a["slug"] == slug), None)
    if not a:
        raise HTTPException(404, "Article not found")
    return a


@router.get("/search")
async def search_titles(q: str = Query("", max_length=100), limit: int = Query(50, ge=1, le=100)) -> dict[str, Any]:
    c = await _catalog()
    return {"query": q, "results": search(c, q, limit)}
