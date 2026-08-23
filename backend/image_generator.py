import asyncio
import base64
import logging
import os
import time
from collections import deque

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

# dall-e-3 was retired by OpenAI; every illustration call started returning
# "The model 'dall-e-3' does not exist" and silently failed every book.
# gpt-image-1 at medium: ~16s an image, ~$0.042 each, and it honours the
# eye and hair colour in the prompt (low quality does not, reliably).
IMAGE_MODEL = os.getenv("IMAGE_MODEL", "gpt-image-1")
IMAGE_QUALITY = os.getenv("IMAGE_QUALITY", "medium")
IMAGE_SIZE = os.getenv("IMAGE_SIZE", "1024x1024")

# OpenAI caps image generation per minute per organisation, and the cap is
# low on the starter tier (5/min when this was written). Exceeding it fails
# the whole book with a 429 partway through, so pace the calls rather than
# relying on the concurrency limit alone. Raise this after OpenAI raises the
# account's tier: https://platform.openai.com/account/rate-limits
IMAGES_PER_MINUTE = int(os.getenv("IMAGES_PER_MINUTE", "5"))


class MinuteRateLimiter:
    """Sliding-window limiter: at most `per_minute` acquisitions in any 60s."""

    def __init__(self, per_minute: int):
        self.per_minute = per_minute
        self._calls: deque = deque()
        self._lock = asyncio.Lock()

    async def acquire(self) -> None:
        async with self._lock:
            while True:
                now = time.monotonic()
                while self._calls and now - self._calls[0] >= 60:
                    self._calls.popleft()
                if len(self._calls) < self.per_minute:
                    self._calls.append(now)
                    return
                wait = 60 - (now - self._calls[0]) + 0.5
                log.info("  Image rate limit reached, pausing %.0fs", wait)
                await asyncio.sleep(wait)


# reraise=True: see story_generator — keeps the underlying OpenAI error
@retry(stop=stop_after_attempt(4), wait=wait_exponential(multiplier=2, min=5, max=45),
       reraise=True)
async def generate_single_image(prompt: str, page_number: int) -> bytes:
    log.info("  Painting page %s...", page_number)
    response = await client.images.generate(
        model=IMAGE_MODEL,
        prompt=prompt,
        size=IMAGE_SIZE,
        quality=IMAGE_QUALITY,
        n=1,
    )
    data = response.data[0]

    # gpt-image-* return the image inline as base64 rather than a URL, so
    # there is no longer an expiring link to race against
    if getattr(data, "b64_json", None):
        image_bytes = base64.b64decode(data.b64_json)
    elif getattr(data, "url", None):
        async with httpx.AsyncClient(timeout=60.0) as http:
            img_response = await http.get(data.url)
            img_response.raise_for_status()
            image_bytes = img_response.content
    else:
        raise ValueError(f"{IMAGE_MODEL} returned neither b64_json nor url")

    log.info("  Page %s painted (%.0f KB)", page_number, len(image_bytes) / 1024)
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
    rate_limiter = MinuteRateLimiter(IMAGES_PER_MINUTE)

    async def generate_with_limit(page):
        async with semaphore:
            await rate_limiter.acquire()
            result = await generate_and_save_image(page, job_id)
        if on_page_done:
            await on_page_done(result["page_number"])
        return result

    results = await asyncio.gather(*[generate_with_limit(p) for p in pages])
    return sorted(results, key=lambda x: x["page_number"])
