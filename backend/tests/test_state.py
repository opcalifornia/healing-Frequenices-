def _profile(client, headers):
    return client.get("/api/profiles", headers=headers).json()[0]["id"]


def test_state_roundtrip_and_last_write_wins(client, auth):
    h = auth()
    pid = _profile(client, h)
    assert client.get(f"/api/profiles/{pid}/state", headers=h).json() == {"keys": {}}

    body = {"data": {"list": [{"id": "oats", "name": "Oats"}]}, "updatedAt": "2026-10-11T10:00:00Z"}
    r = client.put(f"/api/profiles/{pid}/state/nourish", json=body, headers=h)
    assert r.status_code == 200, r.text
    got = client.get(f"/api/profiles/{pid}/state", headers=h).json()["keys"]["nourish"]
    assert got["data"]["list"][0]["id"] == "oats"

    # An older write from another device is refused.
    stale = {"data": {"list": []}, "updatedAt": "2026-10-11T09:00:00Z"}
    assert client.put(f"/api/profiles/{pid}/state/nourish", json=stale, headers=h).status_code == 409
    # A newer write wins.
    newer = {"data": {"list": []}, "updatedAt": "2026-10-11T11:00:00Z"}
    assert client.put(f"/api/profiles/{pid}/state/nourish", json=newer, headers=h).status_code == 200
    assert client.get(f"/api/profiles/{pid}/state", headers=h).json()["keys"]["nourish"]["data"]["list"] == []


def test_state_keys_privacy_and_delete(client, auth):
    a = auth("a@example.com")
    b = auth("b@example.com")
    pid = _profile(client, a)
    ok = {"data": {"x": 1}, "updatedAt": "2026-10-11T10:00:00Z"}
    assert client.put(f"/api/profiles/{pid}/state/not-a-key", json=ok, headers=a).status_code == 404
    assert client.put(f"/api/profiles/{pid}/state/wellness", json=ok, headers=a).status_code == 200
    # Another account can't read or write it.
    assert client.get(f"/api/profiles/{pid}/state", headers=b).status_code == 404
    assert client.put(f"/api/profiles/{pid}/state/wellness", json=ok, headers=b).status_code == 404
    # Delete everything.
    assert client.delete(f"/api/profiles/{pid}/state", headers=a).status_code == 204
    assert client.get(f"/api/profiles/{pid}/state", headers=a).json() == {"keys": {}}


def test_state_size_limit(client, auth):
    h = auth()
    pid = _profile(client, h)
    big = {"data": {"blob": "x" * (300 * 1024)}, "updatedAt": "2026-10-11T10:00:00Z"}
    assert client.put(f"/api/profiles/{pid}/state/practice", json=big, headers=h).status_code == 413
