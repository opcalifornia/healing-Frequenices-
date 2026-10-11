"""Turns the raw seed tables into catalog documents and resolves rails.

`build_titles()` returns title documents; `SECTIONS` declares which rails each
nav section shows, as filters, so a new title appears in every matching rail
automatically. `resolve_catalog()` is shared by the API and the JSON export.
"""

from __future__ import annotations

import hashlib
from typing import Any

from .articles import ARTICLES
from .sessions import PROGRAMS, SESSIONS
from .shows import SHOWS

CATALOG_VERSION = 1

BANDS = [
    ("delta", 0.5, 4.0),
    ("theta", 4.0, 8.0),
    ("alpha", 8.0, 13.0),
    ("beta", 13.0, 30.0),
    ("gamma", 30.0, 100.0),
]

GOAL_HUES = {"sleep": 238, "meditate": 282, "focus": 188, "relax": 152, "energize": 28}
CATEGORY_HUES = {
    "Teaching Series": 210,
    "Science of Sound": 196,
    "Healing Journeys": 320,
    "Sleep Stories": 240,
    "Practice": 160,
    "Kids & Family": 44,
}
PATTERNS = ["chladni", "rings", "wave", "rosette"]
SOLFEGGIO = [174, 285, 396, 417, 528, 639, 741, 852, 963]


def band_for(beat: float) -> str:
    for name, lo, hi in BANDS:
        if lo <= beat < hi:
            return name
    raise ValueError(f"beat {beat} Hz is outside the supported 0.5-100 Hz range")


def _h(s: str) -> int:
    return int(hashlib.sha1(s.encode()).hexdigest()[:8], 16)


def _art(tid: str, base_hue: int, pattern: str | None = None) -> dict[str, Any]:
    h = _h(tid)
    return {"hue": (base_hue + (h % 61) - 30) % 360, "pattern": pattern or PATTERNS[h % len(PATTERNS)]}


def build_titles() -> list[dict[str, Any]]:
    titles: list[dict[str, Any]] = []

    for tid, name, goal, carrier, beat, minutes, noise, solf, iso, tagline, desc, flags in SESSIONS:
        tags = [goal, band_for(beat), f"{beat:g} Hz"]
        if noise:
            tags.append(f"{noise} noise")
        if solf:
            tags.append("solfeggio")
        if iso:
            tags.append("isochronic")
        titles.append(
            {
                "id": tid,
                "kind": "session",
                "name": name,
                "tagline": tagline,
                "description": desc,
                "goal": goal,
                "band": band_for(beat),
                "carrier": carrier,
                "beat": beat,
                "durationMin": minutes,
                "noise": noise,
                "solfeggio": solf,
                "isochronic": iso,
                "tags": tags,
                "year": 2026,
                "isNew": bool(flags.get("isNew")),
                "featured": bool(flags.get("featured")),
                "topRank": flags.get("topRank"),
                "art": _art(tid, GOAL_HUES[goal]),
            }
        )

    for p in PROGRAMS:
        stages = [{"at": at, "beat": beat, "label": label} for at, beat, label in p["stages"]]
        flags = p.get("flags", {})
        titles.append(
            {
                "id": p["id"],
                "kind": "program",
                "name": p["name"],
                "tagline": p["tagline"],
                "description": p["description"],
                "goal": p["goal"],
                "band": p["band"],
                "carrier": p["carrier"],
                "beat": stages[0]["beat"],
                "durationMin": p["minutes"],
                "noise": p["noise"],
                "solfeggio": None,
                "isochronic": False,
                "stages": stages,
                "tags": ["deep sync", p["goal"], "program", f"{p['noise']} noise"],
                "year": 2026,
                "isNew": bool(flags.get("isNew")),
                "featured": bool(flags.get("featured")),
                "topRank": flags.get("topRank"),
                "art": _art(p["id"], GOAL_HUES[p["goal"]], "interference"),
            }
        )

    for s in SHOWS:
        seasons = []
        for si, names in enumerate(s["seasons"], start=1):
            eps = []
            for ei, ename in enumerate(names, start=1):
                eps.append(
                    {
                        "id": f"{s['id']}-s{si}e{ei}",
                        "number": ei,
                        "name": ename,
                        "description": f"{ename}{'' if ename[-1] in '?!.' else '.'} {s['tagline']}",
                        "durationMin": 12 + (_h(f"{s['id']}{si}{ei}") % 5) * 6,
                    }
                )
            seasons.append({"number": si, "episodes": eps})
        titles.append(
            {
                "id": s["id"],
                "kind": "show",
                "name": s["name"],
                "tagline": s["tagline"],
                "description": s["description"],
                "category": s["category"],
                "host": s["host"],
                "tags": ["show", s["category"].lower(), "coming soon"],
                "year": s["year"],
                "comingSoon": True,
                "featured": bool(s.get("featured")),
                "isNew": False,
                "topRank": None,
                "seasons": seasons,
                "art": _art(s["id"], CATEGORY_HUES[s["category"]]),
            }
        )
    return titles


# --- Sections and rails ------------------------------------------------------
# filter keys: kind, goal, band, flag, category, hasSolfeggio, ids; sort: topRank|name|duration|-year


def _rail(rid: str, title: str, shape: str = "landscape", type_: str = "standard", **f: Any) -> dict[str, Any]:
    return {"id": rid, "title": title, "type": type_, "shape": shape, "filter": f}


PLAYABLE = ["session", "program"]

SECTIONS: list[dict[str, Any]] = [
    {
        "id": "home",
        "name": "Home",
        "hero": {"flag": "featured", "kind": PLAYABLE, "limit": 7},
        "rails": [
            _rail("continue", "Continue Listening", type_="continue"),
            _rail("featured", "Featured", kind=PLAYABLE, flag="featured"),
            _rail("top10", "Top 10 Today", "poster", "top10", kind=PLAYABLE, sort="topRank", limit=10),
            _rail("new", "New Sessions", kind=PLAYABLE, flag="isNew"),
            _rail("deep-sync", "Deep Sync Programs", kind=["program"]),
            _rail("goal-sleep", "Sleep Better", "poster", kind=PLAYABLE, goal="sleep"),
            _rail("goal-meditate", "Meditate", kind=PLAYABLE, goal="meditate"),
            _rail("goal-focus", "Focus", kind=PLAYABLE, goal="focus"),
            _rail("goal-relax", "Relax", "poster", kind=PLAYABLE, goal="relax"),
            _rail("goal-energize", "Energize", kind=PLAYABLE, goal="energize"),
            _rail("coming-soon", "Coming Soon: Shows", "poster", kind=["show"]),
        ],
    },
    {
        "id": "frequencies",
        "name": "Frequencies",
        "hero": {"ids": ["deep-sync-1", "theta-temple", "alpha-shore", "deep-work", "deep-rest", "attention-40"]},
        "rails": [
            _rail("build", "Build Your Own", type_="build"),
            _rail("deep-sync", "Deep Sync", kind=["program"]),
            _rail("band-delta", "Delta · 0.5–4 Hz · Sleep", kind=PLAYABLE, band="delta", sort="beat"),
            _rail("band-theta", "Theta · 4–8 Hz · Meditation", "poster", kind=PLAYABLE, band="theta", sort="beat"),
            _rail("band-alpha", "Alpha · 8–13 Hz · Relaxation", kind=PLAYABLE, band="alpha", sort="beat"),
            _rail("band-beta", "Beta · 13–30 Hz · Focus", kind=PLAYABLE, band="beta", sort="beat"),
            _rail("band-gamma", "Gamma · 30+ Hz", "poster", kind=PLAYABLE, band="gamma", sort="beat"),
            _rail("goal-sleep", "Sleep", kind=PLAYABLE, goal="sleep"),
            _rail("goal-meditate", "Meditate", "poster", kind=PLAYABLE, goal="meditate"),
            _rail("goal-focus", "Focus", kind=PLAYABLE, goal="focus"),
            _rail("goal-relax", "Relax", kind=PLAYABLE, goal="relax"),
            _rail("goal-energize", "Energize", "poster", kind=PLAYABLE, goal="energize"),
            _rail("solfeggio", "With Solfeggio Tones", kind=PLAYABLE, hasSolfeggio=True),
            _rail("quick", "Quick Sessions · 20 min or less", kind=PLAYABLE, maxDuration=20, sort="duration"),
        ],
    },
    {
        "id": "shows",
        "name": "Shows",
        "hero": {"kind": ["show"], "flag": "featured", "limit": 7},
        "rails": [
            _rail("shows-featured", "Coming Soon", "poster", kind=["show"], flag="featured"),
            _rail("cat-teaching", "Teaching & Practice", kind=["show"], category=["Teaching Series", "Practice"]),
            _rail("cat-science", "Science of Sound", kind=["show"], category=["Science of Sound"]),
            _rail("cat-journeys", "Journeys & Sleep Stories", "poster", kind=["show"], category=["Healing Journeys", "Sleep Stories"]),
            _rail("shows-new", "New in 2026", kind=["show"], year=2026),
            _rail("cat-family", "Family & Bedtime", kind=["show"], category=["Kids & Family", "Sleep Stories", "Practice"]),
            _rail("shows-az", "All Series A–Z", "poster", kind=["show"], sort="name"),
        ],
    },
]


def _match(t: dict[str, Any], f: dict[str, Any]) -> bool:
    if "ids" in f and t["id"] not in f["ids"]:
        return False
    if "kind" in f and t["kind"] not in f["kind"]:
        return False
    for key in ("goal", "band", "year"):
        if key in f and t.get(key) != f[key]:
            return False
    if "category" in f and t.get("category") not in f["category"]:
        return False
    if "flag" in f and not t.get(f["flag"]):
        return False
    if f.get("hasSolfeggio") and not t.get("solfeggio"):
        return False
    if "maxDuration" in f and (t.get("durationMin") or 0) > f["maxDuration"]:
        return False
    return True


def filter_titles(titles: list[dict[str, Any]], f: dict[str, Any]) -> list[str]:
    if f.get("sort") == "topRank":
        matched = [t for t in titles if _match(t, f) and t.get("topRank")]
        matched.sort(key=lambda t: t["topRank"])
    else:
        matched = [t for t in titles if _match(t, f)]
        sort = f.get("sort")
        if sort == "name":
            matched.sort(key=lambda t: t["name"].lower())
        elif sort == "beat":
            matched.sort(key=lambda t: t.get("beat") or 0)
        elif sort == "duration":
            matched.sort(key=lambda t: t.get("durationMin") or 0)
    if "ids" in f:
        order = {tid: i for i, tid in enumerate(f["ids"])}
        matched.sort(key=lambda t: order[t["id"]])
    ids = [t["id"] for t in matched]
    return ids[: f["limit"]] if "limit" in f else ids


def resolve_section(section: dict[str, Any], titles: list[dict[str, Any]]) -> dict[str, Any]:
    rails = []
    for r in section["rails"]:
        ids = filter_titles(titles, r["filter"]) if r["filter"] else []
        rails.append({"id": r["id"], "title": r["title"], "type": r["type"], "shape": r["shape"], "titleIds": ids})
    return {
        "id": section["id"],
        "name": section["name"],
        "heroIds": filter_titles(titles, section["hero"]),
        "rails": rails,
    }


def resolve_catalog(
    titles: list[dict[str, Any]],
    sections: list[dict[str, Any]] | None = None,
    articles: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    sections = sections if sections is not None else SECTIONS
    return {
        "version": CATALOG_VERSION,
        "titles": {t["id"]: t for t in titles},
        "sections": {s["id"]: resolve_section(s, titles) for s in sections},
        "articles": articles if articles is not None else ARTICLES,
    }
