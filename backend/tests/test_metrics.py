import asyncio
from datetime import datetime, timezone

import pytest

from app.config import get_settings
from app.db import get_database


def _docs():
    return asyncio.run(get_database().metrics_daily.find({}, {"_id": 0}).to_list(None))


@pytest.fixture()
def admin(monkeypatch):
    monkeypatch.setenv("METRICS_ADMIN_TOKEN", "s3cret-admin-token")
    get_settings.cache_clear()
    yield {"X-Admin-Token": "s3cret-admin-token"}
    get_settings.cache_clear()


def test_events_increment_daily_counters(client):
    body = {"events": [
        {"event": "app_open", "day_bucket": "0"},
        {"event": "first_win_started"},
        {"event": "first_win_started"},
        {"event": "first_win_completed"},
    ]}
    r = client.post("/api/metrics", json=body)
    assert r.status_code == 204
    assert client.post("/api/metrics", json={"events": [{"event": "app_open", "day_bucket": "0"}]}).status_code == 204

    today = datetime.now(timezone.utc).date().isoformat()
    got = {(d["event"], d["day_bucket"]): d["count"] for d in _docs()}
    assert got == {("app_open", "0"): 2, ("first_win_started", None): 2, ("first_win_completed", None): 1}
    assert all(d["day"] == today for d in _docs())


def test_accepts_text_plain_beacon(client):
    r = client.post("/api/metrics", content=b'{"events":[{"event":"tour_completed"}]}', headers={"Content-Type": "text/plain;charset=UTF-8"})
    assert r.status_code == 204
    assert _docs()[0]["event"] == "tour_completed"


def test_nothing_identifying_is_stored(client, auth):
    h = auth()
    client.post("/api/metrics", json={"events": [{"event": "app_open", "day_bucket": "1"}]}, headers={**h, "User-Agent": "Secret/1.0", "X-Forwarded-For": "203.0.113.9"})
    docs = _docs()
    assert len(docs) == 1
    assert set(docs[0]) == {"day", "event", "day_bucket", "count"}
    flat = repr(docs)
    assert "Secret" not in flat and "203.0.113" not in flat and "testclient" not in flat


def test_day_bucket_only_kept_for_app_open(client):
    client.post("/api/metrics", json={"events": [{"event": "guide_opened", "day_bucket": "7-29"}]})
    assert _docs()[0]["day_bucket"] is None


@pytest.mark.parametrize("body", [
    {"events": [{"event": "mood_logged"}]},
    {"events": [{"event": "app_open", "day_bucket": "3"}]},
    {"events": [{"event": "app_open", "user_id": "abc"}]},
    {"events": [{"event": "app_open"}], "profile_id": "abc"},
    {"events": [{"event": "app_open"}] * 51},
    {"events": []},
    {"nope": 1},
])
def test_rejects_bad_payloads(client, body):
    assert client.post("/api/metrics", json=body).status_code == 422
    assert _docs() == []


def test_rejects_garbage_and_large_bodies(client):
    assert client.post("/api/metrics", content=b"not json", headers={"Content-Type": "text/plain"}).status_code == 422
    big = b'{"events":[' + b",".join([b'{"event":"app_open"}'] * 50) + b"]," + b'"x":"' + b"a" * 9000 + b'"}'
    assert client.post("/api/metrics", content=big, headers={"Content-Type": "application/json"}).status_code == 413


def test_rate_limited_per_ip(client):
    ok = {"events": [{"event": "app_open"}]}
    codes = [client.post("/api/metrics", json=ok).status_code for _ in range(61)]
    assert codes[:60] == [204] * 60 and codes[60] == 429


def test_summary_hidden_without_setting(client):
    get_settings.cache_clear()
    assert client.get("/api/metrics/summary").status_code == 404
    assert client.get("/api/metrics/summary", headers={"X-Admin-Token": "anything"}).status_code == 404


def test_summary_needs_correct_token(client, admin):
    assert client.get("/api/metrics/summary").status_code == 401
    assert client.get("/api/metrics/summary", headers={"X-Admin-Token": "wrong"}).status_code == 401


def test_summary_numbers(client, admin):
    events = (
        [{"event": "app_open", "day_bucket": "0"}] * 10
        + [{"event": "app_open", "day_bucket": "1"}] * 4
        + [{"event": "app_open", "day_bucket": "30+"}] * 2
        + [{"event": "first_win_started"}] * 8
        + [{"event": "first_win_completed"}] * 6
    )
    for i in range(0, len(events), 50):
        assert client.post("/api/metrics", json={"events": events[i:i + 50]}).status_code == 204
    # An old row outside the window is ignored.
    asyncio.run(get_database().metrics_daily.insert_one({"day": "2000-01-01", "event": "app_open", "day_bucket": "0", "count": 99}))

    r = client.get("/api/metrics/summary?days=30", headers=admin)
    assert r.status_code == 200
    s = r.json()
    today = datetime.now(timezone.utc).date().isoformat()
    assert s["to"] == today and s["days"] == 30
    assert s["totals"] == {"app_open": 16, "first_win_started": 8, "first_win_completed": 6}
    assert s["daily"] == [{"day": today, "events": {"app_open": 16, "first_win_started": 8, "first_win_completed": 6}}]
    assert s["app_open_by_day_bucket"] == {"0": 10, "1": 4, "30+": 2}
    f = s["funnel"]
    assert f["first_win_completion_rate"] == 0.75
    assert (f["new_devices"], f["returned_next_day"], f["day2_return_rate"]) == (10, 4, 0.4)


def test_summary_rates_are_null_when_empty(client, admin):
    f = client.get("/api/metrics/summary", headers=admin).json()["funnel"]
    assert f["first_win_completion_rate"] is None and f["day2_return_rate"] is None
