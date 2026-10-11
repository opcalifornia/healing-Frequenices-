from app.seed.build import band_for, build_titles
from app.seed.validate import validate


def test_seed_content_is_valid_and_large_enough():
    titles = build_titles()
    validate(titles)
    sessions = [t for t in titles if t["kind"] in ("session", "program")]
    shows = [t for t in titles if t["kind"] == "show"]
    assert len(sessions) >= 60
    assert len(shows) >= 20
    assert all(s["comingSoon"] for s in shows)
    assert sum(1 for t in titles if t["kind"] == "program") >= 6


def test_band_boundaries():
    assert band_for(0.5) == "delta"
    assert band_for(3.99) == "delta"
    assert band_for(4) == "theta"
    assert band_for(8) == "alpha"
    assert band_for(13) == "beta"
    assert band_for(30) == "gamma"


def test_no_banned_names_in_content():
    import json

    blob = json.dumps(build_titles()).lower()
    assert "hemi-sync" not in blob and "hemisync" not in blob


def test_no_medical_claims():
    import json

    blob = json.dumps(build_titles()).lower()
    for word in ("cure", "cures", "treats", "heals your", "diagnos"):
        assert word not in blob, word


def test_catalog_endpoint(client):
    r = client.get("/api/catalog")
    assert r.status_code == 200
    c = r.json()
    assert set(c["sections"]) == {"home", "frequencies", "shows"}
    home = {rail["id"]: rail for rail in c["sections"]["home"]["rails"]}
    assert len(home["top10"]["titleIds"]) == 10
    for goal in ("sleep", "meditate", "focus", "relax", "energize"):
        assert home[f"goal-{goal}"]["titleIds"], goal
    freq = {rail["id"]: rail for rail in c["sections"]["frequencies"]["rails"]}
    for band in ("delta", "theta", "alpha", "beta", "gamma"):
        ids = freq[f"band-{band}"]["titleIds"]
        assert ids and all(c["titles"][i]["band"] == band for i in ids)
    assert all(c["titles"][i]["kind"] == "program" for i in freq["deep-sync"]["titleIds"])
    assert len(c["articles"]) >= 3


def test_sections_rails_titles_episodes(client):
    assert {s["id"] for s in client.get("/api/sections").json()} == {"home", "frequencies", "shows"}
    sec = client.get("/api/sections/shows").json()
    assert sec["section"]["heroIds"] and sec["titles"]
    rail = client.get("/api/sections/frequencies/rails/band-theta").json()
    assert rail["titles"][0]["band"] == "theta"
    assert client.get("/api/sections/nope").status_code == 404

    assert client.get("/api/titles/deep-rest").json()["beat"] == 2.5
    assert client.get("/api/titles/missing").status_code == 404
    assert all(t["kind"] == "show" for t in client.get("/api/titles?kind=show").json())
    assert len(client.get("/api/sessions").json()) >= 60

    eps = client.get("/api/titles/sound-foundations/episodes").json()
    assert eps["comingSoon"] and len(eps["seasons"]) == 2
    assert len(client.get("/api/titles/sound-foundations/episodes?season=2").json()["seasons"]) == 1
    assert client.get("/api/titles/deep-rest/episodes").status_code == 404


def test_search(client):
    res = client.get("/api/search", params={"q": "delta"}).json()["results"]
    import json

    assert res and all("delta" in json.dumps(t).lower() for t in res)
    assert sum(1 for t in res if t.get("band") == "delta") >= 10
    assert client.get("/api/search", params={"q": "Deep Sync"}).json()["results"][0]["kind"] == "program"
    assert client.get("/api/search", params={"q": "40hz"}).json()["results"]
    assert client.get("/api/search", params={"q": "zzzz"}).json()["results"] == []


def test_articles(client):
    arts = client.get("/api/articles").json()
    assert {"how-binaural-beats-work", "the-brainwave-bands", "history-of-the-gateway-experience"} <= {a["slug"] for a in arts}
    a = client.get("/api/articles/what-the-research-says").json()
    assert "mixed" in a["dek"].lower()


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}
