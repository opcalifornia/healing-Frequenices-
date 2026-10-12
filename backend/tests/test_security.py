from datetime import datetime, timedelta, timezone

import jwt
import pytest
from fastapi.testclient import TestClient

from app.config import Settings, get_settings
from app.ratelimit import SlidingWindowLimiter
from app.security import ALGORITHM

PW = "correct horse"


def _profile(client, headers):
    return client.get("/api/profiles", headers=headers).json()[0]["id"]


# --- 1. Auth rate limiting ---------------------------------------------------


def test_login_rate_limited_per_email(client, auth):
    auth()
    for _ in range(10):
        assert client.post("/api/auth/login", json={"email": "listener@example.com", "password": "wrong guess"}).status_code == 401
    r = client.post("/api/auth/login", json={"email": "listener@example.com", "password": PW})
    assert r.status_code == 429
    assert 0 < int(r.headers["retry-after"]) <= 15 * 60
    # Other accounts are unaffected by one address's limit.
    assert client.post("/api/auth/login", json={"email": "other@example.com", "password": "wrong guess"}).status_code == 401


def test_successful_login_resets_email_budget(client, auth):
    auth()
    for _ in range(9):
        client.post("/api/auth/login", json={"email": "listener@example.com", "password": "wrong guess"})
    assert client.post("/api/auth/login", json={"email": "listener@example.com", "password": PW}).status_code == 200
    assert client.post("/api/auth/login", json={"email": "listener@example.com", "password": "wrong guess"}).status_code == 401


def test_auth_rate_limited_per_ip_across_emails(client):
    codes = [client.post("/api/auth/login", json={"email": f"u{i}@example.com", "password": "wrong guess"}).status_code for i in range(31)]
    assert codes[:30] == [401] * 30 and codes[30] == 429
    # Register shares the per-IP budget.
    assert client.post("/api/auth/register", json={"email": "new@example.com", "password": PW}).status_code == 429


def test_register_rate_limited_per_email(client):
    codes = [client.post("/api/auth/register", json={"email": "dup@example.com", "password": PW}).status_code for _ in range(11)]
    assert codes[0] == 201 and codes[1:10] == [409] * 9 and codes[10] == 429


def test_forwarded_for_ignored_unless_trust_proxy(client):
    # Spoofed X-Forwarded-For must not buy a fresh per-IP budget.
    for i in range(30):
        client.post("/api/auth/login", json={"email": f"u{i}@example.com", "password": "x"}, headers={"X-Forwarded-For": f"10.0.0.{i}"})
    r = client.post("/api/auth/login", json={"email": "z@example.com", "password": "x"}, headers={"X-Forwarded-For": "10.9.9.9"})
    assert r.status_code == 429


def test_forwarded_for_used_when_trust_proxy(client):
    client.app.state.trust_proxy = True
    for i in range(30):
        client.post("/api/auth/login", json={"email": f"u{i}@example.com", "password": "x"}, headers={"X-Forwarded-For": "spoofed, 203.0.113.1"})
    assert client.post("/api/auth/login", json={"email": "z@example.com", "password": "x"}, headers={"X-Forwarded-For": "203.0.113.1"}).status_code == 429
    # A different real client (right-most hop) still gets through.
    assert client.post("/api/auth/login", json={"email": "z@example.com", "password": "x"}, headers={"X-Forwarded-For": "203.0.113.1, 198.51.100.7"}).status_code == 401


def test_sliding_window_limiter_expires_and_bounds_memory():
    now = [0.0]
    lim = SlidingWindowLimiter(limit=2, window=10, max_keys=4, clock=lambda: now[0])
    assert lim.hit("a") is None and lim.hit("a") is None
    assert lim.hit("a") == 10 and lim.blocked("a") == 10
    now[0] = 5
    assert lim.hit("a") == 5
    now[0] = 10.5
    assert lim.blocked("a") is None and lim.hit("a") is None
    for k in "bcdefgh":
        lim.hit(k)
    assert len(lim._hits) <= 4


# --- 2. Passwords and enumeration ---------------------------------------------


def test_login_error_is_identical_for_unknown_email_and_wrong_password(client, auth):
    auth()
    unknown = client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "wrong guess"})
    wrong = client.post("/api/auth/login", json={"email": "listener@example.com", "password": "wrong guess"})
    assert unknown.status_code == wrong.status_code == 401
    assert unknown.json() == wrong.json()


def test_unknown_email_still_runs_bcrypt(client, monkeypatch):
    import app.routers.auth as auth_router

    calls = []
    monkeypatch.setattr(auth_router, "burn_password_check", lambda pw: calls.append(pw))
    client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "wrong guess"})
    assert calls == ["wrong guess"]


@pytest.mark.parametrize("password", ["password123", "aaaaaaaaaaaa", "é" * 37, "tiny7"])
def test_register_rejects_weak_or_truncatable_passwords(client, password):
    r = client.post("/api/auth/register", json={"email": "a@example.com", "password": password})
    assert r.status_code == 422
    assert password not in r.text  # 422s don't echo the submitted password back


def test_passwords_are_bcrypt_hashed(client, auth):
    import asyncio

    from app.db import get_database

    auth()
    user = asyncio.run(get_database().users.find_one({"email": "listener@example.com"}))
    assert user["password_hash"].startswith("$2") and PW not in user["password_hash"]


# --- 3. JWT -----------------------------------------------------------------


def _token(**claims):
    now = datetime.now(timezone.utc)
    payload = {"iat": now, "exp": now + timedelta(hours=1), **claims}
    return jwt.encode({k: v for k, v in payload.items() if v is not None}, get_settings().jwt_secret, algorithm=ALGORITHM)


def test_jwt_expired_none_alg_and_missing_claims_rejected(client, auth):
    h = auth()
    uid = client.get("/api/me", headers=h).json()["user"]["id"]
    assert client.get("/api/me", headers={"Authorization": f"Bearer {_token(sub=uid)}"}).status_code == 200

    past = datetime.now(timezone.utc) - timedelta(hours=2)
    expired = _token(sub=uid, iat=past, exp=past + timedelta(minutes=1))
    unsigned = jwt.encode({"sub": uid, "iat": datetime.now(timezone.utc), "exp": datetime.now(timezone.utc) + timedelta(hours=1)}, None, algorithm="none")
    no_exp = _token(sub=uid, exp=None)
    no_sub = _token()
    wrong_key = jwt.encode({"sub": uid, "iat": datetime.now(timezone.utc), "exp": datetime.now(timezone.utc) + timedelta(hours=1)}, "another-secret", algorithm=ALGORITHM)
    for bad in (expired, unsigned, no_exp, no_sub, wrong_key):
        assert client.get("/api/me", headers={"Authorization": f"Bearer {bad}"}).status_code == 401


def test_production_requires_long_jwt_secret():
    with pytest.raises(ValueError):
        Settings(environment="production", jwt_secret="short")
    with pytest.raises(ValueError):
        Settings(environment="Production", jwt_secret="dev-only-change-me")
    assert Settings(environment="production", jwt_secret="x" * 32).is_production


# --- 4. Security headers --------------------------------------------------------


def test_security_headers_everywhere(client, auth):
    h = auth()
    for r in (client.get("/api/health"), client.get("/api/profiles", headers=h), client.get("/api/nope")):
        assert r.headers["x-content-type-options"] == "nosniff"
        assert r.headers["referrer-policy"] == "no-referrer"
        assert r.headers["x-frame-options"] == "DENY"
        assert "strict-transport-security" not in r.headers  # only in production


def test_no_store_on_account_and_health_data(client, auth):
    h = auth()
    pid = _profile(client, h)
    for path in ("/api/me", "/api/profiles", f"/api/profiles/{pid}/state", f"/api/profiles/{pid}/library"):
        assert client.get(path, headers=h).headers["cache-control"] == "no-store", path
    assert client.post("/api/auth/login", json={"email": "listener@example.com", "password": PW}).headers["cache-control"] == "no-store"
    assert "no-store" not in client.get("/api/catalog").headers.get("cache-control", "")


def test_calendar_feed_keeps_its_cache_control(client, auth):
    h = auth()
    pid = _profile(client, h)
    url = client.post(f"/api/profiles/{pid}/calendar-feed", json={}, headers=h).json()["url"]
    r = client.get(url[url.index("/api/"):])
    assert r.headers["cache-control"] == "private, max-age=300"
    assert r.headers["referrer-policy"] == "no-referrer"


def test_hsts_in_production(monkeypatch):
    from mongomock_motor import AsyncMongoMockClient

    from app.db import set_database
    from app.main import create_app

    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("JWT_SECRET", "p" * 40)
    monkeypatch.setenv("SEED_ON_STARTUP", "false")
    get_settings.cache_clear()
    set_database(AsyncMongoMockClient()["hf_prod"])
    try:
        with TestClient(create_app()) as c:
            assert c.get("/api/health").headers["strict-transport-security"].startswith("max-age=31536000")
    finally:
        set_database(None)
        get_settings.cache_clear()


# --- 5. Input limits ----------------------------------------------------------


def test_oversized_body_rejected_before_parsing(client, auth):
    h = auth()
    pid = _profile(client, h)
    huge = b'{"data":{"x":"' + b"a" * (1024 * 1024 + 10) + b'"},"updatedAt":"2026-10-11T10:00:00Z"}'
    r = client.put(f"/api/profiles/{pid}/state/practice", content=huge, headers={**h, "Content-Type": "application/json"})
    assert r.status_code == 413

    def chunks():  # no Content-Length: streamed body is counted too
        yield b'{"data":{"x":"'
        for _ in range(20):
            yield b"a" * 65536
        yield b'"},"updatedAt":"2026-10-11T10:00:00Z"}'

    r = client.put(f"/api/profiles/{pid}/state/practice", content=chunks(), headers={**h, "Content-Type": "application/json"})
    assert r.status_code == 413


def test_deeply_nested_state_rejected(client, auth):
    h = auth()
    pid = _profile(client, h)
    deep = '{"updatedAt":"2026-10-11T10:00:00Z","data":{"x":' + "[" * 5000 + "]" * 5000 + "}}"
    r = client.put(f"/api/profiles/{pid}/state/practice", content=deep, headers={**h, "Content-Type": "application/json"})
    assert r.status_code == 422
    ok = {"data": {"events": [{"id": "e", "skip": {"2026-10-14": True}}]}, "updatedAt": "2026-10-11T10:00:00Z"}
    assert client.put(f"/api/profiles/{pid}/state/calendar", json=ok, headers=h).status_code == 200


def test_progress_and_custom_session_bounds(client, auth):
    h = auth()
    pid = _profile(client, h)
    hdr = {**h, "Content-Type": "application/json"}
    assert client.put(f"/api/profiles/{pid}/continue/theta-temple", content='{"position":Infinity,"duration":NaN}', headers=hdr).status_code == 422
    assert client.put(f"/api/profiles/{pid}/continue/theta-temple", json={"position": 1, "duration": 1e12}, headers=h).status_code == 422
    custom = {"id": "c-abc12345", "name": "x", "carrier": 210, "beat": 10, "createdAt": "x" * 1000}
    assert client.post(f"/api/profiles/{pid}/custom-sessions", json=custom, headers=h).status_code == 422
    assert client.post(f"/api/profiles/{pid}/custom-sessions", json={**custom, "createdAt": None, "name": "x" * 41}, headers=h).status_code == 422


# --- 6. Calendar feed -----------------------------------------------------------


def test_feed_rate_limited_per_token(client, auth):
    h = auth()
    pid = _profile(client, h)
    url = client.post(f"/api/profiles/{pid}/calendar-feed", json={}, headers=h).json()["url"]
    path = url[url.index("/api/"):]
    assert all(client.get(path).status_code == 200 for _ in range(60))
    r = client.get(path)
    assert r.status_code == 429 and int(r.headers["retry-after"]) <= 60


def test_feed_unknown_token_lookups_rate_limited_per_ip(client, auth):
    h = auth()
    pid = _profile(client, h)
    url = client.post(f"/api/profiles/{pid}/calendar-feed", json={}, headers=h).json()["url"]
    for i in range(60):
        assert client.get(f"/api/calendar/guess-{i:04d}-aaaaaaaaaaaaaaaa.ics").status_code == 404
    assert client.get("/api/calendar/guess-9999-aaaaaaaaaaaaaaaa.ics").status_code == 429
    # The guessing IP is cut off, even for a real token.
    assert client.get(url[url.index("/api/"):]).status_code == 429


def test_feed_contains_only_user_text_and_no_line_injection(client, auth):
    from app.routers.calendar_feed import build_ics

    ev = {
        "id": "ev-1", "title": "Walk", "date": "2026-10-12", "time": "12:45", "repeat": "daily",
        "note": "bring water", "kind": "move", "secret": "do-not-leak",
        "skip": {"2026-10-14\nATTENDEE:mailto:evil@example.com": True, "2026-10-15": True},
    }
    out = build_ics([ev], "https://rooted.app")
    assert "DESCRIPTION:bring water\\nOpen in Rooted: https://rooted.app/" in out
    assert "do-not-leak" not in out and "ATTENDEE" not in out
    assert "EXDATE:20261015T124500" in out
    assert "\n" not in out.replace("\r\n", "")


# --- 7. Account deletion ------------------------------------------------------------


def test_delete_account_removes_all_data(client, auth):
    import asyncio

    from app.db import get_database

    h = auth()
    other = auth("other@example.com")
    pid = _profile(client, h)
    pid2 = client.post("/api/profiles", json={"name": "Kid", "hue": 10}, headers=h).json()["id"]
    other_pid = _profile(client, other)
    state = {"data": {"events": []}, "updatedAt": "2026-10-11T10:00:00Z"}
    for p, hh in ((pid, h), (pid2, h), (other_pid, other)):
        assert client.put(f"/api/profiles/{p}/favorites/deep-rest", headers=hh).status_code == 204
        assert client.put(f"/api/profiles/{p}/continue/theta-temple", json={"position": 1, "duration": 9}, headers=hh).status_code == 204
        assert client.post(f"/api/profiles/{p}/custom-sessions", json={"id": "c-abc12345", "name": "A", "carrier": 210, "beat": 10}, headers=hh).status_code == 201
        assert client.put(f"/api/profiles/{p}/state/support", json=state, headers=hh).status_code == 200
        assert client.post(f"/api/profiles/{p}/calendar-feed", json={}, headers=hh).status_code == 200
    feed_url = client.post(f"/api/profiles/{pid}/calendar-feed", json={}, headers=h).json()["url"]

    r = client.delete("/api/me", headers=h)
    assert r.status_code == 204

    db = get_database()

    async def counts(pids):
        out = {"profiles": await db.profiles.count_documents({"_id": {"$in": pids}})}
        for name in ("favorites", "progress", "custom_sessions", "app_state", "calendar_feeds"):
            out[name] = await db[name].count_documents({"profile_id": {"$in": pids}})
        out["users"] = await db.users.count_documents({"email": "listener@example.com"})
        return out

    assert set(asyncio.run(counts([pid, pid2])).values()) == {0}
    # The token no longer works, the feed is gone, and the email can sign up again.
    assert client.get("/api/me", headers=h).status_code == 401
    assert client.get(feed_url[feed_url.index("/api/"):]).status_code == 404
    assert client.post("/api/auth/login", json={"email": "listener@example.com", "password": PW}).status_code == 401
    # Other accounts are untouched.
    lib = client.get(f"/api/profiles/{other_pid}/library", headers=other).json()
    assert lib["favorites"] == ["deep-rest"] and len(lib["custom"]) == 1
    assert "support" in client.get(f"/api/profiles/{other_pid}/state", headers=other).json()["keys"]
    assert client.post("/api/auth/register", json={"email": "listener@example.com", "password": PW}).status_code == 201


def test_delete_account_requires_auth(client):
    assert client.delete("/api/me").status_code == 401
