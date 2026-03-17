import os
import io
import time
import httpx
from PIL import Image
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SECRET_KEY")
)

# Gelato A5 spec with 3mm bleed
PAGE_WIDTH  = 148 * mm
PAGE_HEIGHT = 210 * mm
BLEED       = 3 * mm
W           = PAGE_WIDTH  + (2 * BLEED)
H           = PAGE_HEIGHT + (2 * BLEED)


def fetch_image(url: str) -> ImageReader:
    """Download image URL and return an in-memory ImageReader."""
    with httpx.Client(timeout=30.0) as client:
        data = client.get(url).content
    img = Image.open(io.BytesIO(data))
    if img.mode not in ('RGB', 'CMYK'):
        img = img.convert('RGB')
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=95)
    buf.seek(0)
    return ImageReader(buf)


def draw_cover(c, child_name: str, story_title: str, img_reader: ImageReader):
    """Draw the cover page."""
    c.drawImage(img_reader, 0, 0, width=W, height=H)
    # Dark overlay at bottom for text
    c.setFillColor(HexColor('#000000'))
    c.setFillAlpha(0.50)
    c.rect(0, 0, W, H * 0.35, fill=1, stroke=0)
    c.setFillAlpha(1.0)
    # Child name + title
    c.setFillColor(HexColor('#FFFFFF'))
    c.setFont("Helvetica-Bold", 26)
    c.drawCentredString(W / 2, H * 0.22, f"{child_name}'s")
    c.setFont("Helvetica", 17)
    subtitle = story_title.replace(f"{child_name} and the ", "")
    c.drawCentredString(W / 2, H * 0.12, subtitle)
    c.showPage()


def draw_page(c, page_text: str, page_num: int, img_reader: ImageReader):
    """Draw a single interior page."""
    img_h = H * 0.65
    # Illustration top 65%
    c.drawImage(img_reader, 0, H - img_h, width=W, height=img_h)
    # Cream background for text area
    c.setFillColor(HexColor('#FFFEF5'))
    c.setFillAlpha(1.0)
    c.rect(0, 0, W, H * 0.35, fill=1, stroke=0)
    # Story text — word wrap
    c.setFillColor(HexColor('#2C2C2A'))
    c.setFont("Helvetica", 13)
    words = page_text.split()
    lines, current = [], []
    for word in words:
        current.append(word)
        if len(' '.join(current)) > 38:
            if len(current) > 1:
                current.pop()
                lines.append(' '.join(current))
                current = [word]
            else:
                lines.append(' '.join(current))
                current = []
    if current:
        lines.append(' '.join(current))
    y = H * 0.30
    for line in lines:
        c.drawCentredString(W / 2, y, line)
        y -= 7 * mm
    # Page number
    c.setFont("Helvetica", 9)
    c.setFillColor(HexColor('#888780'))
    c.drawCentredString(W / 2, BLEED + 4 * mm, str(page_num))
    c.showPage()


def build_pdf(job_id: str) -> str:
    """Build complete print-ready PDF for a job. Returns local file path."""
    print(f"\nBuilding PDF for {job_id}...")

    # Fetch job + pages from Supabase
    job   = supabase.table("jobs").select("*").eq("id", job_id).single().execute()
    pages = supabase.table("story_pages")\
        .select("*").eq("job_id", job_id)\
        .order("page_number").execute()

    child_name  = job.data["child_data"]["child_name"]
    story_title = job.data["story_data"]["title"]
    print(f"  {len(pages.data)} pages — {story_title}")

    out_path = f"/tmp/storykin_{job_id}.pdf"
    c = canvas.Canvas(out_path, pagesize=(W, H))
    c.setTitle(story_title)

    # Cover
    print("  Cover page...")
    cover_img = fetch_image(pages.data[0]["image_url"])
    draw_cover(c, child_name, story_title, cover_img)

    # Interior pages
    for page in pages.data:
        print(f"  Page {page['page_number']}...")
        img = fetch_image(page["image_url"])
        draw_page(c, page["page_text"], page["page_number"], img)

    c.save()
    print(f"  Saved: {out_path}")
    return out_path


def upload_pdf(job_id: str, pdf_path: str) -> str:
    """Upload PDF to Supabase Storage. Returns public URL."""
    with open(pdf_path, 'rb') as f:
        pdf_bytes = f.read()

    file_path = f"{job_id}/storykin_book_{int(time.time())}.pdf"
    supabase.storage.from_("storykin-images").upload(
        path=file_path,
        file=pdf_bytes,
        file_options={"content-type": "application/pdf"}
    )
    url = supabase.storage.from_("storykin-images").get_public_url(file_path)
    print(f"  Uploaded: {url}")
    return url


if __name__ == "__main__":
    job_id   = "3ccf238a-37e9-4f45-9217-ee0a2fd71c18"
    pdf_path = build_pdf(job_id)
    pdf_url  = upload_pdf(job_id, pdf_path)
    os.remove(pdf_path)
    print(f"\nDone! Open this URL:\n{pdf_url}")