def test_register_login_me(client, auth):
    headers = auth()
    me = client.get("/api/me", headers=headers).json()
    assert me["user"]["email"] == "listener@example.com"
    assert len(me["profiles"]) == 1

    assert client.post("/api/auth/register", json={"email": "LISTENER@example.com", "password": "another pass"}).status_code == 409
    assert client.post("/api/auth/login", json={"email": "listener@example.com", "password": "wrong password"}).status_code == 401
    ok = client.post("/api/auth/login", json={"email": "Listener@Example.com", "password": "correct horse"})
    assert ok.status_code == 200 and ok.json()["token"]


def test_auth_required_and_bad_token(client):
    assert client.get("/api/me").status_code == 401
    assert client.get("/api/me", headers={"Authorization": "Bearer nope"}).status_code == 401
    assert client.post("/api/auth/register", json={"email": "a@b.co", "password": "short"}).status_code == 422


def test_profiles_crud_and_limit(client, auth):
    h = auth()
    p = client.post("/api/profiles", json={"name": "Sam", "hue": 120}, headers=h)
    assert p.status_code == 201
    pid = p.json()["id"]
    assert client.patch(f"/api/profiles/{pid}", json={"name": "Sammy"}, headers=h).json()["name"] == "Sammy"
    for i in range(4):
        assert client.post("/api/profiles", json={"name": f"P{i}", "hue": 10}, headers=h).status_code == 201
    assert client.post("/api/profiles", json={"name": "Seventh", "hue": 10}, headers=h).status_code == 400
    assert client.delete(f"/api/profiles/{pid}", headers=h).status_code == 204
    assert len(client.get("/api/profiles", headers=h).json()) == 5


def test_library_favorites_continue_custom(client, auth):
    h = auth()
    pid = client.get("/api/me", headers=h).json()["profiles"][0]["id"]
    base = f"/api/profiles/{pid}"

    assert client.put(f"{base}/favorites/deep-rest", headers=h).status_code == 204
    assert client.put(f"{base}/favorites/deep-rest", headers=h).status_code == 204  # idempotent
    assert client.put(f"{base}/favorites/not-a-title", headers=h).status_code == 404
    assert client.put(f"{base}/continue/theta-temple", json={"position": 120, "duration": 1800}, headers=h).status_code == 204
    assert client.put(f"{base}/continue/theta-temple", json={"position": 240, "duration": 1800}, headers=h).status_code == 204
    custom = {"id": "c-abc12345", "name": "My Alpha", "carrier": 210, "beat": 10, "noise": "pink", "solfeggio": None, "isochronic": False}
    assert client.post(f"{base}/custom-sessions", json=custom, headers=h).status_code == 201
    assert client.post(f"{base}/custom-sessions", json={**custom, "id": "c-bad", "beat": 90}, headers=h).status_code == 422

    lib = client.get(f"{base}/library", headers=h).json()
    assert lib["favorites"] == ["deep-rest"]
    assert lib["continue"][0]["titleId"] == "theta-temple" and lib["continue"][0]["position"] == 240
    assert lib["custom"][0]["name"] == "My Alpha"

    client.delete(f"{base}/favorites/deep-rest", headers=h)
    client.delete(f"{base}/continue/theta-temple", headers=h)
    client.delete(f"{base}/custom-sessions/c-abc12345", headers=h)
    assert client.get(f"{base}/library", headers=h).json() == {"favorites": [], "continue": [], "custom": []}


def test_profiles_are_private_to_their_account(client, auth):
    a = auth("a@example.com")
    b = auth("b@example.com")
    pid_a = client.get("/api/me", headers=a).json()["profiles"][0]["id"]
    assert client.get(f"/api/profiles/{pid_a}/library", headers=b).status_code == 404
    assert client.put(f"/api/profiles/{pid_a}/favorites/deep-rest", headers=b).status_code == 404
    assert client.delete(f"/api/profiles/{pid_a}", headers=b).status_code == 404


def test_billing_and_media_are_stubbed_until_configured(client, auth):
    h = auth()
    assert client.get("/api/billing/plans").json()["enabled"] is False
    assert client.post("/api/billing/checkout", headers=h).status_code == 501
    assert client.get("/api/media/deep-rest/audio", headers=h).status_code == 404


def test_profile_symbol_roundtrip_and_validation(client, auth):
    h = auth("sym@example.com")
    made = client.post("/api/profiles", json={"name": "Ana", "hue": 140, "symbol": "tree"}, headers=h)
    assert made.status_code == 201, made.text
    assert made.json()["symbol"] == "tree"
    pid = made.json()["id"]
    assert client.patch(f"/api/profiles/{pid}", json={"symbol": "wave"}, headers=h).json()["symbol"] == "wave"
    # Only the fixed list is accepted; photos or arbitrary strings are not.
    assert client.patch(f"/api/profiles/{pid}", json={"symbol": "data:image/png;base64,AAAA"}, headers=h).status_code == 422
    assert client.post("/api/profiles", json={"name": "Bo", "hue": 10, "symbol": "<script>"}, headers=h).status_code == 422
    # Extra fields such as a photo are ignored, never stored.
    r = client.patch(f"/api/profiles/{pid}", json={"photo": "x" * 1000}, headers=h)
    assert r.status_code == 200 and "photo" not in r.json()
    listed = {p["id"]: p for p in client.get("/api/profiles", headers=h).json()}
    assert listed[pid]["symbol"] == "wave"
    # Profiles without one still work.
    assert client.post("/api/profiles", json={"name": "Cy", "hue": 20}, headers=h).json()["symbol"] is None
