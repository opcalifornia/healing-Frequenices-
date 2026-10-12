from __future__ import annotations

from functools import lru_cache
from typing import Annotated

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    """All configuration comes from environment variables (or a local .env)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    mongo_url: str = "mongodb://localhost:27017"
    mongo_db: str = "healing_frequencies"
    jwt_secret: str = "dev-only-change-me"
    jwt_expire_minutes: int = 60 * 24 * 30
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:5173", "http://localhost:4173"]
    seed_on_startup: bool = True
    max_profiles: int = 6
    #: Honour X-Forwarded-For when working out a client's IP (for rate limits).
    #: Turn on only behind a proxy that sets it (Render, Railway, Fly...);
    #: otherwise clients could spoof their address.
    trust_proxy: bool = False

    # Stripe (subscriptions) - optional until billing launches.
    stripe_secret_key: str | None = None
    stripe_webhook_secret: str | None = None
    stripe_price_id: str | None = None
    app_url: str = "http://localhost:5173"
    #: Public base URL of this API, used in calendar subscription links. Defaults to the request host.
    api_public_url: str | None = None

    # Cloudflare R2 (S3-compatible) - optional until hosted media launches.
    r2_account_id: str | None = None
    r2_access_key_id: str | None = None
    r2_secret_access_key: str | None = None
    r2_bucket: str | None = None
    r2_public_base_url: str | None = None

    #: Secret for reading anonymous usage counts at GET /api/metrics/summary
    #: (sent as X-Admin-Token). Unset means that endpoint does not exist.
    metrics_admin_token: str | None = None

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_origins(cls, v: object) -> object:
        if isinstance(v, str):
            return [o.strip() for o in v.split(",") if o.strip()]
        return v

    @model_validator(mode="after")
    def require_real_secret_in_production(self) -> "Settings":
        if self.is_production and (self.jwt_secret == "dev-only-change-me" or len(self.jwt_secret) < 32):
            raise ValueError("Set JWT_SECRET to a random string of at least 32 characters in production")
        return self

    @property
    def is_production(self) -> bool:
        return self.environment.strip().lower() == "production"

    @property
    def stripe_enabled(self) -> bool:
        return bool(self.stripe_secret_key and self.stripe_price_id)

    @property
    def r2_enabled(self) -> bool:
        return bool(self.r2_account_id and self.r2_access_key_id and self.r2_secret_access_key and self.r2_bucket)


@lru_cache
def get_settings() -> Settings:
    return Settings()
