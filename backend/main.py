from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os

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