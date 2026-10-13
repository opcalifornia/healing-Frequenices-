"""MongoDB access. Tests swap in mongomock via `set_database`."""

from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from .config import get_settings

_db: AsyncIOMotorDatabase | None = None


def get_database() -> AsyncIOMotorDatabase:
    global _db
    if _db is None:
        s = get_settings()
        if s.mongo_url.startswith("mongomock://"):
            # In-memory database for demos and local work without MongoDB
            # (requires requirements-dev.txt). Data is lost on restart.
            from mongomock_motor import AsyncMongoMockClient

            _db = AsyncMongoMockClient(tz_aware=True)[s.mongo_db]
        else:
            _db = AsyncIOMotorClient(s.mongo_url, tz_aware=True)[s.mongo_db]
    return _db


def set_database(db: AsyncIOMotorDatabase | None) -> None:
    global _db
    _db = db


async def ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    await db.users.create_index("email", unique=True)
    await db.profiles.create_index("user_id")
    await db.favorites.create_index([("profile_id", 1), ("title_id", 1)], unique=True)
    await db.progress.create_index([("profile_id", 1), ("title_id", 1)], unique=True)
    await db.progress.create_index([("profile_id", 1), ("updated_at", -1)])
    await db.custom_sessions.create_index("profile_id")
    await db.app_state.create_index([("profile_id", 1), ("key", 1)], unique=True)
    await db.calendar_feeds.create_index("token", unique=True)
    await db.circles.create_index("code", unique=True)
    await db.circles.create_index("members.profile_id")
    await db.users.create_index("ref_code", unique=True, sparse=True)
    await db.users.create_index("referred_by", sparse=True)
    await db.calendar_feeds.create_index("profile_id", unique=True)
    await db.titles.create_index("kind")
    await db.feedback.create_index([("created_at", -1)])
    await db.metrics_daily.create_index([("day", 1), ("event", 1), ("day_bucket", 1)], unique=True)
