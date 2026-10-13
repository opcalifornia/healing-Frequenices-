"""Safety rules GAIA applies in code, before the model sees anything.

`flags()` mirrors `flags()` in frontend/src/store/wellness.ts. Keep them in sync:
the content index marks items with the flag names that rule them out.
"""

from __future__ import annotations

import re

CONSIDERATIONS = {"pregnant", "heart", "bp", "epilepsy", "diabetes", "thinners", "mobility", "eating"}


def flags(considerations: list[str] | set[str]) -> dict[str, bool]:
    c = set(considerations)
    return {
        "noPowerBreathing": bool(c & {"pregnant", "heart", "bp", "epilepsy"}),
        "noFasting": bool(c & {"pregnant", "diabetes", "eating"}),
        "careSauna": bool(c & {"pregnant", "heart", "bp"}),
        "seated": "mobility" in c,
        "careHerbs": bool(c & {"pregnant", "thinners", "diabetes", "bp"}),
        "breathHoldCare": bool(c & {"pregnant", "heart", "epilepsy"}),
    }


def active_flags(considerations: list[str] | set[str]) -> set[str]:
    return {k for k, v in flags(considerations).items() if v}


# Mirrors CRISIS_PATTERNS in frontend/src/rooted/supportContent.ts. A first, fast check;
# the model-based screen runs as well. Not a diagnosis.
_CRISIS = [
    re.compile(p, re.I)
    for p in (
        r"\bkill(ing)? my ?self\b",
        r"\bsuicid",
        r"\bwant(ing)? to die\b",
        r"\bend (it all|my life)\b",
        r"\b(don'?t|do not) want to (be here|live|wake up)\b",
        r"\bno reason to live\b",
        r"\bhurt(ing)? my ?self\b",
        r"\bbetter off without me\b",
        r"\bself[- ]harm",
        r"\b(don'?t|do not) see the point (anymore|any more)\b",
    )
]


def sounds_like_crisis(text: str) -> bool:
    return any(p.search(text) for p in _CRISIS)


CRISIS_REPLY = (
    "I'm really glad you told me. You don't have to go through this alone. "
    "If you're in the US, you can call or text 988 any time, day or night, to talk with someone who's trained to help. "
    "If you're in danger right now, call 911. I've opened the support options for you."
)
