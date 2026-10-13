"""One GAIA turn: screen for crisis, then run the Claude tool loop and stream events.

Events (dicts) the app understands:
  {"type": "text", "text": ...}            words of the reply, as they arrive
  {"type": "cards", "items": [...]}        recommended items to show as cards
  {"type": "navigate", "to": ..., "label"} open a screen
  {"type": "crisis"}                       open the crisis sheet
  {"type": "error", "message": ...}        something went wrong
  {"type": "done"}

History is sent as plain text turns only. No thinking blocks are carried between turns,
so the history the API sees is append-only and nothing it checks can go stale. Within a
turn, the assistant's full content (thinking and tool calls included) goes back unchanged.
"""

from __future__ import annotations

import logging
from typing import Any, AsyncIterator

from .prompt import SYSTEM
from .safety import CRISIS_REPLY, sounds_like_crisis
from .tools import TOOLS, Context, run_tool

log = logging.getLogger("gaia")

MAX_ROUNDS = 6
FALLBACK_BETA = "server-side-fallback-2026-07-01"

SCREEN_SYSTEM = (
    "You screen messages sent to a wellness app's assistant. Answer with exactly one word: "
    "RISK if the message suggests the person may be thinking about suicide, self-harm, or is in immediate danger; "
    "otherwise OK. Ordinary stress, sadness, tiredness or bad sleep is OK."
)

REFUSAL_TEXT = "I can't help with that one, but I'm happy to help with anything else in Rooted."


async def screen_crisis(client: Any, model: str, text: str) -> bool:
    """A fast model check on top of the word list. Fails open to the word list on error."""
    try:
        res = await client.messages.create(
            model=model,
            max_tokens=1024,
            output_config={"effort": "low"},
            system=SCREEN_SYSTEM,
            messages=[{"role": "user", "content": text[:2000]}],
        )
    except Exception:  # noqa: BLE001 - the word list already ran; never block a reply on the screen
        log.warning("gaia crisis screen failed", exc_info=True)
        return False
    if getattr(res, "stop_reason", None) == "refusal":
        return True
    words = "".join(getattr(b, "text", "") for b in res.content if getattr(b, "type", "") == "text")
    return "RISK" in words.upper()


async def run_turn(
    client: Any,
    *,
    history: list[dict[str, str]],
    profile: dict[str, Any],
    flags_on: set[str],
    model: str,
    screen_model: str,
) -> AsyncIterator[dict[str, Any]]:
    user_text = history[-1]["content"]
    if sounds_like_crisis(user_text) or await screen_crisis(client, screen_model, user_text):
        yield {"type": "crisis"}
        yield {"type": "text", "text": CRISIS_REPLY}
        yield {"type": "done"}
        return

    ctx = Context(profile=profile, flags_on=flags_on)
    messages: list[dict[str, Any]] = [{"role": m["role"], "content": m["content"]} for m in history]
    crisis_sent = False

    for _ in range(MAX_ROUNDS):
        async with client.beta.messages.stream(
            model=model,
            max_tokens=16000,
            system=[{"type": "text", "text": SYSTEM}],
            tools=TOOLS,
            messages=messages,
            thinking={"type": "adaptive"},
            output_config={"effort": "low"},
            cache_control={"type": "ephemeral"},
            betas=[FALLBACK_BETA],
            fallbacks="default",
        ) as stream:
            async for event in stream:
                if event.type == "text":
                    yield {"type": "text", "text": event.text}
            final = await stream.get_final_message()

        if final.stop_reason == "refusal":
            yield {"type": "text", "text": REFUSAL_TEXT}
            break
        if final.stop_reason == "pause_turn":
            messages.append({"role": "assistant", "content": final.content})
            continue
        tool_uses = [b for b in final.content if b.type == "tool_use"]
        if not tool_uses:
            break
        if final.stop_reason == "max_tokens":
            yield {"type": "error", "message": "That answer got cut off. Try asking again."}
            break

        results = []
        for block in tool_uses:
            out = run_tool(block.name, block.input, ctx)
            for ev in out.events:
                if ev["type"] == "crisis":
                    if crisis_sent:
                        continue
                    crisis_sent = True
                yield ev
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": out.content, "is_error": out.error})
        messages.append({"role": "assistant", "content": final.content})
        messages.append({"role": "user", "content": results})
    else:
        yield {"type": "text", "text": "\n\nI'll stop there for now. Ask me to keep going if you'd like."}

    yield {"type": "done"}
