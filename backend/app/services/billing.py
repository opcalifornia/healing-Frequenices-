"""Subscription billing seam (Stripe).

Nothing here runs until STRIPE_SECRET_KEY and STRIPE_PRICE_ID are set. To
launch subscriptions:
  1. `pip install stripe` and add it to requirements.txt
  2. set STRIPE_SECRET_KEY, STRIPE_PRICE_ID, STRIPE_WEBHOOK_SECRET
  3. point a Stripe webhook at POST /api/billing/webhook
  4. gate premium titles in `entitlements.can_play`
"""

from __future__ import annotations

from typing import Any

from ..config import get_settings

PLANS = [
    {"id": "free", "name": "Free", "price": 0, "features": ["Full frequency catalog", "Build Your Own", "Up to 6 profiles"]},
    {"id": "premium", "name": "Premium", "price": 7.99, "interval": "month",
     "features": ["Everything in Free", "Shows and guided series", "Hosted audio and video", "Offline downloads"]},
]


class BillingNotConfigured(RuntimeError):
    pass


def _stripe() -> Any:
    s = get_settings()
    if not s.stripe_enabled:
        raise BillingNotConfigured("Stripe is not configured")
    import stripe  # type: ignore[import-not-found]  # installed when billing launches

    stripe.api_key = s.stripe_secret_key
    return stripe


def create_checkout_session(user: dict[str, Any]) -> str:
    stripe = _stripe()
    s = get_settings()
    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": s.stripe_price_id, "quantity": 1}],
        customer=user.get("stripe_customer_id") or None,
        customer_email=None if user.get("stripe_customer_id") else user["email"],
        client_reference_id=user["_id"],
        success_url=f"{s.app_url}/my-stuff?billing=success",
        cancel_url=f"{s.app_url}/my-stuff?billing=cancelled",
    )
    return session.url


def parse_webhook(payload: bytes, signature: str) -> dict[str, Any]:
    stripe = _stripe()
    return stripe.Webhook.construct_event(payload, signature, get_settings().stripe_webhook_secret)
