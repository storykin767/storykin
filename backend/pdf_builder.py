"""Print-ready and digital PDF generation.

Geometry comes from the real Gelato product (8x8" softcover photobook):
the cover is printed as one spread (back | spine | front) on its own file,
and the interior is a separate 28-page file. Both carry a 3mm bleed.
"""
import io
import logging
import os
import time

import httpx
from PIL import Image
from dotenv import load_dotenv
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from supabase import Client, create_client

load_dotenv()

log = logging.getLogger("storykin.pdf")

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

GELATO_API_KEY = os.getenv("GELATO_API_KEY")
GELATO_PRODUCT_UID = os.getenv(
    "GELATO_PRODUCT_UID",
    "photobooks-softcover_pf_200x200-mm-8x8-inch_pt_170-gsm-65lb-coated-silk"
    "_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0"
    "_cpt_250-gsm-100-lb-cover-coated-silk_ver"
)

# ── Product geometry ──────────────────────────────────────────
TRIM        = 200 * mm          # 8x8" square page
BLEED       = 3 * mm
PAGE        = TRIM + (2 * BLEED)   # 206mm — one interior page with bleed

# Gelato requires an even interior page count, minimum 28
INTERIOR_PAGES = 28
STORY_PAGES    = 12                # 12 illustrated spreads = 24 pages

# Fallback spine width if the Gelato cover-dimensions call fails.
# 28 pages measured at 2.72mm; the API is authoritative.
DEFAULT_SPINE = 2.72 * mm

BRAND       = HexColor('#7C3AED')
CREAM       = HexColor('#FFFEF5')
INK         = HexColor('#2C2C2A')
MUTED       = HexColor('#888780')


# ── Helpers ───────────────────────────────────────────────────
def fetch_image(url: str) -> ImageReader:
    """Download an illustration and return an in-memory ImageReader."""
    with httpx.Client(timeout=30.0) as client:
        response = client.get(url)
        response.raise_for_status()
    img = Image.open(io.BytesIO(response.content))
    if img.mode not in ('RGB', 'CMYK'):
        img = img.convert('RGB')
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=95)
    buf.seek(0)
    return ImageReader(buf)


def wrap_text(text: str, font: str, size: float, max_width: float, c) -> list:
    """Wrap text to a pixel width using the real font metrics."""
    lines, current = [], []
    for word in text.split():
        current.append(word)
        if c.stringWidth(' '.join(current), font, size) > max_width:
            if len(current) > 1:
                current.pop()
                lines.append(' '.join(current))
                current = [word]
            else:
                lines.append(' '.join(current))
                current = []
    if current:
        lines.append(' '.join(current))
    return lines


def get_spine_width(page_count: int = INTERIOR_PAGES) -> float:
    """Ask Gelato for the exact spine width — it grows with page count."""
    if not GELATO_API_KEY:
        return DEFAULT_SPINE
    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.get(
                f"https://product.gelatoapis.com/v3/products/"
                f"{GELATO_PRODUCT_UID}/cover-dimensions",
                params={"pageCount": page_count},
                headers={"X-API-KEY": GELATO_API_KEY},
            )
            response.raise_for_status()
            return float(response.json()["spineSize"]["width"]) * mm
    except Exception as e:
        log.warning("Could not fetch spine width (%s) — using default", e)
        return DEFAULT_SPINE


def load_book(job_id: str) -> tuple:
    """Fetch the job and its story pages."""
    job = supabase.table("jobs").select("*").eq("id", job_id).single().execute()
    pages = supabase.table("story_pages")\
        .select("*").eq("job_id", job_id)\
        .order("page_number").execute()

    if not pages.data:
        raise ValueError(f"No story pages found for job {job_id}")
    if not job.data.get("story_data"):
        raise ValueError(f"Job {job_id} has no story data")

    return (
        job.data["child_data"]["child_name"],
        job.data["story_data"]["title"],
        pages.data,
    )


# ── Page painters ─────────────────────────────────────────────
def draw_full_bleed_image(c, img_reader, width=PAGE, height=PAGE, x=0, y=0):
    """Draw an image edge to edge. Does not end the page — the cover reuses it."""
    c.drawImage(img_reader, x, y, width=width, height=height)


def draw_illustration_page(c, img_reader):
    """A full-bleed illustration occupying its own page, facing the text."""
    draw_full_bleed_image(c, img_reader)
    c.showPage()


def draw_title_page(c, child_name: str, story_title: str):
    """Interior page 1 — the half-title the reader meets first."""
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE, PAGE, fill=1, stroke=0)

    c.setFillColor(INK)
    size = 38
    while c.stringWidth(story_title, "Helvetica-Bold", size) > TRIM - (30 * mm) and size > 18:
        size -= 1
    c.setFont("Helvetica-Bold", size)
    c.drawCentredString(PAGE / 2, PAGE * 0.55, story_title)

    c.setFillColor(BRAND)
    c.setFont("Helvetica", 19)
    c.drawCentredString(PAGE / 2, PAGE * 0.45, f"A story for {child_name}")
    c.showPage()


def draw_colophon(c, child_name: str):
    """Interior page 2 — quiet imprint page."""
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE, PAGE, fill=1, stroke=0)

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 11)
    lines = [
        "Published by Storykin",
        "storykinbooks.com",
        "",
        f"This story was written and illustrated",
        f"for {child_name} alone.",
        "",
        "No two Storykin books are the same.",
    ]
    y = PAGE * 0.45
    for line in lines:
        c.drawCentredString(PAGE / 2, y, line)
        y -= 6.5 * mm
    c.showPage()


def draw_dedication(c, child_name: str):
    """Interior page 3 — the emotional beat that makes it a keepsake."""
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE, PAGE, fill=1, stroke=0)

    c.setFillColor(INK)
    c.setFont("Helvetica-Oblique", 20)
    c.drawCentredString(PAGE / 2, PAGE * 0.55, "This book belongs to")

    c.setFillColor(BRAND)
    size = 46
    while c.stringWidth(child_name, "Helvetica-Bold", size) > TRIM - (40 * mm) and size > 20:
        size -= 1
    c.setFont("Helvetica-Bold", size)
    c.drawCentredString(PAGE / 2, PAGE * 0.43, child_name)
    c.showPage()


def draw_story_text_page(c, page_text: str, page_num: int):
    """The text half of a spread — generous white space, centred."""
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE, PAGE, fill=1, stroke=0)

    font, size = "Helvetica", 22
    max_width = TRIM - (34 * mm)
    lines = wrap_text(page_text, font, size, max_width, c)
    while len(lines) > 8 and size > 15:
        size -= 1
        lines = wrap_text(page_text, font, size, max_width, c)

    c.setFillColor(INK)
    c.setFont(font, size)
    leading = size * 1.6
    y = (PAGE / 2) + ((len(lines) - 1) * leading / 2)
    for line in lines:
        c.drawCentredString(PAGE / 2, y, line)
        y -= leading

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10)
    c.drawCentredString(PAGE / 2, BLEED + (10 * mm), str(page_num))
    c.showPage()


def draw_the_end(c, child_name: str):
    """Final interior page."""
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE, PAGE, fill=1, stroke=0)

    c.setFillColor(BRAND)
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(PAGE / 2, PAGE * 0.53, "The End")

    c.setFillColor(MUTED)
    c.setFont("Helvetica", 16)
    c.drawCentredString(PAGE / 2, PAGE * 0.43, f"Sweet dreams, {child_name}.")
    c.showPage()


# ── Interior ──────────────────────────────────────────────────
def build_interior_pdf(job_id: str) -> bytes:
    """Build the 28-page interior block. Cover is a separate file.

    1  title      2  colophon   3  dedication
    4-27  twelve spreads (illustration verso, text recto)
    28  the end
    """
    child_name, story_title, pages = load_book(job_id)
    log.info("Building interior for %s — %s (%s illustrations)",
             job_id, story_title, len(pages))

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(PAGE, PAGE))
    c.setTitle(story_title)
    c.setAuthor("Storykin")

    draw_title_page(c, child_name, story_title)
    draw_colophon(c, child_name)
    draw_dedication(c, child_name)

    story = pages[:STORY_PAGES]
    for page in story:
        draw_illustration_page(c, fetch_image(page["image_url"]))
        draw_story_text_page(c, page["page_text"], page["page_number"])

    draw_the_end(c, child_name)

    # getPageNumber() reports the page that would come next, so the
    # finished count is one less. Gelato rejects the file outright if
    # this is not an even number of at least 28.
    written = c.getPageNumber() - 1
    c.save()
    pdf = buf.getvalue()

    if written != INTERIOR_PAGES:
        raise ValueError(
            f"Interior is {written} pages, Gelato requires exactly "
            f"{INTERIOR_PAGES}. Story had {len(pages)} illustrations, "
            f"needs {STORY_PAGES}."
        )

    log.info("  Interior built: %s pages, %.0f KB", written, len(pdf) / 1024)
    return pdf


# ── Cover ─────────────────────────────────────────────────────
def build_cover_pdf(job_id: str) -> bytes:
    """Build the cover spread: back | spine | front, as one page."""
    child_name, story_title, pages = load_book(job_id)

    spine = get_spine_width()
    width = (2 * TRIM) + (2 * BLEED) + spine
    height = TRIM + (2 * BLEED)
    front_x = BLEED + TRIM + spine
    log.info("Building cover for %s (spine %.2fmm)", job_id, spine / mm)

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(width, height))
    c.setTitle(f"{story_title} — cover")
    c.setAuthor("Storykin")

    # Front cover: full-bleed illustration from page 1
    cover_img = fetch_image(pages[0]["image_url"])
    c.drawImage(cover_img, front_x - BLEED, 0, width=TRIM + (2 * BLEED), height=height)

    # Darken the lower third so the title stays readable
    c.setFillColor(HexColor('#000000'))
    c.setFillAlpha(0.50)
    c.rect(front_x - BLEED, 0, TRIM + (2 * BLEED), height * 0.38, fill=1, stroke=0)
    c.setFillAlpha(1.0)

    centre_front = front_x + (TRIM / 2)
    c.setFillColor(HexColor('#FFFFFF'))
    size = 30
    while c.stringWidth(story_title, "Helvetica-Bold", size) > TRIM - (24 * mm) and size > 14:
        size -= 1
    c.setFont("Helvetica-Bold", size)
    c.drawCentredString(centre_front, height * 0.22, story_title)
    c.setFont("Helvetica", 14)
    c.drawCentredString(centre_front, height * 0.13, f"A story for {child_name}")

    # Back cover: brand colour with a short blurb
    c.setFillColor(BRAND)
    c.rect(0, 0, BLEED + TRIM, height, fill=1, stroke=0)
    centre_back = BLEED + (TRIM / 2)
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont("Helvetica-Bold", 17)
    c.drawCentredString(centre_back, height * 0.60, "A story made only for")
    size = 26
    while c.stringWidth(child_name, "Helvetica-Bold", size) > TRIM - (40 * mm) and size > 14:
        size -= 1
    c.setFont("Helvetica-Bold", size)
    c.drawCentredString(centre_back, height * 0.51, child_name)
    c.setFont("Helvetica", 11)
    c.drawCentredString(centre_back, height * 0.40,
                        "Every Storykin book is written and")
    c.drawCentredString(centre_back, height * 0.365,
                        "illustrated for one child, and one child only.")
    c.setFont("Helvetica", 10)
    c.drawCentredString(centre_back, height * 0.10, "storykinbooks.com")

    # Spine
    c.setFillColor(BRAND)
    c.rect(BLEED + TRIM, 0, spine, height, fill=1, stroke=0)

    c.save()
    pdf = buf.getvalue()
    log.info("  Cover built: %.0fx%.0fmm, %.0f KB", width / mm, height / mm, len(pdf) / 1024)
    return pdf


# ── Digital edition ───────────────────────────────────────────
def build_digital_pdf(job_id: str) -> bytes:
    """Single-file edition for digital buyers: front cover then the interior."""
    child_name, story_title, pages = load_book(job_id)
    log.info("Building digital edition for %s", job_id)

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(PAGE, PAGE))
    c.setTitle(story_title)
    c.setAuthor("Storykin")

    # Front cover as a single page — print buyers get this on the cover file
    c.drawImage(fetch_image(pages[0]["image_url"]), 0, 0, width=PAGE, height=PAGE)
    c.setFillColor(HexColor('#000000'))
    c.setFillAlpha(0.50)
    c.rect(0, 0, PAGE, PAGE * 0.38, fill=1, stroke=0)
    c.setFillAlpha(1.0)
    c.setFillColor(HexColor('#FFFFFF'))
    size = 30
    while c.stringWidth(story_title, "Helvetica-Bold", size) > TRIM - (24 * mm) and size > 14:
        size -= 1
    c.setFont("Helvetica-Bold", size)
    c.drawCentredString(PAGE / 2, PAGE * 0.22, story_title)
    c.setFont("Helvetica", 14)
    c.drawCentredString(PAGE / 2, PAGE * 0.13, f"A story for {child_name}")
    c.showPage()

    draw_title_page(c, child_name, story_title)
    draw_colophon(c, child_name)
    draw_dedication(c, child_name)
    for page in pages[:STORY_PAGES]:
        draw_illustration_page(c, fetch_image(page["image_url"]))
        draw_story_text_page(c, page["page_text"], page["page_number"])
    draw_the_end(c, child_name)

    c.save()
    pdf = buf.getvalue()
    log.info("  Digital edition built: %.0f KB", len(pdf) / 1024)
    return pdf


# ── Storage ───────────────────────────────────────────────────
def upload_pdf(job_id: str, pdf_bytes: bytes, label: str) -> str:
    """Upload a PDF to Supabase Storage. Returns the public URL."""
    # Timestamp busts browser and CDN caches
    file_path = f"{job_id}/storykin_{label}_{int(time.time())}.pdf"
    supabase.storage.from_("storykin-images").upload(
        path=file_path,
        file=pdf_bytes,
        file_options={"content-type": "application/pdf", "upsert": "true"},
    )
    url = supabase.storage.from_("storykin-images").get_public_url(file_path)
    log.info("  Uploaded %s: %s", label, url)
    return url


def build_print_files(job_id: str) -> dict:
    """Build and upload both print files. Returns {'cover': url, 'interior': url}."""
    return {
        "cover": upload_pdf(job_id, build_cover_pdf(job_id), "cover"),
        "interior": upload_pdf(job_id, build_interior_pdf(job_id), "interior"),
    }


def build_and_upload_digital(job_id: str) -> str:
    """Build and upload the digital edition. Returns the public URL."""
    return upload_pdf(job_id, build_digital_pdf(job_id), "book")


if __name__ == "__main__":
    import sys

    logging.basicConfig(level=logging.INFO, format="%(message)s")
    if len(sys.argv) < 2:
        print("Usage: python pdf_builder.py <job_id> [print|digital]")
        raise SystemExit(1)

    job = sys.argv[1]
    mode = sys.argv[2] if len(sys.argv) > 2 else "print"
    if mode == "digital":
        print(f"\nDigital edition:\n{build_and_upload_digital(job)}")
    else:
        for name, url in build_print_files(job).items():
            print(f"\n{name}:\n{url}")
