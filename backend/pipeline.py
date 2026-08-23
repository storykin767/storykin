import asyncio
import logging
import os
import ssl

import certifi
from dotenv import load_dotenv
from supabase import Client, create_client

from image_generator import generate_all_images
from story_generator import generate_story

ssl._create_default_https_context = ssl.create_default_context(cafile=certifi.where())

load_dotenv()

log = logging.getLogger("storykin.pipeline")

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

TOTAL_PAGES = 12
STORY_PROGRESS = 30      # progress once the story is written
IMAGE_PROGRESS = 65      # progress budget shared across the illustrations


async def run_pipeline(job_id: str, child_data: dict) -> dict:
    try:
        # ── Step 1: Write the story ────────────────────────────
        supabase.table("jobs").update({
            "status": "generating_story",
            "progress": 10,
        }).eq("id", job_id).execute()

        log.info("[%s] Generating story...", job_id)
        story = await asyncio.to_thread(
            generate_story,
            child_name=child_data["child_name"],
            age=child_data["age"],
            pronouns=child_data.get("pronouns", "she"),
            theme=child_data["theme"],
            hair_color=child_data["hair_color"],
            eye_color=child_data["eye_color"],
            skin_tone=child_data.get("skin_tone", "medium-light"),
            moral=child_data.get("moral", "none"),
            sidekick=child_data.get("sidekick"),
        )
        log.info("[%s] Story done: %s", job_id, story.title)

        # ── Step 2: Save the story ─────────────────────────────
        supabase.table("jobs").update({
            "status": "generating_images",
            "progress": STORY_PROGRESS,
            "current_page": 0,
            "story_data": story.model_dump(),
        }).eq("id", job_id).execute()

        # ── Step 3: Paint the illustrations ────────────────────
        log.info("[%s] Painting %s illustrations...", job_id, len(story.pages))
        total = len(story.pages) or TOTAL_PAGES
        completed = 0
        lock = asyncio.Lock()

        async def on_page_done(page_number: int) -> None:
            """Report live progress so the loading screen means something."""
            nonlocal completed
            async with lock:
                completed += 1
                done = completed
            progress = STORY_PROGRESS + int(IMAGE_PROGRESS * done / total)
            try:
                await asyncio.to_thread(
                    lambda: supabase.table("jobs").update({
                        "progress": progress,
                        "current_page": done,
                    }).eq("id", job_id).execute()
                )
            except Exception as e:
                log.warning("[%s] Progress update failed: %s", job_id, e)

        pages_for_images = [p.model_dump() for p in story.pages]
        image_results = await generate_all_images(
            pages_for_images, job_id, on_page_done=on_page_done
        )
        log.info("[%s] All illustrations done.", job_id)

        # ── Step 4: Save the pages ─────────────────────────────
        rows = []
        for result in image_results:
            page_data = next(
                p for p in story.pages if p.page_number == result["page_number"]
            )
            rows.append({
                "job_id": job_id,
                "page_number": result["page_number"],
                "page_text": page_data.page_text,
                "dalle_prompt": page_data.dalle_prompt,
                "image_url": result["image_url"],
            })
        supabase.table("story_pages").insert(rows).execute()

        # ── Step 5: Mark complete ──────────────────────────────
        image_urls = {str(r["page_number"]): r["image_url"] for r in image_results}
        supabase.table("jobs").update({
            "status": "complete",
            "progress": 100,
            "current_page": total,
            "image_urls": image_urls,
        }).eq("id", job_id).execute()

        log.info("[%s] Pipeline complete!", job_id)
        return {
            "success": True,
            "job_id": job_id,
            "title": story.title,
            "pages": len(story.pages),
            "images": len(image_results),
        }

    except Exception as e:
        log.exception("[%s] Pipeline failed: %s", job_id, e)
        try:
            supabase.table("jobs").update({
                "status": "failed",
                "error_message": str(e)[:500],
            }).eq("id", job_id).execute()
        except Exception as db_error:
            log.error("[%s] Could not record failure: %s", job_id, db_error)
        return {"success": False, "job_id": job_id, "error": str(e)}


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(message)s")

    child_data = {
        "child_name": "Ava",
        "age": 4,
        "pronouns": "she",
        "theme": "dinosaur",
        "hair_color": "curly red",
        "eye_color": "green",
        "skin_tone": "light",
        "moral": "bravery",
        "sidekick": None,
    }

    job = supabase.table("jobs").insert({
        "status": "pending",
        "progress": 0,
        "child_data": child_data,
    }).execute()

    job_id = job.data[0]["id"]
    print(f"Job created: {job_id}")

    result = asyncio.run(run_pipeline(job_id, child_data))
    print(f"\nResult: {result}")
