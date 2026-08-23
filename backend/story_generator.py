import logging
import os
from typing import List

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
from tenacity import retry, stop_after_attempt, wait_exponential

load_dotenv()

log = logging.getLogger("storykin.story")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

STORY_MODEL = os.getenv("STORY_MODEL", "gpt-4o")
EXPECTED_PAGES = 12

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
def generate_story(
    child_name: str,
    age: int,
    pronouns: str,
    theme: str,
    hair_color: str,
    eye_color: str,
    skin_tone: str,
    moral: str = 'none',
    sidekick: str = None
) -> Story:

    # Build pronoun set
    pronoun_map = {
        'she': ('she', 'her', 'her', 'herself'),
        'he': ('he', 'him', 'his', 'himself'),
        'they': ('they', 'them', 'their', 'themselves'),
    }
    subj, obj, poss, reflex = pronoun_map.get(pronouns, pronoun_map['she'])

    # Build moral instruction
    moral_map = {
        'none': 'Just make it a fun, joyful adventure with no specific lesson.',
        'bravery': 'Weave in a theme of being brave and facing your fears.',
        'kindness': 'Weave in a theme of kindness and caring for others.',
        'sharing': 'Weave in a theme of sharing and generosity.',
        'trying': 'Weave in a theme of trying new things even when scared.',
        'friendship': 'Weave in a theme of the value of true friendship.',
        'family': 'Weave in a theme of family love and belonging.',
    }
    moral_instruction = moral_map.get(moral, moral_map['none'])

    # Build sidekick instruction
    sidekick_instruction = ''
    if sidekick:
        sidekick_instruction = f'- {child_name} has a loyal companion called {sidekick} who appears throughout the story and helps {obj} on the adventure.'

    prompt = f"""
You are a children's book author creating a personalised storybook.

Child details:
- Name: {child_name}
- Age: {age}
- Pronouns: {subj}/{obj}/{poss}
- Hair: {hair_color}
- Eyes: {eye_color}
- Skin tone: {skin_tone}
- Theme: {theme}
{sidekick_instruction}

Story guidance:
- {moral_instruction}
- Use pronouns {subj}/{obj}/{poss} consistently throughout
- Each page has 2-3 short sentences maximum (this is a picture book)
- Language appropriate for age {age}
- The story has a clear beginning, middle and end across all 12 pages:
  pages 1-3 set up {child_name}'s world and the call to adventure,
  pages 4-9 are the adventure and the problem to solve,
  pages 10-12 resolve it and bring {child_name} safely home
- {child_name} is the hero who solves a problem or goes on an adventure
- Warm, magical, joyful tone
- Never mention AI or that this is generated

For each page also write a DALL-E image prompt that:
- Describes a children's book illustration in a warm, watercolour style
- Always describes {child_name} as a {age} year old child with {hair_color} hair, {eye_color} eyes and {skin_tone} skin tone
- Is specific about the scene, colours and mood
{f'- Includes {sidekick} as a visible companion in the scene' if sidekick else ''}
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

Return exactly 12 pages. No extra text outside the JSON.
"""

    response = client.chat.completions.create(
        model=STORY_MODEL,
        messages=[
            {"role": "system", "content": "You are a children's book author. You always return valid JSON exactly as requested."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.8
    )

    raw = response.choices[0].message.content
    story = Story.model_validate_json(raw)

    # A short book would break the PDF layout and shortchange the buyer,
    # so let tenacity retry rather than shipping it
    if len(story.pages) != EXPECTED_PAGES:
        raise ValueError(
            f"Expected {EXPECTED_PAGES} pages, model returned {len(story.pages)}"
        )
    story.pages.sort(key=lambda p: p.page_number)
    for index, page in enumerate(story.pages, start=1):
        page.page_number = index
        if not page.page_text.strip() or not page.dalle_prompt.strip():
            raise ValueError(f"Page {index} came back empty")

    log.info("Story written: %s (%s pages)", story.title, len(story.pages))
    return story


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(message)s")

    story = generate_story(
        child_name="Ava",
        age=4,
        pronouns="she",
        theme="dinosaur",
        hair_color="curly red",
        eye_color="green",
        skin_tone="light",
        moral="bravery",
        sidekick="Buster the Dog",
    )
    print(f"\nTitle: {story.title}")
    print(f"Pages: {len(story.pages)}")
    print(f"\nPage 1 text: {story.pages[0].page_text}")
    print(f"\nPage 1 image prompt: {story.pages[0].dalle_prompt}")
