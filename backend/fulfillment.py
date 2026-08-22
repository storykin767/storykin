"""Post-payment fulfilment: build the print-ready PDF, then print or deliver it.

Runs as a background task after the Stripe webhook has already responded —
building a PDF takes far longer than Stripe is willing to wait for a 200.
"""
import asyncio
import logging
import os

from dotenv import load_dotenv
from supabase import Client, create_client

from checkout import send_digital_delivery_email
from gelato import submit_gelato_order
from pdf_builder import build_and_upload_digital, build_print_files

load_dotenv()

log = logging.getLogger("storykin.fulfillment")

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)


def _set_order_status(order_id: str, status: str, **fields) -> None:
    try:
        supabase.table("orders").update({"status": status, **fields})\
            .eq("id", order_id).execute()
    except Exception as e:
        log.error("Could not update order %s to %s: %s", order_id, status, e)


def _record_pdf_urls(job_id: str, urls: dict) -> None:
    """Store the generated PDF URLs alongside the illustration URLs."""
    try:
        job = supabase.table("jobs").select("image_urls")\
            .eq("id", job_id).single().execute()
        image_urls = job.data.get("image_urls") or {}
        image_urls.update(urls)
        supabase.table("jobs").update({"image_urls": image_urls})\
            .eq("id", job_id).execute()
    except Exception as e:
        log.error("Could not record PDF URLs for job %s: %s", job_id, e)


async def fulfill_order(
    order_id: str,
    job_id: str,
    tier: str,
    customer_email: str,
    child_name: str,
    story_title: str,
    customer_name: str = "",
    shipping_address: dict = None,
) -> None:
    """Build the book PDF and either send it to print or email it to the buyer.

    Never raises — a failure here means a paid order needs manual attention,
    so it is recorded on the order row for the ops runbook to pick up.
    """
    log.info("[%s] Fulfilling %s order for %s", order_id, tier, child_name)

    if tier == "physical":
        if not shipping_address:
            log.error("[%s] Physical order has no shipping address", order_id)
            _set_order_status(order_id, "fulfillment_failed")
            return

        # Gelato prints the cover and the inner block as two separate files
        try:
            files = await asyncio.to_thread(build_print_files, job_id)
        except Exception as e:
            log.exception("[%s] Print file build failed: %s", order_id, e)
            _set_order_status(order_id, "fulfillment_failed")
            return

        _record_pdf_urls(job_id, {
            "cover": files["cover"],
            "interior": files["interior"],
        })

        try:
            gelato_order_id = await asyncio.to_thread(
                submit_gelato_order,
                order_id=order_id,
                cover_url=files["cover"],
                interior_url=files["interior"],
                customer_name=customer_name,
                shipping_address=shipping_address,
                customer_email=customer_email,
            )
            _set_order_status(order_id, "printing", gelato_order_id=gelato_order_id)
            log.info("[%s] Sent to Gelato: %s", order_id, gelato_order_id)
        except Exception as e:
            log.exception("[%s] Gelato order failed: %s", order_id, e)
            _set_order_status(order_id, "fulfillment_failed")
        return

    # Digital tier — one self-contained PDF with the cover on the front
    try:
        if not customer_email:
            raise ValueError("digital order has no customer email")
        pdf_url = await asyncio.to_thread(build_and_upload_digital, job_id)
        _record_pdf_urls(job_id, {"pdf": pdf_url})
        await asyncio.to_thread(
            send_digital_delivery_email,
            customer_email=customer_email,
            child_name=child_name,
            story_title=story_title,
            pdf_url=pdf_url,
        )
        _set_order_status(order_id, "delivered")
        log.info("[%s] Digital PDF emailed to %s", order_id, customer_email)
    except Exception as e:
        log.exception("[%s] Digital delivery failed: %s", order_id, e)
        _set_order_status(order_id, "fulfillment_failed")
