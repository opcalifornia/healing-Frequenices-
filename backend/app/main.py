from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .config import get_settings
from .db import ensure_indexes, get_database
from .middleware import BodySizeLimitMiddleware, SecurityHeadersMiddleware
from .ratelimit import SlidingWindowLimiter
from .routers import auth, billing, calendar_feed, circles, catalog, feedback, gaia, media, metrics, profiles, state


#: Largest request body the API accepts. The biggest legitimate payload is a
#: synced state document (capped at 256 KiB of JSON in routers/state.py).
MAX_BODY_BYTES = 1024 * 1024


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
    # In-memory rate limiters (per process; see app/ratelimit.py for multi-instance notes).
    app.state.trust_proxy = settings.trust_proxy
    app.state.auth_ip_limiter = SlidingWindowLimiter(limit=30, window=15 * 60)
    app.state.auth_email_limiter = SlidingWindowLimiter(limit=10, window=15 * 60)
    app.state.feed_token_limiter = SlidingWindowLimiter(limit=60, window=60)
    app.state.feed_ip_miss_limiter = SlidingWindowLimiter(limit=60, window=60)
    app.state.metrics_ip_limiter = SlidingWindowLimiter(limit=60, window=60)
    app.state.feedback_ip_limiter = SlidingWindowLimiter(limit=8, window=600)
    app.state.gaia_hour_limiter = SlidingWindowLimiter(limit=settings.gaia_hourly_limit, window=3600)
    app.state.gaia_day_limiter = SlidingWindowLimiter(limit=settings.gaia_daily_limit, window=24 * 3600)

    # Middleware added last runs first: security headers wrap everything, including CORS and 413 responses.
    app.add_middleware(BodySizeLimitMiddleware, max_bytes=MAX_BODY_BYTES)
    app.add_middleware(GZipMiddleware, minimum_size=1024)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=r"https://.*\.vercel\.app" if not settings.is_production else None,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["Authorization", "Content-Type"],
    )
    app.add_middleware(SecurityHeadersMiddleware, hsts=settings.is_production)

    @app.exception_handler(RequestValidationError)
    async def validation_error(_: Request, exc: RequestValidationError) -> JSONResponse:
        # Same shape as FastAPI's default 422, minus the echoed "input"/"ctx":
        # they would repeat passwords and health data back (and into logs), and
        # encoding a hostile, deeply nested input can itself crash the handler.
        detail = [{"type": e.get("type"), "loc": list(e.get("loc", ())), "msg": e.get("msg")} for e in exc.errors()]
        return JSONResponse(status_code=422, content={"detail": detail})

    @app.get("/api/health", tags=["meta"])
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    for r in (catalog.router, auth.router, profiles.router, state.router, calendar_feed.router, circles.router, billing.router, media.router, metrics.router, feedback.router, gaia.router):
        app.include_router(r, prefix="/api")
    return app


app = create_app()
