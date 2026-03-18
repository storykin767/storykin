from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from story_generator import generate_story
from pydantic import BaseModel
import os
from pipeline import run_pipeline
import asyncio


load_dotenv()

app = FastAPI(title="Storykin API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

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