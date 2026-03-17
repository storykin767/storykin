from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Pydantic models — define exactly what JSON we expect back
class StoryPage(BaseModel):
    page_number: int
    page_text: str
    dalle_prompt: str

class Story(BaseModel):
    title: str
    child_name: str
    theme: str
    pages: List[StoryPage]

# Retry up to 3 times with exponential backoff if API fails
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def generate_story(child_name: str, age: int, theme: str, hair_color: str, eye_color: str, gender: str) -> Story:

    prompt = f"""
You are a children's book author creating a personalised storybook.

Child details:
- Name: {child_name}
- Age: {age}
- Gender: {gender}
- Hair: {hair_color}
- Eyes: {eye_color}
- Theme: {theme}

Write a 10-page children's story starring {child_name} as the hero.

Rules:
- Each page has 2-3 short sentences maximum (this is a picture book)
- Language appropriate for age {age}
- The story has a clear beginning, middle and end
- {child_name} solves a problem or goes on an adventure
- Warm, magical, joyful tone
- Never mention AI or that this is generated

For each page also write a DALL-E image prompt that:
- Describes a children's book illustration in a warm, watercolour style
- Always describes {child_name} as a {age} year old {gender} with {hair_color} hair and {eye_color} eyes
- Is specific about the scene, colours and mood
- Ends with: "Children's book illustration, watercolour style, warm colours, magical atmosphere"

Return ONLY valid JSON in this exact format:
{{
  "title": "story title here",
  "child_name": "{child_name}",
  "theme": "{theme}",
  "pages": [
    {{
      "page_number": 1,
      "page_text": "page text here",
      "dalle_prompt": "detailed image prompt here"
    }}
  ]
}}

Return exactly 10 pages. No extra text outside the JSON.
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a children's book author. You always return valid JSON exactly as requested."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.8
    )

    raw = response.choices[0].message.content
    data = Story.model_validate_json(raw)
    return data


if __name__ == "__main__":
    print("Generating story for Ava...")
    story = generate_story(
        child_name="Ava",
        age=4,
        theme="dinosaur adventure",
        hair_color="curly red",
        eye_color="green",
        gender="girl"
    )
    print(f"\nTitle: {story.title}")
    print(f"Pages: {len(story.pages)}")
    print(f"\nPage 1:")
    print(f"Text: {story.pages[0].page_text}")
    print(f"\nImage prompt: {story.pages[0].dalle_prompt}")