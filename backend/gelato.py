import httpx
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

GELATO_API_KEY = os.getenv("GELATO_API_KEY")
GELATO_BASE_URL = "https://order.gelatoapis.com"

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)


def get_pdf_url(job_id: str) -> str:
    """Get the PDF URL for a completed job."""
    pages = supabase.storage.from_("storykin-images") \
        .list(job_id)

    # Find the PDF file
    pdf_files = [f for f in pages if f["name"].endswith(".pdf")]
    if not pdf_files:
        raise Exception(f"No PDF found for job {job_id}")

    # Get the most recent PDF (timestamp in filename)
    pdf_files.sort(key=lambda x: x["name"], reverse=True)
    pdf_filename = pdf_files[0]["name"]

    pdf_url = supabase.storage.from_("storykin-images") \
        .get_public_url(f"{job_id}/{pdf_filename}")

    return pdf_url


def submit_gelato_order(
        order_id: str,
        job_id: str,
        customer_name: str,
        shipping_address: dict,
        customer_email: str
) -> str:
    """Submit a print order to Gelato. Returns Gelato order ID."""

    pdf_url = get_pdf_url(job_id)
    print(f"  Submitting to Gelato: {pdf_url}")

    # Parse shipping address from Stripe format
    address = shipping_address.get("address", {})
    name = shipping_address.get("name", customer_name)

    payload = {
        "orderReferenceId": order_id,
        "customerReferenceId": order_id,
        "currency": "USD",
        "items": [
            {
                "itemReferenceId": f"{order_id}-book",
                "productUid": "softcover_book_perfect_binding_a5_portrait",
                "files": [
                    {
                        "type": "default",
                        "url": pdf_url
                    }
                ],
                "quantity": 1
            }
        ],
        "shippingAddress": {
            "firstName": name.split()[0] if name else "Customer",
            "lastName": " ".join(name.split()[1:]) if len(name.split()) > 1 else ".",
            "addressLine1": address.get("line1", ""),
            "addressLine2": address.get("line2", ""),
            "city": address.get("city", ""),
            "postCode": address.get("postal_code", ""),
            "country": address.get("country", "US"),
            "state": address.get("state", ""),
            "email": customer_email,
        },
        "returnAddress": {
            "companyName": "Storykin",
            "email": "hello@storykinbooks.com",
        }
    }

    headers = {
        "X-API-KEY": GELATO_API_KEY,
        "Content-Type": "application/json"
    }

    with httpx.Client(timeout=30.0) as client:
        response = client.post(
            f"{GELATO_BASE_URL}/v3/orders",
            json=payload,
            headers=headers
        )

    if response.status_code not in (200, 201):
        raise Exception(
            f"Gelato order failed: {response.status_code} — {response.text}"
        )

    data = response.json()
    gelato_order_id = data.get("id", "unknown")
    print(f"  Gelato order submitted: {gelato_order_id}")
    return gelato_order_id