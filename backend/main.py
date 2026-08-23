import asyncio
import logging
import os
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Literal, Optional

# config must be imported first: it validates credentials before any
# module below builds a client with them
import config  # noqa: F401  (imported for its side effects)
import stripe
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator
from supabase import Client, create_client

from config import ENVIRONMENT, IS_PRODUCTION
from checkout import JobNotReady, create_checkout_session, send_confirmation_email
from fulfillment import fulfill_order
from pipeline import run_pipeline

log = logging.getLogger("storykin.api")

# Swagger would advertise the admin endpoints to anyone who looks
# ── Recovery from an interrupted restart ──────────────────────
# Generation and fulfilment run as background tasks, so a Railway restart
# loses whatever was in flight. Rather than leave a job spinning forever or
# a paid order unfulfilled, sweep both on startup.
STALE_AFTER_MINUTES = int(os.getenv("STALE_AFTER_MINUTES", "15"))
RECOVER_WINDOW_HOURS = int(os.getenv("RECOVER_WINDOW_HOURS", "24"))
IN_FLIGHT = ["pending", "generating_story", "generating_images"]


def _utc(delta: timedelta) -> str:
    return (datetime.now(timezone.utc) - delta).isoformat()


def fail_interrupted_jobs() -> int:
    """A job stuck mid-generation will never resume — tell the user."""
    stuck = supabase.table("jobs").select("id").in_("status", IN_FLIGHT)\
        .lt("updated_at", _utc(timedelta(minutes=STALE_AFTER_MINUTES)))\
        .execute()
    for job in stuck.data:
        supabase.table("jobs").update({
            "status": "failed",
            "error_message": "Generation was interrupted by a server restart.",
        }).eq("id", job["id"]).execute()
    return len(stuck.data)


async def restart_unfulfilled_orders() -> int:
    """A paid order still sitting at 'paid' never got its book built.

    Bounded to the recent past: anything older needs a human, and the
    /admin endpoints exist for that.
    """
    orders = supabase.table("orders").select("*").eq("status", "paid")\
        .lt("created_at", _utc(timedelta(minutes=STALE_AFTER_MINUTES)))\
        .gt("created_at", _utc(timedelta(hours=RECOVER_WINDOW_HOURS)))\
        .execute()
    for order in orders.data:
        spawn(fulfil_order_row(order))
    return len(orders.data)


async def fulfil_order_row(order: dict) -> None:
    """Run fulfilment for an existing order row (used by recovery and admin)."""
    job = supabase.table("jobs").select("child_data, story_data")\
        .eq("id", order["job_id"]).single().execute()
    shipping = order.get("shipping_address") or {}
    await fulfill_order(
        order_id=order["id"],
        job_id=order["job_id"],
        tier=order.get("order_type", "physical"),
        customer_email=order.get("customer_email"),
        child_name=(job.data.get("child_data") or {}).get("child_name", "your child"),
        story_title=(job.data.get("story_data") or {}).get("title", "your storybook"),
        customer_name=shipping.get("name", ""),
        shipping_address=shipping,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        stale = await asyncio.to_thread(fail_interrupted_jobs)
        if stale:
            log.warning("Marked %s interrupted job(s) as failed", stale)
        resumed = await restart_unfulfilled_orders()
        if resumed:
            log.warning("Restarted fulfilment for %s unfulfilled order(s)", resumed)
        if not stale and not resumed:
            log.info("Startup recovery: nothing to recover")
    except Exception as e:
        log.exception("Startup recovery failed (continuing anyway): %s", e)
    yield


app = FastAPI(
    title="Storykin API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)

DEFAULT_ORIGINS = (
    "http://localhost:3000,"
    "https://storykin-eta.vercel.app,"
    "https://storykinbooks.com,"
    "https://www.storykinbooks.com"
)
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


# ── Background tasks ──────────────────────────────────────────
# asyncio only holds weak references to tasks, so an unreferenced
# task can be garbage collected mid-generation.
_background_tasks: set = set()


def spawn(coro) -> asyncio.Task:
    task = asyncio.create_task(coro)
    _background_tasks.add(task)
    task.add_done_callback(_background_tasks.discard)
    return task


# ── Rate limiting ─────────────────────────────────────────────
# Every /generate call spends roughly $0.75 of OpenAI credit, so the
# endpoint cannot be left open. In-memory is enough for a single instance.
RATE_LIMIT_ENABLED = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
RATE_LIMIT_PER_HOUR = int(os.getenv("RATE_LIMIT_PER_HOUR", "5"))
RATE_LIMIT_PER_DAY = int(os.getenv("RATE_LIMIT_PER_DAY", "20"))
HOUR, DAY = 3600, 86400

_rate_buckets: dict = defaultdict(deque)


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def enforce_rate_limit(request: Request) -> None:
    if not RATE_LIMIT_ENABLED:
        return

    now = time.time()
    ip = client_ip(request)
    bucket = _rate_buckets[ip]
    while bucket and now - bucket[0] > DAY:
        bucket.popleft()

    in_last_hour = sum(1 for t in bucket if now - t < HOUR)
    if in_last_hour >= RATE_LIMIT_PER_HOUR:
        log.warning("Rate limit (hourly) hit by %s", ip)
        raise HTTPException(
            status_code=429,
            detail="You've created a lot of books just now. Please try again in an hour.",
            headers={"Retry-After": str(HOUR)},
        )
    if len(bucket) >= RATE_LIMIT_PER_DAY:
        log.warning("Rate limit (daily) hit by %s", ip)
        raise HTTPException(
            status_code=429,
            detail="Daily book limit reached. Please try again tomorrow.",
            headers={"Retry-After": str(DAY)},
        )

    bucket.append(now)

    # Keep the bucket map from growing without bound
    if len(_rate_buckets) > 5000:
        for stale_ip in [k for k, v in _rate_buckets.items() if not v]:
            del _rate_buckets[stale_ip]


# ── Request models ────────────────────────────────────────────
class GenerateRequest(BaseModel):
    child_name: str = Field(min_length=1, max_length=40)
    age: int = Field(ge=2, le=8)
    pronouns: Literal["she", "he", "they"] = "she"
    hair_color: str = Field(min_length=1, max_length=40)
    eye_color: str = Field(min_length=1, max_length=40)
    skin_tone: Literal[
        "light", "medium-light", "medium", "medium-dark", "dark"
    ] = "medium-light"
    theme: Literal[
        "dinosaur", "space", "mermaid", "forest", "superhero", "princess"
    ]
    moral: Literal[
        "none", "bravery", "kindness", "sharing", "trying", "friendship", "family"
    ] = "none"
    sidekick: Optional[str] = Field(default=None, max_length=60)

    @field_validator("child_name", "hair_color", "eye_color", "sidekick")
    @classmethod
    def strip_whitespace(cls, v):
        return v.strip() if isinstance(v, str) else v

    @field_validator("child_name")
    @classmethod
    def name_must_not_be_empty(cls, v):
        if not v:
            raise ValueError("Child's name is required")
        return v


class CheckoutRequest(BaseModel):
    job_id: str = Field(min_length=1, max_length=64)
    tier: Literal["physical", "digital"] = "physical"


# ── Endpoints ─────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "storykin-backend", "environment": ENVIRONMENT}


@app.post("/generate")
async def generate(request: GenerateRequest, http_request: Request):
    enforce_rate_limit(http_request)

    job = supabase.table("jobs").insert({
        "status": "pending",
        "progress": 0,
        "child_data": request.model_dump(),
    }).execute()

    job_id = job.data[0]["id"]
    log.info("[%s] Job created for %s (%s)", job_id, request.child_name, request.theme)

    spawn(run_pipeline(job_id, request.model_dump()))

    return {"job_id": job_id}


@app.get("/status/{job_id}")
def get_status(job_id: str):
    try:
        job = supabase.table("jobs")\
            .select("status, progress, current_page, error_message")\
            .eq("id", job_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Job not found")
    return job.data


@app.get("/book/{job_id}")
def get_book(job_id: str):
    try:
        job = supabase.table("jobs").select("*").eq("id", job_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Book not found")

    if job.data["status"] != "complete" or not job.data.get("story_data"):
        raise HTTPException(status_code=409, detail="Book is not finished yet")

    pages = supabase.table("story_pages")\
        .select("page_number, page_text, image_url")\
        .eq("job_id", job_id).order("page_number").execute()

    return {
        "job_id": job_id,
        "child_name": job.data["child_data"]["child_name"],
        "title": job.data["story_data"]["title"],
        "pages": pages.data,
    }


@app.post("/checkout")
def create_checkout(request: CheckoutRequest):
    try:
        url = create_checkout_session(request.job_id, request.tier)
    except JobNotReady as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        log.exception("Checkout failed for job %s: %s", request.job_id, e)
        raise HTTPException(status_code=500, detail="Could not start checkout")
    return {"checkout_url": url}


@app.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET")
        )
    except Exception as e:
        # 400 tells Stripe the delivery failed so it retries
        log.error("Invalid Stripe webhook signature: %s", e)
        return JSONResponse(status_code=400, content={"error": "Invalid signature"})

    if event["type"] != "checkout.session.completed":
        return {"received": True}

    session = event["data"]["object"]
    session_id = session["id"]

    # Stripe retries deliveries — never charge a customer for two books
    existing = supabase.table("orders").select("id")\
        .eq("stripe_session_id", session_id).execute()
    if existing.data:
        log.info("Duplicate webhook for session %s — ignoring", session_id)
        return {"received": True}

    metadata = session.get("metadata") or {}
    job_id = metadata.get("job_id")
    tier = metadata.get("tier", "physical")
    child_name = metadata.get("child_name", "your child")
    customer_email = (session.get("customer_details") or {}).get("email")
    shipping = session.get("shipping_details") or (
        (session.get("collected_information") or {}).get("shipping_details")
    )

    if not job_id:
        log.error("Webhook for session %s has no job_id in metadata", session_id)
        return {"received": True}

    order = supabase.table("orders").insert({
        "job_id": job_id,
        "stripe_session_id": session_id,
        "stripe_payment_intent": session.get("payment_intent"),
        "order_type": tier,
        "amount": session.get("amount_total"),
        "currency": session.get("currency", "usd"),
        "customer_email": customer_email,
        "status": "paid",
        "shipping_address": shipping,
    }).execute()
    order_id = order.data[0]["id"]
    log.info("[%s] Order created for %s — %s", order_id, child_name, tier)

    job = supabase.table("jobs").select("story_data")\
        .eq("id", job_id).single().execute()
    story_title = (job.data.get("story_data") or {}).get("title", "your storybook")

    if customer_email:
        try:
            send_confirmation_email(
                customer_email=customer_email,
                child_name=child_name,
                story_title=story_title,
                tier=tier,
                order_id=order_id,
            )
        except Exception as e:
            log.exception("[%s] Confirmation email failed: %s", order_id, e)

    # Building the PDF takes longer than Stripe will wait, so hand it off
    spawn(fulfill_order(
        order_id=order_id,
        job_id=job_id,
        tier=tier,
        customer_email=customer_email,
        child_name=child_name,
        story_title=story_title,
        customer_name=(shipping or {}).get("name", ""),
        shipping_address=shipping,
    ))

    return {"received": True}


# ── Admin: recover orders that failed to fulfil ───────────────
# A paid order whose PDF build or print submission failed is money at
# risk, so there has to be a way to retry it without a redeploy.
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")


def require_admin(request: Request) -> None:
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=503, detail="Admin API is not configured")
    if request.headers.get("x-admin-token") != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorised")


@app.get("/admin/orders")
def admin_orders(request: Request, status: str = "paid"):
    """List orders sitting in a given status — defaults to ones never fulfilled."""
    require_admin(request)
    result = supabase.table("orders").select("*").eq("status", status)\
        .order("created_at", desc=True).limit(50).execute()
    return {"status": status, "count": len(result.data), "orders": result.data}


@app.post("/admin/orders/{order_id}/fulfill")
async def admin_fulfill(order_id: str, request: Request):
    """Re-run fulfilment for one order (rebuilds the PDF, then prints or emails)."""
    require_admin(request)

    try:
        order = supabase.table("orders").select("*")\
            .eq("id", order_id).single().execute()
    except Exception:
        raise HTTPException(status_code=404, detail="Order not found")

    spawn(fulfil_order_row(order.data))

    log.info("[%s] Manual fulfilment retry requested", order_id)
    return {"order_id": order_id, "status": "fulfilment restarted"}


# ── Debug endpoints (non-production only) ─────────────────────
if not IS_PRODUCTION:

    @app.get("/test-db")
    def read_jobs():
        result = supabase.table("jobs").select("*")\
            .order("created_at", desc=True).limit(20).execute()
        return {"total_records": len(result.data), "records": result.data}

    @app.post("/test-db")
    def test_db():
        result = supabase.table("jobs").insert({
            "status": "test",
            "progress": 0,
            "child_data": {"name": "Ava", "theme": "dinosaur"},
        }).execute()
        return {"record_id": result.data[0]["id"]}
