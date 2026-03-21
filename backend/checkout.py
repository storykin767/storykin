import stripe
import resend
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
resend.api_key = os.getenv("RESEND_API_KEY")

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def create_checkout_session(job_id: str, tier: str = "physical") -> str:
    """Create a Stripe checkout session. Returns checkout URL."""

    job = supabase.table("jobs").select("*").eq("id", job_id).single().execute()
    child_name = job.data["child_data"]["child_name"]
    story_title = job.data["story_data"]["title"]

    if tier == "digital":
        price_data = {
            "currency": "usd",
            "unit_amount": 999,  # $9.99
            "product_data": {
                "name": f"{child_name}'s Personalised Storybook — Digital PDF",
                "description": f"{story_title} — Instant download",
            }
        }
    else:
        price_data = {
            "currency": "usd",
            "unit_amount": 3999,  # $39.99
            "product_data": {
                "name": f"{child_name}'s Personalised Storybook — Printed Book",
                "description": f"{story_title} — Printed and shipped to your door",
            }
        }

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{"price_data": price_data, "quantity": 1}],
        mode="payment",
        success_url=f"{FRONTEND_URL}/order/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{FRONTEND_URL}/preview/{job_id}",
        metadata={
            "job_id": job_id,
            "tier": tier,
            "child_name": child_name,
        },
        shipping_address_collection={
            "allowed_countries": ["US", "GB", "CA", "AU", "DE", "FR", "NL", "SE"]
        } if tier == "physical" else None,
        customer_email=None,
        phone_number_collection={"enabled": False},
    )

    return session.url


def send_confirmation_email(
    customer_email: str,
    child_name: str,
    story_title: str,
    tier: str,
    order_id: str
) -> None:
    """Send order confirmation email via Resend."""

    if tier == "digital":
        delivery_text = "Your digital PDF will be emailed to you within 5 minutes."
        subject = f"{child_name}'s storybook is ready!"
    else:
        delivery_text = "Your book is being printed and will be shipped within 2-3 business days."
        subject = f"{child_name}'s storybook is on its way!"

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #F59E0B; text-align: center; font-size: 32px; margin-bottom: 8px;">
        Storykin
      </h1>
      <p style="text-align: center; color: #6B7280; margin-bottom: 40px;">
        Personalised storybooks for every child
      </p>

      <h2 style="color: #1F2937; font-size: 24px;">
        Order confirmed!
      </h2>
      <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
        Thank you for ordering <strong>{child_name}'s</strong> personalised storybook.
        We've received your order and can't wait for {child_name} to read it!
      </p>

      <div style="background: #FFFBEB; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="color: #92400E; margin: 0 0 8px;">{story_title}</h3>
        <p style="color: #78350F; margin: 0; font-size: 14px;">
          {delivery_text}
        </p>
      </div>

      <p style="color: #6B7280; font-size: 14px;">
        Order reference: <strong>{order_id}</strong>
      </p>

      <p style="color: #6B7280; font-size: 14px; margin-top: 40px;">
        Questions? Reply to this email and we'll get back to you within 24 hours.
      </p>

      <p style="color: #9CA3AF; font-size: 12px; margin-top: 40px; text-align: center;">
        Storykin — Every child deserves their own story
      </p>
    </div>
    """

    resend.Emails.send({
        "from": "Storykin <onboarding@resend.dev>",
        "to": customer_email,
        "subject": subject,
        "html": html,
    })