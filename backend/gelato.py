import logging
import os

import httpx
from dotenv import load_dotenv

load_dotenv()

log = logging.getLogger("storykin.gelato")

GELATO_API_KEY = os.getenv("GELATO_API_KEY")
GELATO_ORDER_URL = "https://order.gelatoapis.com/v4/orders"

# 8x8" softcover photobook, matt lamination, coated silk.
# Verified against the live catalog — the previous UID did not exist.
GELATO_PRODUCT_UID = os.getenv(
    "GELATO_PRODUCT_UID",
    "photobooks-softcover_pf_200x200-mm-8x8-inch_pt_170-gsm-65lb-coated-silk"
    "_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0"
    "_cpt_250-gsm-100-lb-cover-coated-silk_ver"
)
# Gelato accepts even page counts from 28 to 200 for this product.
# Taken from pdf_builder so the count we declare can never drift from the
# count the interior file actually has — Gelato rejects a mismatch.
from pdf_builder import INTERIOR_PAGES

PAGE_COUNT = int(os.getenv("GELATO_PAGE_COUNT", str(INTERIOR_PAGES)))

RETURN_EMAIL = os.getenv("SUPPORT_EMAIL", "hello@storykinbooks.com")
SHIPMENT_METHOD = os.getenv("GELATO_SHIPMENT_METHOD", "normal")


def build_order_payload(
    order_id: str,
    cover_url: str,
    interior_url: str,
    customer_name: str,
    shipping_address: dict,
    customer_email: str,
    order_type: str = "order",
) -> dict:
    """Build the Gelato v4 order body. Split out so it can be validated as a draft."""

    # Stripe nests the postal fields under "address"
    address = shipping_address.get("address") or {}
    name = (shipping_address.get("name") or customer_name or "").strip()
    name_parts = name.split()

    required = {"line1": address.get("line1"), "city": address.get("city"),
                "country": address.get("country")}
    missing = [field for field, value in required.items() if not value]
    if missing:
        raise ValueError(f"Shipping address missing: {', '.join(missing)}")

    return {
        "orderType": order_type,
        "orderReferenceId": order_id,
        "customerReferenceId": order_id,
        "currency": "USD",
        "items": [
            {
                "itemReferenceId": f"{order_id}-book",
                "productUid": GELATO_PRODUCT_UID,
                "pageCount": PAGE_COUNT,
                "files": [
                    # The cover is printed separately from the inner block
                    {"type": "cover", "url": cover_url},
                    {"type": "default", "url": interior_url},
                ],
                "quantity": 1,
            }
        ],
        "shipmentMethodUid": SHIPMENT_METHOD,
        "shippingAddress": {
            "firstName": name_parts[0] if name_parts else "Customer",
            "lastName": " ".join(name_parts[1:]) if len(name_parts) > 1 else ".",
            "addressLine1": address.get("line1", ""),
            "addressLine2": address.get("line2") or "",
            "city": address.get("city", ""),
            "postCode": address.get("postal_code", ""),
            "country": address.get("country", "US"),
            "state": address.get("state") or "",
            "email": customer_email,
        },
        "returnAddress": {
            "companyName": "Storykin",
            "email": RETURN_EMAIL,
        },
    }


def submit_gelato_order(
    order_id: str,
    cover_url: str,
    interior_url: str,
    customer_name: str,
    shipping_address: dict,
    customer_email: str,
    order_type: str = "order",
) -> str:
    """Submit a print order to Gelato. Returns the Gelato order ID.

    order_type="draft" validates and stores the order without printing it,
    which is how the format is tested without spending money.
    """
    if not GELATO_API_KEY:
        raise RuntimeError("GELATO_API_KEY is not set — cannot submit print order")

    payload = build_order_payload(
        order_id=order_id,
        cover_url=cover_url,
        interior_url=interior_url,
        customer_name=customer_name,
        shipping_address=shipping_address,
        customer_email=customer_email,
        order_type=order_type,
    )

    log.info("Submitting %s %s to Gelato (%s pages)", order_type, order_id, PAGE_COUNT)
    with httpx.Client(timeout=60.0) as client:
        response = client.post(
            GELATO_ORDER_URL,
            json=payload,
            headers={"X-API-KEY": GELATO_API_KEY, "Content-Type": "application/json"},
        )

    if response.status_code not in (200, 201):
        raise RuntimeError(
            f"Gelato order failed: {response.status_code} — {response.text}"
        )

    gelato_order_id = response.json().get("id", "unknown")
    log.info("Gelato %s submitted: %s", order_type, gelato_order_id)
    return gelato_order_id
