import asyncio

import pytest

from app.config import get_settings
from app.db import get_database


def _docs():
    return asyncio.run(get_database().feedback.find({}, {"_id": 0}).to_list(None))


@pytest.fixture()
def admin(monkeypatch):
    monkeypatch.setenv("METRICS_ADMIN_TOKEN", "s3cret-admin-token")
    get_settings.cache_clear()
    yield {"X-Admin-Token": "s3cret-admin-token"}
    get_settings.cache_clear()


def test_stores_message_without_identity(client):
    r = client.post("/api/feedback", json={"kind": "confusing", "message": "  Where do I start? ", "page": "/breathe?x=1", "contact": " "})
    assert r.status_code == 204
    (d,) = _docs()
    assert d["message"] == "Where do I start?"
    assert d["page"] == "/breathe"
    assert d["contact"] is None
    assert set(d) == {"kind", "message", "page", "contact", "created_at"}


def test_rejects_empty_unknown_and_extra_fields(client):
    assert client.post("/api/feedback", json={"kind": "confusing", "message": "   "}).status_code == 422
    assert client.post("/api/feedback", json={"kind": "spam", "message": "hi"}).status_code == 422
    assert client.post("/api/feedback", json={"kind": "idea", "message": "hi", "email": "a@b.c"}).status_code == 422
    assert client.post("/api/feedback", json={"kind": "idea", "message": "x" * 2001}).status_code == 422
    assert _docs() == []


def test_rate_limited(client):
    codes = [client.post("/api/feedback", json={"kind": "love", "message": "nice"}).status_code for _ in range(9)]
    assert codes[:8] == [204] * 8
    assert codes[8] == 429


def test_read_back_needs_admin_token(client, admin):
    client.post("/api/feedback", json={"kind": "idea", "message": "Add a timer", "page": "/sleep"})
    assert client.get("/api/feedback").status_code == 401
    assert client.get("/api/feedback", headers={"X-Admin-Token": "wrong"}).status_code == 401
    r = client.get("/api/feedback", headers=admin)
    assert r.status_code == 200
    assert r.json()["count"] == 1 and r.json()["feedback"][0]["message"] == "Add a timer"


def test_read_back_hidden_without_token(client):
    assert client.get("/api/feedback").status_code == 404


def test_accepts_a_scanner_rating_note(client):
    r = client.post("/api/feedback", json={"kind": "rating", "message": "About Product X (barcode 123): rated too gently", "page": "/scan"})
    assert r.status_code == 204
