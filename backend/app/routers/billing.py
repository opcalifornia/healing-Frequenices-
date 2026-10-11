from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, Header, HTTPException, Request

from ..db import get_database
from ..security import current_user
from ..services import billing

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("/plans")
async def plans() -> dict[str, Any]:
    from ..config import get_settings

    return {"enabled": get_settings().stripe_enabled, "plans": billing.PLANS}


@router.post("/checkout")
async def checkout(user: dict[str, Any] = Depends(current_user)) -> dict[str, str]:
    try:
        return {"url": billing.create_checkout_session(user)}
    except billing.BillingNotConfigured as exc:
        raise HTTPException(501, "Subscriptions are not available yet") from exc


@router.post("/webhook")
async def webhook(request: Request, stripe_signature: str = Header("", alias="Stripe-Signature")) -> dict[str, bool]:
    try:
        event = billing.parse_webhook(await request.body(), stripe_signature)
    except billing.BillingNotConfigured as exc:
        raise HTTPException(501, "Subscriptions are not available yet") from exc
    except Exception as exc:  # signature or payload errors
        raise HTTPException(400, "Invalid webhook") from exc

    obj = event["data"]["object"]
    users = get_database().users
    if event["type"] == "checkout.session.completed":
        await users.update_one({"_id": obj["client_reference_id"]}, {"$set": {"plan": "premium", "stripe_customer_id": obj.get("customer")}})
    elif event["type"] == "customer.subscription.deleted":
        await users.update_one({"stripe_customer_id": obj.get("customer")}, {"$set": {"plan": "free"}})
    return {"received": True}
