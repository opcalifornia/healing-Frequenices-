import os

import pytest
from fastapi.testclient import TestClient
from mongomock_motor import AsyncMongoMockClient

os.environ.setdefault("JWT_SECRET", "test-secret")

from app.db import set_database  # noqa: E402
from app.main import create_app  # noqa: E402
from app.services.catalog import invalidate  # noqa: E402


@pytest.fixture()
def client():
    set_database(AsyncMongoMockClient()["hf_test"])
    invalidate()
    with TestClient(create_app()) as c:  # lifespan seeds the empty database
        yield c
    set_database(None)


@pytest.fixture()
def auth(client):
    def make(email="listener@example.com", password="correct horse"):
        r = client.post("/api/auth/register", json={"email": email, "password": password})
        assert r.status_code == 201, r.text
        token = r.json()["token"]
        return {"Authorization": f"Bearer {token}"}

    return make
