def _register(client, email, ref=None):
    body = {"email": email, "password": "a-good-long-phrase-9"}
    if ref:
        body["ref"] = ref
    r = client.post("/api/auth/register", json=body)
    assert r.status_code == 201, r.text
    return r.json()


def _h(token):
    return {"Authorization": f"Bearer {token}"}


def test_invite_code_counts_signups_without_revealing_who(client):
    sam = _register(client, "sam@example.com")
    code = sam["user"]["refCode"]
    assert code and len(code) == 8

    _register(client, "friend1@example.com", ref=code)
    _register(client, "friend2@example.com", ref=code)
    _register(client, "stranger@example.com", ref="nosuchcode")  # unknown codes are ignored

    r = client.get("/api/me/referrals", headers=_h(sam["token"]))
    assert r.status_code == 200
    assert r.json() == {"code": code, "joined": 2}
    # Each new account gets its own code.
    me = client.get("/api/me", headers=_h(sam["token"])).json()["user"]
    assert me["refCode"] == code


def test_bad_ref_rejected_and_deletion_unlinks(client):
    bad = client.post("/api/auth/register", json={"email": "x@example.com", "password": "a-good-long-phrase-9", "ref": "<script>"})
    assert bad.status_code == 422
    sam = _register(client, "sam2@example.com")
    friend = _register(client, "f@example.com", ref=sam["user"]["refCode"])
    assert client.delete("/api/me", headers=_h(sam["token"])).status_code == 204
    # The friend's account is untouched.
    assert client.get("/api/me", headers=_h(friend["token"])).status_code == 200
