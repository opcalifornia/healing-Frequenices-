"""The tools GAIA can use, and the code that runs them.

Every input is validated here before it is used: with streamed tool input the model's
arguments are not checked by the API, and they are untrusted anyway.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Any

from . import content


def _obj(props: dict[str, Any]) -> dict[str, Any]:
    return {"type": "object", "properties": props, "required": list(props), "additionalProperties": False}


TOOLS: list[dict[str, Any]] = [
    {
        "name": "get_profile",
        "description": "Get what the person has shared: goals, health considerations, activity level, daily time budget, wake and bed times, allergens they avoid, what they did recently, and their local time. Call this before planning or recommending.",
        "input_schema": _obj({}),
    },
    {
        "name": "search_content",
        "description": "Search everything in Rooted: tools and screens, breathing techniques, movement routines, combos, programs, foods and herbs, recipes, additives and sound sessions. Results are already filtered for the person's health considerations. Call this before recommending anything.",
        "input_schema": _obj({
            "query": {"type": "string", "description": "What the person wants, in plain words, e.g. 'fall asleep', 'afternoon energy', 'digestion'."},
            "kinds": {"type": "array", "items": {"type": "string", "enum": content.KINDS}, "description": "Limit to these kinds, or an empty list for all."},
            "max_minutes": {"type": ["integer", "null"], "description": "Only items this long or shorter, or null."},
        }),
    },
    {
        "name": "get_item",
        "description": "Get full details of one item from search_content by its id, including sources.",
        "input_schema": _obj({"id": {"type": "string"}}),
    },
    {
        "name": "lookup_additive",
        "description": "Look up a food additive by name or E-number in Rooted's evidence-rated additive library.",
        "input_schema": _obj({"query": {"type": "string", "description": "A name or E-number, e.g. 'aspartame' or 'E171'."}}),
    },
    {
        "name": "show_options",
        "description": "Show one to three recommended items as tappable cards under your reply. Use ids returned by search_content.",
        "input_schema": _obj({"ids": {"type": "array", "items": {"type": "string"}, "description": "One to three item ids."}}),
    },
    {
        "name": "open_screen",
        "description": "Open a screen in the app for the person, using the 'to' link of an item from search_content (for example '/breathe?open=478'). Use when they want to go somewhere or start something.",
        "input_schema": _obj({
            "to": {"type": "string"},
            "label": {"type": "string", "description": "A few words naming what you opened, e.g. '4-7-8 breathing'."},
        }),
    },
    {
        "name": "crisis_handoff",
        "description": "Open the crisis support sheet with 988 and other lines. Call immediately if anything suggests the person may be in danger, or thinking about suicide or self-harm.",
        "input_schema": _obj({"reason": {"type": "string"}}),
    },
]
for _t in TOOLS:
    _t["strict"] = True
    _t["eager_input_streaming"] = True


@dataclass
class Context:
    """What the tools know about this request."""

    profile: dict[str, Any]
    flags_on: set[str]


@dataclass
class Outcome:
    content: str
    error: bool = False
    #: Events for the app: cards to show, a screen to open, the crisis sheet.
    events: list[dict[str, Any]] = field(default_factory=list)


def _err(msg: str) -> Outcome:
    return Outcome(json.dumps({"error": msg}), error=True)


def run_tool(name: str, args: Any, ctx: Context) -> Outcome:
    if not isinstance(args, dict):
        return _err("INVALID_JSON")
    if name == "get_profile":
        return Outcome(json.dumps(ctx.profile))
    if name == "search_content":
        q, kinds, mm = args.get("query"), args.get("kinds"), args.get("max_minutes")
        if not isinstance(q, str) or not isinstance(kinds, list) or not (mm is None or isinstance(mm, int)):
            return _err("INVALID_JSON")
        results = content.search(q[:200], [k for k in kinds if isinstance(k, str)], mm, ctx.flags_on)
        return Outcome(json.dumps({"results": results}))
    if name == "get_item":
        item_id = args.get("id")
        if not isinstance(item_id, str):
            return _err("INVALID_JSON")
        item = content.get_item(item_id, ctx.flags_on)
        return Outcome(json.dumps(item)) if item else _err("Not found, or not suitable for this person.")
    if name == "lookup_additive":
        q = args.get("query")
        if not isinstance(q, str):
            return _err("INVALID_JSON")
        return Outcome(json.dumps({"results": content.search(q[:100], ["additive"], None, ctx.flags_on, limit=3)}))
    if name == "show_options":
        ids = args.get("ids")
        if not isinstance(ids, list):
            return _err("INVALID_JSON")
        cards = [c for c in (content.get_item(i, ctx.flags_on) for i in ids[:3] if isinstance(i, str)) if c]
        if not cards:
            return _err("None of those ids are available.")
        slim = [{k: c[k] for k in ("id", "kind", "title", "summary", "evidence", "minutes", "to") if k in c} for c in cards]
        return Outcome(json.dumps({"shown": [c["id"] for c in slim]}), events=[{"type": "cards", "items": slim}])
    if name == "open_screen":
        to, label = args.get("to"), args.get("label")
        if not isinstance(to, str) or not isinstance(label, str):
            return _err("INVALID_JSON")
        if not content.route_ok(to):
            return _err("That isn't a screen in the app. Use a 'to' link from search_content.")
        return Outcome(json.dumps({"opened": to}), events=[{"type": "navigate", "to": to, "label": label[:60]}])
    if name == "crisis_handoff":
        return Outcome(json.dumps({"opened": "crisis support"}), events=[{"type": "crisis"}])
    return _err(f"Unknown tool {name}")
