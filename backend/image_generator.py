import asyncio
import os
import httpx
from openai import AsyncOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def generate_single_image(prompt: str, page_number: int) -> bytes:
    print(f"  Painting page {page_number}...")
    response = await client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1
    )
    temp_url = response.data[0].url
    print(f"  Page {page_number} painted. Downloading immediately...")

    # Download immediately before URL expires
    async with httpx.AsyncClient(timeout=30.0) as http:
        img_response = await http.get(temp_url)
        image_bytes = img_response.content

    print(f"  Page {page_number} downloaded.")
    return image_bytes

async def generate_and_save_image(page: dict, job_id: str) -> dict:
    # Generate AND download in one step
    image_bytes = await generate_single_image(
        prompt=page["dalle_prompt"],
        page_number=page["page_number"]
    )

    # Upload to Supabase Storage permanently
    file_path = f"{job_id}/page_{page['page_number']}.png"
    supabase.storage.from_("storykin-images").upload(
        path=file_path,
        file=image_bytes,
        file_options={"content-type": "image/png"}
    )

    # Get permanent public URL
    public_url = supabase.storage.from_("storykin-images").get_public_url(file_path)
    print(f"  Page {page['page_number']} saved permanently.")

    return {
        "page_number": page["page_number"],
        "image_url": public_url
    }

async def generate_all_images(pages: list, job_id: str) -> list:
    semaphore = asyncio.Semaphore(3)

    async def generate_with_limit(page):
        async with semaphore:
            return await generate_and_save_image(page, job_id)

    tasks = [generate_with_limit(page) for page in pages]
    results = await asyncio.gather(*tasks)
    return sorted(results, key=lambda x: x["page_number"])


if __name__ == "__main__":
    # Test with 2 pages to save credits
    test_job_id = "test-job-001"
    test_pages = [
        {
            "page_number": 1,
            "dalle_prompt": "A 4-year-old girl with curly red hair and green eyes discovering a shiny magical egg in a lush green garden on a sunny day. Children's book illustration, watercolour style, warm colours, magical atmosphere."
        },
        {
            "page_number": 2,
            "dalle_prompt": "A 4-year-old girl with curly red hair and green eyes carefully picking up a glowing egg while a friendly butterfly watches. Children's book illustration, watercolour style, warm colours, magical atmosphere."
        }
    ]

    print("Generating and saving illustrations...")
    results = asyncio.run(generate_all_images(test_pages, test_job_id))

    for r in results:
        print(f"\nPage {r['page_number']}:")
        print(f"Permanent URL: {r['image_url']}")