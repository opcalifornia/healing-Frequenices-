"""Catalog storage and rail resolution.

Titles, section definitions (rails as filters) and articles live in MongoDB.
Rails are resolved on read with the same code the JSON export uses, so a new
title shows up in every matching rail without touching rail definitions.
"""

from __future__ import annotations

import re
import time
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from ..seed.build import resolve_catalog

_CACHE_TTL = 60.0
_cache: dict[str, Any] = {"at": 0.0, "catalog": None}


def invalidate() -> None:
    _cache.update(at=0.0, catalog=None)


def _clean(doc: dict[str, Any]) -> dict[str, Any]:
    doc = dict(doc)
    doc.pop("_id", None)
    return doc


async def seed_catalog(
    db: AsyncIOMotorDatabase,
    titles: list[dict[str, Any]],
    sections: list[dict[str, Any]],
    articles: list[dict[str, Any]],
) -> dict[str, int]:
    """Replace catalog collections with the seed content (idempotent)."""
    await db.titles.delete_many({})
    await db.titles.insert_many([{**t, "_id": t["id"]} for t in titles])
    await db.sections.delete_many({})
    await db.sections.insert_many([{**s, "_id": s["id"], "order": i} for i, s in enumerate(sections)])
    await db.articles.delete_many({})
    await db.articles.insert_many([{**a, "_id": a["slug"], "order": i} for i, a in enumerate(articles)])
    invalidate()
    return {"titles": len(titles), "sections": len(sections), "articles": len(articles)}


async def load_catalog(db: AsyncIOMotorDatabase) -> dict[str, Any]:
    now = time.monotonic()
    if _cache["catalog"] is not None and now - _cache["at"] < _CACHE_TTL:
        return _cache["catalog"]
    titles = [_clean(t) async for t in db.titles.find({})]
    sections = [_clean(s) async for s in db.sections.find({}).sort("order", 1)]
    articles = [_clean(a) async for a in db.articles.find({}).sort("order", 1)]
    for a in articles:
        a.pop("order", None)
    catalog = resolve_catalog(titles, sections, articles)
    _cache.update(at=now, catalog=catalog)
    return catalog


def search(catalog: dict[str, Any], query: str, limit: int = 50) -> list[dict[str, Any]]:
    """Ranked keyword search over names, taglines, tags, goals, bands and Hz values.

    Small catalog, so this runs in memory; swap for Atlas Search when it grows.
    """
    q = query.strip().lower()
    if not q:
        return []
    terms = q.split()
    scored: list[tuple[int, str, dict[str, Any]]] = []
    for t in catalog["titles"].values():
        hay = " ".join(
            str(x)
            for x in [
                t["name"], t.get("tagline"), t.get("description"), t.get("goal"), t.get("band"),
                t.get("category"), t.get("host"), *t.get("tags", []),
                f"{t['beat']:g}hz" if t.get("beat") else "",
            ]
            if x
        ).lower()
        if not all(term in hay for term in terms):
            continue
        name = t["name"].lower()
        score = 1 + (10 if name.startswith(q) else 5 if q in name else 0)
        if any(tag.lower() == q for tag in t.get("tags", [])):
            score += 3
        scored.append((score, name, t))
    scored.sort(key=lambda x: (-x[0], x[1]))
    return [t for _, _, t in scored[:limit]]


SLUG_RE = re.compile(r"^[a-z0-9-]{1,64}$")
