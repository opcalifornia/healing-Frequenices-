"""Content checks run before every seed/export so bad data never ships."""

from __future__ import annotations

from typing import Any

from .build import SOLFEGGIO, band_for


class ContentError(ValueError):
    pass


def validate(titles: list[dict[str, Any]]) -> None:
    seen: set[str] = set()
    errors: list[str] = []
    for t in titles:
        tid = t["id"]
        if tid in seen:
            errors.append(f"duplicate id {tid}")
        seen.add(tid)
        if t["kind"] == "show":
            if not t.get("seasons"):
                errors.append(f"{tid}: show has no seasons")
            continue
        if not 100 <= t["carrier"] <= 400:
            errors.append(f"{tid}: carrier {t['carrier']} outside 100-400 Hz")
        if t["kind"] == "session" and band_for(t["beat"]) != t["band"]:
            errors.append(f"{tid}: band {t['band']} does not match beat {t['beat']}")
        if t.get("solfeggio") and t["solfeggio"] not in SOLFEGGIO:
            errors.append(f"{tid}: {t['solfeggio']} is not a solfeggio tone")
        if t.get("noise") not in (None, "pink", "brown"):
            errors.append(f"{tid}: unknown noise {t['noise']}")
        stages = t.get("stages") or []
        for a, b in zip(stages, stages[1:]):
            if b["at"] <= a["at"]:
                errors.append(f"{tid}: stages out of order")
        if stages and stages[-1]["at"] >= t["durationMin"]:
            errors.append(f"{tid}: last stage starts after the program ends")
        for s in stages:
            band_for(s["beat"])
    if errors:
        raise ContentError("; ".join(errors))
