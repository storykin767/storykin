import logging
import os

import resend
import stripe
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

log = logging.getLogger("storykin.checkout")

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
resend.api_key = os.getenv("RESEND_API_KEY")

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
FROM_EMAIL = os.getenv("FROM_EMAIL", "Storykin <hello@storykinbooks.com>")
SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL", "hello@storykinbooks.com")

PRICES = {
    "physical": 3999,   # $39.99
    "digital": 999,     # $9.99
}
SHIPPING_COUNTRIES = ["US", "GB", "CA", "AU", "DE", "FR", "NL", "SE"]

BRAND = "#7C3AED"
BRAND_DARK = "#6D28D9"
BRAND_TINT = "#F5F3FF"


class JobNotReady(Exception):
    """The book is not finished generating, so it cannot be sold yet."""


def create_checkout_session(job_id: str, tier: str = "physical") -> str:
    """Create a Stripe checkout session. Returns the checkout URL."""

    if tier not in PRICES:
        raise ValueError(f"Unknown tier: {tier}")

    job = supabase.table("jobs").select("*").eq("id", job_id).single().execute()
    if job.data["status"] != "complete" or not job.data.get("story_data"):
        raise JobNotReady(f"Job {job_id} is not finished (status: {job.data['status']})")

    child_name = job.data["child_data"]["child_name"]
    story_title = job.data["story_data"]["title"]

    if tier == "digital":
        product_name = f"{child_name}'s Personalised Storybook — Digital PDF"
        description = f"{story_title} — Instant download"
    else:
        product_name = f"{child_name}'s Personalised Storybook — Printed Book"
        description = f"{story_title} — Printed and shipped to your door"

    params = {
        "payment_method_types": ["card"],
        "line_items": [{
            "price_data": {
                "currency": "usd",
                "unit_amount": PRICES[tier],
                "product_data": {"name": product_name, "description": description},
            },
            "quantity": 1,
        }],
        "mode": "payment",
        "success_url": f"{FRONTEND_URL}/order/success?session_id={{CHECKOUT_SESSION_ID}}",
        "cancel_url": f"{FRONTEND_URL}/preview/{job_id}",
        "client_reference_id": job_id,
        "metadata": {"job_id": job_id, "tier": tier, "child_name": child_name},
    }

    # Only physical books ship — asking a PDF buyer for an address loses sales
    if tier == "physical":
        params["shipping_address_collection"] = {
            "allowed_countries": SHIPPING_COUNTRIES
        }

    session = stripe.checkout.Session.create(**params)
    log.info("Checkout session %s created for job %s (%s)", session.id, job_id, tier)
    return session.url


def _email_shell(body: str) -> str:
    return f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: {BRAND}; text-align: center; font-size: 32px; margin-bottom: 8px;">
        Storykin
      </h1>
      <p style="text-align: center; color: #6B7280; margin-bottom: 40px;">
        Personalised storybooks for every child
      </p>
      {body}
      <p style="color: #6B7280; font-size: 14px; margin-top: 40px;">
        Questions? Reply to this email and we'll get back to you within 24 hours.
      </p>
      <p style="color: #9CA3AF; font-size: 12px; margin-top: 40px; text-align: center;">
        Storykin — Every child deserves their own story
      </p>
    </div>
    """


def send_confirmation_email(
    customer_email: str,
    child_name: str,
    story_title: str,
    tier: str,
    order_id: str,
) -> None:
    """Send the order confirmation email via Resend."""

    if tier == "digital":
        delivery_text = "Your digital PDF will be emailed to you within a few minutes."
        subject = f"{child_name}'s storybook is ready!"
    else:
        delivery_text = ("Your book is going to print now. It is dispatched "
                         "within 2-4 business days and we will email you when "
                         "it is on its way.")
        subject = f"{child_name}'s storybook is on its way!"

    body = f"""
      <h2 style="color: #1F2937; font-size: 24px;">Order confirmed!</h2>
      <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
        Thank you for ordering <strong>{child_name}'s</strong> personalised storybook.
        We've received your order and can't wait for {child_name} to read it!
      </p>
      <div style="background: {BRAND_TINT}; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="color: {BRAND_DARK}; margin: 0 0 8px;">{story_title}</h3>
        <p style="color: #4C1D95; margin: 0; font-size: 14px;">{delivery_text}</p>
      </div>
      <p style="color: #6B7280; font-size: 14px;">
        Order reference: <strong>{order_id}</strong>
      </p>
    """

    resend.Emails.send({
        "from": FROM_EMAIL,
        "to": customer_email,
        "subject": subject,
        "html": _email_shell(body),
    })
    log.info("Confirmation email sent to %s", customer_email)


def send_digital_delivery_email(
    customer_email: str,
    child_name: str,
    story_title: str,
    pdf_url: str,
) -> None:
    """Send the digital buyer their finished book."""

    body = f"""
      <h2 style="color: #1F2937; font-size: 24px;">{child_name}'s book is here!</h2>
      <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
        <strong>{story_title}</strong> is finished and ready to read.
        Download it below — the link is yours to keep.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="{pdf_url}"
           style="display: inline-block; background: {BRAND}; color: #ffffff;
                  text-decoration: none; font-weight: bold; font-size: 16px;
                  padding: 16px 32px; border-radius: 12px;">
          Download the book (PDF)
        </a>
      </div>
      <p style="color: #6B7280; font-size: 13px; line-height: 1.6;">
        The PDF is print-ready, so you can also take it to any local print shop.
        If the button doesn't work, copy this link into your browser:<br>
        <span style="color: {BRAND_DARK}; word-break: break-all;">{pdf_url}</span>
      </p>
    """

    resend.Emails.send({
        "from": FROM_EMAIL,
        "to": customer_email,
        "subject": f"{child_name}'s storybook — your download is ready",
        "html": _email_shell(body),
    })
    log.info("Digital delivery email sent to %s", customer_email)
