from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from story_generator import generate_story
from pydantic import BaseModel
import os
from pipeline import run_pipeline
import asyncio
import stripe
from checkout import create_checkout_session, send_confirmation_email


load_dotenv()

app = FastAPI(title="Storykin API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://storykin-eta.vercel.app",
        "https://storykin.com",
        "https://www.storykin.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class StoryRequest(BaseModel):
    child_name: str
    age: int
    theme: str
    hair_color: str
    eye_color: str
    gender: str

class GenerateRequest(BaseModel):
    child_name: str
    age: int
    pronouns: str = "she"
    hair_color: str
    eye_color: str
    skin_tone: str = "medium-light"
    theme: str
    moral: str = "none"
    sidekick: str = None

class CheckoutRequest(BaseModel):
    job_id: str
    tier: str = "physical"


@app.get("/health")
def health():
    return {"status": "ok", "service": "storykin-backend"}

@app.post("/test-db")
def test_db():
    # Write a test job record to Supabase
    result = supabase.table("jobs").insert({
        "status": "test",
        "progress": 0,
        "child_data": {"name": "Ava", "theme": "dinosaur"}
    }).execute()

    return {
        "message": "Database connected successfully",
        "record_id": result.data[0]["id"],
        "status": result.data[0]["status"]
    }

@app.get("/test-db")
def read_jobs():
    # Read all jobs from Supabase
    result = supabase.table("jobs").select("*").execute()
    return {
        "message": "Read successful",
        "total_records": len(result.data),
        "records": result.data
    }

@app.post("/generate-story")
def generate_story_endpoint(request: StoryRequest):
    # Save job to Supabase
    job = supabase.table("jobs").insert({
        "status": "generating_story",
        "progress": 10,
        "child_data": request.model_dump()
    }).execute()

    job_id = job.data[0]["id"]

    # Generate the story
    story = generate_story(
        child_name=request.child_name,
        age=request.age,
        theme=request.theme,
        hair_color=request.hair_color,
        eye_color=request.eye_color,
        gender=request.gender
    )

    # Save story to Supabase
    supabase.table("jobs").update({
        "status": "story_complete",
        "progress": 30,
        "story_data": story.model_dump()
    }).eq("id", job_id).execute()

    return {
        "job_id": job_id,
        "title": story.title,
        "pages": len(story.pages),
        "preview": story.pages[0].page_text
    }


@app.post("/generate")
async def generate(request: GenerateRequest):
    # Create job record
    job = supabase.table("jobs").insert({
        "status": "pending",
        "progress": 0,
        "child_data": request.model_dump()
    }).execute()

    job_id = job.data[0]["id"]

    # Run pipeline in background
    asyncio.create_task(
        run_pipeline(job_id, request.model_dump())
    )

    return {"job_id": job_id}

@app.get("/status/{job_id}")
def get_status(job_id: str):
    job = supabase.table("jobs")\
        .select("status, progress, current_page, error_message")\
        .eq("id", job_id).single().execute()
    return job.data


@app.get("/book/{job_id}")
def get_book(job_id: str):
    job = supabase.table("jobs") \
        .select("*").eq("id", job_id).single().execute()

    pages = supabase.table("story_pages") \
        .select("*").eq("job_id", job_id) \
        .order("page_number").execute()

    return {
        "job_id": job_id,
        "child_name": job.data["child_data"]["child_name"],
        "title": job.data["story_data"]["title"],
        "pages": pages.data
    }


@app.post("/checkout")
def create_checkout(request: CheckoutRequest):
    url = create_checkout_session(request.job_id, request.tier)
    return {"checkout_url": url}

@app.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except Exception:
        return {"error": "Invalid signature"}

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        job_id = session["metadata"]["job_id"]
        tier = session["metadata"]["tier"]
        child_name = session["metadata"]["child_name"]
        customer_email = session.get("customer_details", {}).get("email")
        amount = session["amount_total"]

        # Save order to DB
        order = supabase.table("orders").insert({
            "job_id": job_id,
            "stripe_session_id": session["id"],
            "order_type": tier,
            "amount": amount,
            "customer_email": customer_email,
            "status": "paid",
            "shipping_address": session.get("shipping_details")
        }).execute()

        order_id = order.data[0]["id"]

        # Get story title
        job = supabase.table("jobs").select("story_data")\
            .eq("id", job_id).single().execute()
        story_title = job.data["story_data"]["title"]

        # Send confirmation email
        if customer_email:
            try:
                send_confirmation_email(
                    customer_email=customer_email,
                    child_name=child_name,
                    story_title=story_title,
                    tier=tier,
                    order_id=order_id
                )
            except Exception as e:
                print(f"Email failed: {e}")

        print(f"Order {order_id} created for {child_name} — {tier}")

    return {"received": True}