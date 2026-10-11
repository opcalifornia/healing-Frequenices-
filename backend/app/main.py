from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .config import get_settings
from .db import ensure_indexes, get_database
from .routers import auth, billing, calendar_feed, catalog, media, profiles, state


async def seed_if_empty() -> None:
    from .seed.articles import ARTICLES
    from .seed.build import SECTIONS, build_titles
    from .seed.validate import validate
    from .services.catalog import seed_catalog

    db = get_database()
    if await db.titles.estimated_document_count() == 0:
        titles = build_titles()
        validate(titles)
        await seed_catalog(db, titles, SECTIONS, ARTICLES)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    db = get_database()
    await ensure_indexes(db)
    if get_settings().seed_on_startup:
        await seed_if_empty()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Healing Frequencies API", version="1.0.0", lifespan=lifespan)
    app.add_middleware(GZipMiddleware, minimum_size=1024)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=r"https://.*\.vercel\.app" if settings.environment != "production" else None,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["Authorization", "Content-Type"],
    )

    @app.get("/api/health", tags=["meta"])
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    for r in (catalog.router, auth.router, profiles.router, state.router, calendar_feed.router, billing.router, media.router):
        app.include_router(r, prefix="/api")
    return app


app = create_app()
