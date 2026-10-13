"""GAIA tests, with a scripted stand-in for the Claude API (no network, no key, no cost)."""

import copy
import json
from types import SimpleNamespace as NS

import pytest

from app.config import get_settings
from app.gaia import content
from app.gaia.safety import active_flags, flags, sounds_like_crisis
from app.gaia.tools import TOOLS, Context, run_tool
from app.main import create_app  # noqa: F401  (imported for side effects in fixtures)
from app.routers import gaia as gaia_router


# ---------- a scripted Claude ----------

def text(t):
    return NS(type="text", text=t)


def tool(name, args, id_="tu_1"):
    return NS(type="tool_use", name=name, input=args, id=id_)


def final(blocks, stop="end_turn"):
    return NS(content=blocks, stop_reason=stop)


class FakeStream:
    def __init__(self, msg):
        self.msg = msg

    async def __aenter__(self):
        return self

    async def __aexit__(self, *a):
        return False

    def __aiter__(self):
        async def gen():
            for b in self.msg.content:
                if b.type == "text":
                    yield NS(type="text", text=b.text)
        return gen()

    async def get_final_message(self):
        return self.msg


class FakeClient:
    def __init__(self, turns, screen="OK"):
        self.turns = list(turns)
        self.calls = []
        self.screen_calls = 0
        outer = self

        class Msgs:
            def stream(self, **kw):
                outer.calls.append(copy.deepcopy({k: v for k, v in kw.items() if k != "tools"}) | {"tools": kw["tools"]})
                return FakeStream(outer.turns.pop(0))

        class Plain:
            async def create(self, **kw):
                outer.screen_calls += 1
                return NS(content=[text(screen)], stop_reason="end_turn")

        self.beta = NS(messages=Msgs())
        self.messages = Plain()


@pytest.fixture()
def gaia_on(monkeypatch):
    monkeypatch.setenv("GAIA_ENABLED", "true")
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key")
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


def use_fake(client, fake):
    client.app.dependency_overrides[gaia_router.get_gaia_client] = lambda: fake


def events(resp):
    return [json.loads(line[6:]) for line in resp.text.splitlines() if line.startswith("data: ")]


def chat(client, headers, text_, profile=None, history=None):
    msgs = (history or []) + [{"role": "user", "text": text_}]
    return client.post("/api/gaia/chat", json={"messages": msgs, "profile": profile or {}}, headers=headers)


# ---------- safety and content ----------

def test_flags_match_the_app():
    assert flags(["pregnant"]) == {"noPowerBreathing": True, "noFasting": True, "careSauna": True, "seated": False, "careHerbs": True, "breathHoldCare": True}
    assert active_flags(["mobility"]) == {"seated"}
    assert active_flags([]) == set()


def test_crisis_words():
    assert sounds_like_crisis("I don't see the point anymore")
    assert sounds_like_crisis("I want to end it all")
    assert not sounds_like_crisis("I'm so tired of bad sleep")


def test_search_filters_out_what_a_profile_rules_out():
    open_ = {r["id"] for r in content.search("power breathing energy", ["breathing"], None, set())}
    assert "breath:power" in open_
    careful = {r["id"] for r in content.search("power breathing energy", ["breathing"], None, active_flags(["pregnant"]))}
    assert "breath:power" not in careful and "breath:box" not in careful
    assert content.get_item("breath:478", active_flags(["epilepsy"])) is None
    seated = content.search("stretch walk yoga", ["movement"], None, active_flags(["mobility"]))
    assert all(r["id"] == "move:desk" for r in seated)


def test_search_finds_everyday_words_and_adds_clinician_note_for_herbs():
    sleep = content.search("can't sleep", None, None, set())
    assert sleep and any(r["kind"] in {"breathing", "combo", "sound"} for r in sleep)
    herb_id = next(i["id"] for i in content.load_index() if i.get("care_if"))
    careful = content.get_item(herb_id, active_flags(["thinners"]))
    assert careful["cautions"][0].startswith("Given this person's profile")
    plain = content.get_item(herb_id, set())
    assert not plain["cautions"][0].startswith("Given this person's profile")


def test_everyday_sleep_words_find_safe_practices():
    for q in ["fall asleep", "I'm wired at night", "restless"]:
        res = content.search(q, ["breathing"], None, active_flags(["pregnant"]))
        assert res, q
        assert all(r["id"] not in {"breath:478", "breath:power", "breath:box"} for r in res)


def test_routes_are_checked():
    assert content.route_ok("/breathe?open=478")
    assert content.route_ok("/nourish#pantry")
    assert not content.route_ok("https://evil.example")
    assert not content.route_ok("/admin")
    assert not content.route_ok("/breathe?open=478&x=1")


def test_tools_are_strict_and_validate_input():
    assert all(t["strict"] and t["input_schema"]["additionalProperties"] is False for t in TOOLS)
    ctx = Context(profile={"goals": ["sleep"]}, flags_on=set())
    assert run_tool("search_content", "not a dict", ctx).error
    assert run_tool("search_content", {"query": 5, "kinds": [], "max_minutes": None}, ctx).error
    bad = run_tool("open_screen", {"to": "/nope", "label": "x"}, ctx)
    assert bad.error and not bad.events
    ok = run_tool("open_screen", {"to": "/breathe?open=478", "label": "4-7-8"}, ctx)
    assert ok.events == [{"type": "navigate", "to": "/breathe?open=478", "label": "4-7-8"}]
    cards = run_tool("show_options", {"ids": ["breath:calm", "nope"]}, ctx)
    assert cards.events[0]["type"] == "cards" and [c["id"] for c in cards.events[0]["items"]] == ["breath:calm"]
    assert json.loads(run_tool("get_profile", {}, ctx).content) == {"goals": ["sleep"]}


# ---------- endpoints ----------

def test_off_by_default(client, auth):
    h = auth()
    assert client.get("/api/gaia/status", headers=h).json() == {"enabled": False}
    assert chat(client, h, "hi").status_code == 404


def test_status_and_allowlist(client, auth, gaia_on, monkeypatch):
    h = auth()
    assert client.get("/api/gaia/status").json() == {"enabled": False}  # not signed in
    assert client.get("/api/gaia/status", headers=h).json() == {"enabled": True}
    monkeypatch.setenv("GAIA_ALLOWED_EMAILS", "founder@example.com")
    get_settings.cache_clear()
    assert client.get("/api/gaia/status", headers=h).json() == {"enabled": False}
    assert chat(client, h, "hi").status_code == 404


def test_needs_sign_in(client, gaia_on):
    assert client.post("/api/gaia/chat", json={"messages": [{"role": "user", "text": "hi"}]}).status_code == 401


def test_validates_the_conversation(client, auth, gaia_on):
    h = auth()
    assert client.post("/api/gaia/chat", json={"messages": [{"role": "assistant", "text": "hi"}]}, headers=h).status_code == 422
    assert client.post("/api/gaia/chat", json={"messages": [{"role": "user", "text": "x"}] * 31}, headers=h).status_code == 422
    assert client.post("/api/gaia/chat", json={"messages": [{"role": "user", "text": "x" * 4001}]}, headers=h).status_code == 422


def test_streams_a_plain_reply(client, auth, gaia_on):
    fake = FakeClient([final([text("Hello! "), text("How can I help?")])])
    use_fake(client, fake)
    r = chat(client, auth(), "hi")
    assert r.status_code == 200 and r.headers["content-type"].startswith("text/event-stream")
    evs = events(r)
    assert [e["type"] for e in evs] == ["text", "text", "done"]
    call = fake.calls[0]
    assert call["model"] == "claude-opus-5-5"
    assert call["fallbacks"] == "default" and call["betas"] == ["server-side-fallback-2026-07-01"]
    assert call["system"][0]["text"].startswith("You are GAIA")
    assert fake.screen_calls == 1


def test_tool_loop_filters_by_profile_and_opens_screens(client, auth, gaia_on):
    fake = FakeClient([
        final([tool("search_content", {"query": "power breathing energy", "kinds": ["breathing"], "max_minutes": None})], stop="tool_use"),
        final([tool("open_screen", {"to": "/breathe?open=calm", "label": "Settle in"}, id_="tu_2")], stop="tool_use"),
        final([text("I opened Settle in for you.")]),
    ])
    use_fake(client, fake)
    evs = events(chat(client, auth(), "I need energy", profile={"considerations": ["pregnant", "made-up"]}))
    assert {"type": "navigate", "to": "/breathe?open=calm", "label": "Settle in"} in evs
    assert evs[-1] == {"type": "done"}
    # What went back to the model after the search: no power breathing for a pregnant profile.
    sent = fake.calls[1]["messages"][-1]["content"][0]
    ids = {r["id"] for r in json.loads(sent["content"])["results"]}
    assert "breath:power" not in ids
    # History is append-only: each round adds the assistant turn and the tool results.
    assert len(fake.calls[2]["messages"]) == len(fake.calls[1]["messages"]) + 2


def test_crisis_words_skip_the_model(client, auth, gaia_on):
    fake = FakeClient([])
    use_fake(client, fake)
    evs = events(chat(client, auth(), "I don't see the point anymore"))
    assert evs[0] == {"type": "crisis"} and "988" in evs[1]["text"] and evs[-1] == {"type": "done"}
    assert fake.calls == [] and fake.screen_calls == 0


def test_crisis_screen_catches_what_words_miss(client, auth, gaia_on):
    fake = FakeClient([], screen="RISK")
    use_fake(client, fake)
    evs = events(chat(client, auth(), "everything feels heavy and I've been giving my things away"))
    assert evs[0] == {"type": "crisis"} and fake.calls == []


def test_refusal_is_handled(client, auth, gaia_on):
    fake = FakeClient([final([], stop="refusal")])
    use_fake(client, fake)
    evs = events(chat(client, auth(), "hello"))
    assert evs[0]["type"] == "text" and "can't help" in evs[0]["text"]


def test_rate_limited(client, auth, gaia_on, monkeypatch):
    h = auth()
    client.app.state.gaia_hour_limiter.limit = 2
    for _ in range(2):
        use_fake(client, FakeClient([final([text("ok")])]))
        assert chat(client, h, "hi").status_code == 200
    use_fake(client, FakeClient([final([text("ok")])]))
    assert chat(client, h, "hi").status_code == 429
