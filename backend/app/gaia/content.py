"""Search over the content index built from the app (frontend/scripts/build-gaia-index.mjs).

GAIA can only recommend items that come back from here, and anything a person's
profile rules out never comes back at all.
"""

from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

INDEX_PATH = Path(__file__).with_name("content_index.json")

KINDS = ["tool", "breathing", "movement", "combo", "program", "food", "recipe", "additive", "nutrient", "sound"]

_STOP = {
    "a", "an", "and", "are", "can", "do", "for", "help", "how", "i", "im", "in", "is", "it", "me", "my", "of",
    "on", "or", "some", "something", "the", "to", "want", "what", "with", "you", "need", "feel", "feeling", "get",
}

# Everyday words people use, mapped to the words the content uses.
_SYNONYMS = {
    "sleep": ["sleep", "bed", "drift", "rest", "wind", "relax", "wound"], "insomnia": ["sleep", "bed", "relax"], "tired": ["energy", "sleep"],
    "asleep": ["sleep", "bed", "drift", "relax", "wound"], "sleeping": ["sleep", "bed"], "sleepy": ["sleep", "wind"], "awake": ["sleep", "bed"],
    "wired": ["sleep", "wind", "relax"], "restless": ["sleep", "relax", "settle"], "night": ["sleep", "bed", "evening"],
    "relax": ["relax", "settle", "ease"], "breathe": ["breath", "breathing"], "breathing": ["breath", "breathing"],
    "morning": ["morning", "wake", "energy"], "evening": ["evening", "wind", "sleep"], "walk": ["walk", "move"],
    "stress": ["stress", "relax", "settle"], "stressed": ["stress", "relax", "settle"], "anxious": ["stress", "panic", "relax", "settle"],
    "anxiety": ["stress", "panic", "relax"], "overwhelmed": ["stress", "relax", "settle", "ground"], "panic": ["panic", "sigh", "ground"],
    "focus": ["focus", "steady"], "energy": ["energy", "morning", "wake"], "sluggish": ["energy", "wake"],
    "digestion": ["gut", "digest", "fiber"], "gut": ["gut", "digest", "fiber"], "bloated": ["gut", "digest"],
    "back": ["stretch", "desk", "aches"], "stiff": ["stretch", "aches"], "sad": ["mood", "gratitude", "support"],
    "lonely": ["support", "circle", "gratitude"], "grateful": ["gratitude"], "scan": ["scan", "barcode", "additive"],
}


@lru_cache(maxsize=1)
def load_index() -> list[dict[str, Any]]:
    data = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    return list(data["items"])


@lru_cache(maxsize=1)
def _by_id() -> dict[str, dict[str, Any]]:
    return {i["id"]: i for i in load_index()}


def known_routes() -> set[str]:
    """Every route (path only) that some index item points to."""
    return {i["to"].split("?")[0].split("#")[0] for i in load_index()}


def _tokens(text: str) -> list[str]:
    words = [w for w in re.findall(r"[a-z0-9]+", text.lower()) if len(w) > 1 and w not in _STOP]
    out: list[str] = []
    for w in words:
        out.append(w)
        out.extend(_SYNONYMS.get(w, []))
    return out


def _allowed(item: dict[str, Any], flags_on: set[str]) -> bool:
    return not (set(item.get("exclude_if") or []) & flags_on)


def public(item: dict[str, Any], flags_on: set[str]) -> dict[str, Any]:
    """What the model sees about an item."""
    out = {k: item[k] for k in ("id", "kind", "title", "summary", "evidence", "minutes", "to", "level") if item.get(k) not in (None, "", [])}
    cautions = list(item.get("cautions") or [])
    if set(item.get("care_if") or []) & flags_on:
        cautions.insert(0, "Given this person's profile, suggest checking with their clinician or pharmacist first.")
    if cautions:
        out["cautions"] = cautions
    if item.get("why"):
        out["why"] = item["why"]
    return out


def search(query: str, kinds: list[str] | None, max_minutes: int | None, flags_on: set[str], limit: int = 6) -> list[dict[str, Any]]:
    toks = _tokens(query)
    wanted = {k for k in (kinds or []) if k in KINDS}
    scored: list[tuple[float, dict[str, Any]]] = []
    for item in load_index():
        if wanted and item["kind"] not in wanted:
            continue
        if not _allowed(item, flags_on):
            continue
        if max_minutes and item.get("minutes") and item["minutes"] > max_minutes:
            continue
        title = item["title"].lower()
        body = f'{item.get("summary", "")} {item.get("why", "")}'.lower()
        goals = " ".join(item.get("goals") or []).lower()
        score = 0.0
        for t in toks:
            if t in title:
                score += 3
            if t in goals:
                score += 2
            if t in body:
                score += 1
        if score > 0:
            # Prefer things people can do over reference entries.
            if item["kind"] in {"breathing", "movement", "combo", "program"}:
                score += 0.5
            scored.append((score, item))
    scored.sort(key=lambda x: (-x[0], x[1]["id"]))
    return [public(i, flags_on) for _, i in scored[:limit]]


def get_item(item_id: str, flags_on: set[str]) -> dict[str, Any] | None:
    item = _by_id().get(item_id)
    if not item or not _allowed(item, flags_on):
        return None
    out = public(item, flags_on)
    if item.get("sources"):
        out["sources"] = item["sources"]
    return out


def route_ok(to: str) -> bool:
    """Only routes the app really has, with an optional ?open= or #section."""
    m = re.fullmatch(r"(/[a-z0-9\-/]*)(\?open=[a-z0-9\-]+)?(#[a-z0-9\-]+)?", to)
    if not m:
        return False
    path = m.group(1)
    return path in known_routes() or path in {"/", "/support", "/about-you", "/calendar", "/scan", "/journey", "/guide", "/week"}
