import asyncio
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from story_generator import generate_story
from image_generator import generate_all_images
import ssl
import certifi

ssl._create_default_https_context = ssl.create_default_context(cafile=certifi.where())

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

async def run_pipeline(job_id: str, child_data: dict) -> dict:
    try:
        # ── Step 1: Update job status ──────────────────────────
        supabase.table("jobs").update({
            "status": "generating_story",
            "progress": 10
        }).eq("id", job_id).execute()

        print(f"\n[{job_id}] Step 1: Generating story...")
        story = generate_story(
            child_name=child_data["child_name"],
            age=child_data["age"],
            pronouns=child_data.get("pronouns", "she"),
            theme=child_data["theme"],
            hair_color=child_data["hair_color"],
            eye_color=child_data["eye_color"],
            skin_tone=child_data.get("skin_tone", "medium-light"),
            moral=child_data.get("moral", "none"),
            sidekick=child_data.get("sidekick", None)
        )
        print(f"[{job_id}] Story done: {story.title}")

        # ── Step 2: Save story to DB ───────────────────────────
        supabase.table("jobs").update({
            "status": "generating_images",
            "progress": 30,
            "story_data": story.model_dump()
        }).eq("id", job_id).execute()

        # ── Step 3: Generate all illustrations ─────────────────
        print(f"[{job_id}] Step 2: Painting illustrations...")
        pages_for_images = [p.model_dump() for p in story.pages]
        image_results = await generate_all_images(pages_for_images, job_id)
        print(f"[{job_id}] All illustrations done.")

        # ── Step 4: Save image URLs to story_pages table ───────
        for result in image_results:
            page_data = next(p for p in story.pages if p.page_number == result["page_number"])
            supabase.table("story_pages").insert({
                "job_id": job_id,
                "page_number": result["page_number"],
                "page_text": page_data.page_text,
                "dalle_prompt": page_data.dalle_prompt,
                "image_url": result["image_url"]
            }).execute()

        # ── Step 5: Mark job complete ──────────────────────────
        image_urls = {str(r["page_number"]): r["image_url"] for r in image_results}
        supabase.table("jobs").update({
            "status": "complete",
            "progress": 100,
            "image_urls": image_urls
        }).eq("id", job_id).execute()

        print(f"[{job_id}] Pipeline complete!")
        return {
            "success": True,
            "job_id": job_id,
            "title": story.title,
            "pages": len(story.pages),
            "images": len(image_results)
        }

    except Exception as e:
        # If anything fails, mark job as failed in DB
        supabase.table("jobs").update({
            "status": "failed",
            "error_message": str(e)
        }).eq("id", job_id).execute()
        print(f"[{job_id}] Pipeline failed: {e}")
        raise


if __name__ == "__main__":
    # Create a test job in Supabase first
    child_data = {
        "child_name": "Ava",
        "age": 4,
        "theme": "dinosaur adventure",
        "hair_color": "curly red",
        "eye_color": "green",
        "gender": "girl"
    }

    # Insert job record
    job = supabase.table("jobs").insert({
        "status": "pending",
        "progress": 0,
        "child_data": child_data
    }).execute()

    job_id = job.data[0]["id"]
    print(f"Job created: {job_id}")

    # Run the full pipeline
    result = asyncio.run(run_pipeline(job_id, child_data))

    print(f"\nFinal result:")
    print(f"Title:  {result['title']}")
    print(f"Pages:  {result['pages']}")
    print(f"Images: {result['images']}")
    print(f"Status: success")