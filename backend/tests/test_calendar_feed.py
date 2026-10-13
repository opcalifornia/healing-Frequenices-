from app.routers.calendar_feed import build_ics


def _profile(client, headers):
    return client.get("/api/profiles", headers=headers).json()[0]["id"]


EVENTS = [
    {"id": "ev-1", "title": "Walk after lunch", "kind": "move", "date": "2026-10-12", "time": "12:45", "minutes": 10, "repeat": "weekdays", "to": "/move", "skip": {"2026-10-14": True}},
    {"id": "ev-2", "title": "Acupuncture, Dr. Lee", "kind": "appointment", "date": "2026-10-15", "time": "17:00", "minutes": 60, "repeat": "none"},
]


def test_feed_serves_synced_events_and_rotates(client, auth):
    h = auth()
    pid = _profile(client, h)
    body = {"data": {"events": EVENTS}, "updatedAt": "2026-10-11T10:00:00Z"}
    assert client.put(f"/api/profiles/{pid}/state/calendar", json=body, headers=h).status_code == 200

    url = client.post(f"/api/profiles/{pid}/calendar-feed", json={}, headers=h).json()["url"]
    path = url[url.index("/api/"):]
    # Asking again returns the same link.
    assert client.post(f"/api/profiles/{pid}/calendar-feed", json={}, headers=h).json()["url"] == url

    r = client.get(path)
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/calendar")
    text = r.text
    assert "SUMMARY:Walk after lunch" in text
    assert "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR" in text
    assert "EXDATE:20261014T124500" in text
    assert "SUMMARY:Acupuncture\\, Dr. Lee" in text
    assert "DTSTART:20261015T170000" in text and "DTEND:20261015T180000" in text

    # A new link turns the old one off.
    new = client.post(f"/api/profiles/{pid}/calendar-feed", json={"rotate": True}, headers=h).json()["url"]
    assert new != url
    assert client.get(path).status_code == 404
    assert client.get(new[new.index("/api/"):]).status_code == 200


def test_feed_requires_owner_and_valid_token(client, auth):
    a = auth("a@example.com")
    b = auth("b@example.com")
    pid = _profile(client, a)
    assert client.post(f"/api/profiles/{pid}/calendar-feed", json={}, headers=b).status_code == 404
    assert client.get("/api/calendar/not-a-real-token-at-all-xx.ics").status_code == 404
    assert client.get("/api/calendar/bad.ics").status_code == 404


def test_build_ics_skips_malformed_events():
    out = build_ics([{"title": "x", "date": "nope", "time": "9"}, "junk", EVENTS[1]], "https://rooted.app")
    assert out.count("BEGIN:VEVENT") == 1
    assert "Open in Rooted: https://rooted.app/" in out
    assert all(len(line) <= 75 for line in out.split("\r\n"))
