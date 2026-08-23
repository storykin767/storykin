import asyncio
import logging
import os

import httpx
from dotenv import load_dotenv
from openai import AsyncOpenAI
from supabase import Client, create_client
from tenacity import retry, stop_after_attempt, wait_exponential

load_dotenv()

log = logging.getLogger("storykin.images")

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

# Semaphore(3) keeps us inside the OpenAI image rate limit
MAX_CONCURRENT_IMAGES = int(os.getenv("MAX_CONCURRENT_IMAGES", "3"))


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def generate_single_image(prompt: str, page_number: int) -> bytes:
    log.info("  Painting page %s...", page_number)
    response = await client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )
    temp_url = response.data[0].url

    # DALL-E URLs expire after ~2 hours, so download the bytes right now
    async with httpx.AsyncClient(timeout=60.0) as http:
        img_response = await http.get(temp_url)
        img_response.raise_for_status()
        image_bytes = img_response.content

    log.info("  Page %s painted and downloaded (%.0f KB)", page_number,
             len(image_bytes) / 1024)
    return image_bytes


def _upload(file_path: str, image_bytes: bytes) -> str:
    """Upload to Supabase Storage and return the permanent public URL."""
    supabase.storage.from_("storykin-images").upload(
        path=file_path,
        file=image_bytes,
        file_options={"content-type": "image/png", "upsert": "true"},
    )
    return supabase.storage.from_("storykin-images").get_public_url(file_path)


async def generate_and_save_image(page: dict, job_id: str) -> dict:
    image_bytes = await generate_single_image(
        prompt=page["dalle_prompt"],
        page_number=page["page_number"],
    )

    file_path = f"{job_id}/page_{page['page_number']}.png"
    public_url = await asyncio.to_thread(_upload, file_path, image_bytes)

    return {"page_number": page["page_number"], "image_url": public_url}


async def generate_all_images(pages: list, job_id: str, on_page_done=None) -> list:
    """Paint every page in parallel, respecting the OpenAI rate limit.

    on_page_done is an optional async callback invoked with the page number
    each time an illustration finishes, so callers can report progress.
    """
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_IMAGES)

    async def generate_with_limit(page):
        async with semaphore:
            result = await generate_and_save_image(page, job_id)
        if on_page_done:
            await on_page_done(result["page_number"])
        return result

    results = await asyncio.gather(*[generate_with_limit(p) for p in pages])
    return sorted(results, key=lambda x: x["page_number"])
