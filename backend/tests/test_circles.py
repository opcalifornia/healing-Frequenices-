def _pid(client, h):
    return client.get("/api/profiles", headers=h).json()[0]["id"]


def _progress(client, h, pid, program, days):
    body = {"data": {"enrolled": {program: {"started": "2026-10-01", "done": {str(i): "2026-10-0%d" % (i + 1) for i in range(days)}}}}, "updatedAt": "2026-10-12T10:00:00Z"}
    assert client.put(f"/api/profiles/{pid}/state/programs", json=body, headers=h).status_code == 200


def test_create_join_progress_and_cheer(client, auth):
    a, b = auth("a@example.com"), auth("b@example.com")
    pa, pb = _pid(client, a), _pid(client, b)
    r = client.post(f"/api/profiles/{pa}/circles", json={"programId": "relax-7", "name": "Morning crew", "displayName": "Sam"}, headers=a)
    assert r.status_code == 201, r.text
    circle = r.json()
    assert len(circle["code"]) == 8 and circle["members"][0]["you"] is True

    j = client.post(f"/api/profiles/{pb}/circles/join", json={"code": circle["code"], "displayName": "Ana"}, headers=b)
    assert j.status_code == 200
    _progress(client, a, pa, "relax-7", 3)
    _progress(client, b, pb, "relax-7", 1)

    view = client.get(f"/api/profiles/{pa}/circles", headers=a).json()[0]
    by = {m["name"]: m for m in view["members"]}
    assert by["Sam"]["daysDone"] == 3 and by["Ana"]["daysDone"] == 1
    # Members never see each other's profile ids or any other data.
    assert set(by["Ana"]) == {"id", "name", "daysDone", "cheersToday", "you"}

    ana = by["Ana"]["id"]
    assert client.post(f"/api/profiles/{pa}/circles/{view['id']}/cheer", json={"to": ana}, headers=a).status_code == 204
    assert client.post(f"/api/profiles/{pa}/circles/{view['id']}/cheer", json={"to": ana}, headers=a).status_code == 204  # once a day
    me = by["Sam"]["id"]
    assert client.post(f"/api/profiles/{pa}/circles/{view['id']}/cheer", json={"to": me}, headers=a).status_code == 400
    seen_by_b = client.get(f"/api/profiles/{pb}/circles", headers=b).json()[0]
    assert next(m for m in seen_by_b["members"] if m["you"])["cheersToday"] == 1


def test_privacy_limits_and_leaving(client, auth):
    a, c = auth("a2@example.com"), auth("c@example.com")
    pa, pc = _pid(client, a), _pid(client, c)
    circle = client.post(f"/api/profiles/{pa}/circles", json={"programId": "sleep-7", "name": "Sleepers", "displayName": "Sam"}, headers=a).json()
    # Outsiders can't see, cheer in, or leave a circle they're not in.
    assert client.get(f"/api/profiles/{pc}/circles", headers=c).json() == []
    assert client.post(f"/api/profiles/{pc}/circles/{circle['id']}/cheer", json={"to": circle["members"][0]["id"]}, headers=c).status_code == 404
    assert client.delete(f"/api/profiles/{pc}/circles/{circle['id']}", headers=c).status_code == 404
    # Someone else's profile id is refused.
    assert client.get(f"/api/profiles/{pa}/circles", headers=c).status_code == 404
    assert client.post(f"/api/profiles/{pc}/circles/join", json={"code": "zzzzzzzz", "displayName": "X"}, headers=c).status_code == 404
    assert client.post(f"/api/profiles/{pc}/circles/join", json={"code": "BAD", "displayName": "X"}, headers=c).status_code == 422
    # Names are cleaned.
    j = client.post(f"/api/profiles/{pc}/circles/join", json={"code": circle["code"], "displayName": "<b>Al</b>"}, headers=c).json()
    assert any(m["name"] == "bAl/b" for m in j["members"])
    # Leaving; the last member leaving deletes the circle.
    assert client.delete(f"/api/profiles/{pc}/circles/{circle['id']}", headers=c).status_code == 204
    assert client.delete(f"/api/profiles/{pa}/circles/{circle['id']}", headers=a).status_code == 204
    assert client.get(f"/api/profiles/{pa}/circles", headers=a).json() == []


def test_account_deletion_removes_membership(client, auth):
    a, b = auth("a3@example.com"), auth("b3@example.com")
    pa, pb = _pid(client, a), _pid(client, b)
    circle = client.post(f"/api/profiles/{pa}/circles", json={"programId": "relax-7", "name": "Crew", "displayName": "Sam"}, headers=a).json()
    client.post(f"/api/profiles/{pb}/circles/join", json={"code": circle["code"], "displayName": "Ana"}, headers=b)
    assert client.delete("/api/me", headers=b).status_code == 204
    names = [m["name"] for m in client.get(f"/api/profiles/{pa}/circles", headers=a).json()[0]["members"]]
    assert names == ["Sam"]
