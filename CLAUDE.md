# Storykin -- AI Personalised Children's Storybooks
## Complete Founder & Developer Briefing v2.0

---

## 1. What is Storykin?

A web platform that generates fully personalised, AI-illustrated children's storybooks
and fulfils them as premium physical print-on-demand books. Every book is unique to one child.

The core insight: competitors sell $5 digital subscriptions. We sell a $39.99 physical
keepsake -- a tangible emotional object that grandparents, parents, and gift-givers will
happily pay a premium for. The moat is the physicality, not the AI.

We never market this as an "AI app." We market it as the ultimate personalised gift.

The name Storykin comes from: Story + Kin (family in Old English).
Meaning: a story for your own family. A story that belongs to you and only you.

---

## 2. Business Model

- Retail price: $39.99 physical / $9.99 digital PDF
- AI generation cost: ~$0.75 per book (GPT-4o + DALL-E 3)
- Print + ship cost: ~$13.50 (Gelato A5 softcover)
- Stripe fee: ~$1.46 (2.9% + $0.30)
- Supabase storage: ~$0.09 per book
- Net profit per book: ~$24.19 (61% gross margin)
- Digital PDF profit: ~$9.14 (91% margin)
- Break-even: 6 book sales covers all setup costs (~$130 total capex)
- Monthly fixed costs: $25/mo (Railway $5 + Vercel Pro $20)

### Revenue milestones
- 10 orders/mo = $242 profit
- 50 orders/mo = $1,210 profit
- 100 orders/mo = $2,419 profit
- 500 orders/mo = $12,095 profit
- December (Christmas, 6x): 600 orders = ~$14,514 profit in one month

### Seasonal multipliers
- Christmas (December): 6x baseline
- Mother's Day (May): 4x baseline
- Valentine's Day (February): 2x baseline
- Father's Day (June): 2x baseline

---

## 3. Target Customers & Personas

### Primary buyer: Grandma buying for grandchild
- Age 55-75
- Not tech-savvy -- product must feel magical not technical
- Emotional purchase -- wants a keepsake not a gadget
- Will pay premium for something truly personalised
- Discovery channel: Facebook groups, Pinterest, word of mouth
- Key message: "The only book written just for [child's name]"

### Secondary buyer: Parent buying for birthday/Christmas
- Age 28-40
- Tech-comfortable but time-poor
- Wants something memorable and shareable
- Discovery channel: Instagram, TikTok, Reddit parenting groups
- Key message: "Preview the complete book before you pay"

### Gift-giver: Baby shower / first birthday
- Any age
- Needs a unique gift that stands out
- Price-sensitive but will stretch for the right product
- Discovery channel: Pinterest gift guides, Google search
- Key message: "The gift they will never forget"

### What they all have in common
- Buying for emotional reasons not practical ones
- Will share photos/videos if delighted (UGC opportunity)
- Will pay $39.99 without hesitation if they believe in the quality
- Need to see the product before buying (hence preview-before-pay)

---

## 4. Competitor Analysis

### Wonderbly (formerly Lost My Name)
- Raised $19M, 3M+ books sold
- Strong brand, excellent quality, global shipping
- Fixed templates -- same story every time, just name inserted
- Weakness: not truly personalised, expensive ($30+), slow delivery
- Our advantage: genuinely unique story + illustrations every time

### Mixbook
- Strong photo book product
- Not a storybook -- user uploads their own photos
- Different market segment
- Our advantage: zero effort from buyer, AI does everything

### Chatbooks
- Subscription photo books
- Monthly recurring, automatic
- Not personalised storybooks
- Our advantage: emotional keepsake vs photo archive

### Shutterfly
- Mass market, low perceived value
- Template-based, generic
- Our advantage: premium positioning, unique AI content

### Key differentiation
1. Truly unique -- every word and every illustration created fresh
2. Preview before pay -- zero risk for buyer
3. Physical product -- not a digital subscription
4. Deep personalisation -- pronouns, skin tone, sidekick, moral lesson
5. Speed -- book generated in 60 seconds, delivered in 2-3 days

---

## 5. Live URLs

- Frontend: https://storykin-eta.vercel.app
- Backend: https://storykin-production.up.railway.app
- Backend health: https://storykin-production.up.railway.app/health
- Supabase dashboard: https://supabase.com (project: jweriwhordrjpffmmrcp)
- Stripe dashboard: https://dashboard.stripe.com/test
- Railway dashboard: https://railway.app (project: surprising-playfulness)
- Vercel dashboard: https://vercel.com (project: storykin, account: storykin767)
- Sentry dashboard: https://sentry.io (project: javascript-nextjs, org: storykin)
- Resend dashboard: https://resend.com
- GitHub: https://github.com/storykin767/storykin

---

## 6. Technical Architecture -- Hybrid Stack Decision

### What we evaluated
Option A: Pure TypeScript/Next.js (original plan)
Option B: Pure Python/Django
Option C: Next.js frontend + Python FastAPI backend (chosen)

### Why hybrid won
- Python is objectively better for AI pipelines: asyncio + httpx handles parallel DALL-E
  calls more cleanly than JS p-limit. tenacity retry library is unmatched.
- Python is objectively better for PDF/print: Pillow has native CMYK mode.
  ReportLab was literally built for print-quality PDFs. Node alternatives fight you.
- TypeScript is objectively better for frontend: React ecosystem, Vercel zero-config,
  all payment and auth SDKs are TypeScript-first.
- Clean separation: two services, each language doing what it is best at.

### Frontend -- Next.js 14 on Vercel
- Location: /frontend
- React + Tailwind CSS
- App Router (not Pages Router)
- Deployed automatically on every push to main branch
- Free tier handles early traffic, scales automatically
- API calls use NEXT_PUBLIC_API_URL env var

### Backend -- Python FastAPI on Railway
- Location: /backend
- Deployed via Dockerfile (python:3.11-slim base)
- railway.toml forces Dockerfile builder (not Nixpacks)
- Auto-deploys on every push to main branch
- ~$5/mo on Railway starter plan

---

## 7. Key Technical Decisions & Why

### Why FastAPI not Flask or Django
- Async-first: critical for parallel DALL-E calls
- Pydantic built-in: validates GPT-4o JSON output automatically
- Auto Swagger docs at /docs
- Flask has no async. Django is too heavy for a microservice.

### Why tenacity not manual try/except
- 3 lines to add exponential backoff with jitter to any function
- Best retry library in any language
- Saved us multiple times when DALL-E hiccupped during development

### Why asyncio.gather + Semaphore(3) not threading
- Python GIL makes threading unreliable for CPU tasks
- asyncio is native Python async -- no GIL issues for I/O
- Semaphore(3) keeps us within OpenAI rate limits (3 parallel DALL-E calls max)
- Generates all 10 illustrations in ~35-55 seconds instead of ~100 seconds sequential

### Why Pillow not sharp (Node.js)
- Pillow has native CMYK color mode -- essential for print
- sharp is RGB-only, CMYK is a workaround that fights you
- Pillow + ReportLab is the industry standard for Python print pipelines

### Why ReportLab not Puppeteer/pdfkit
- ReportLab was built for print-quality PDFs
- Handles bleeds, CMYK, DPI natively
- Puppeteer has no concept of DPI (screen-first tool)
- pdfkit has no bleed support

### Why Supabase not Firebase or PlanetScale
- PostgreSQL (not NoSQL) -- better for relational order data
- JSONB columns give us flexibility for child_data without schema migrations
- Auth + Storage + DB in one -- no extra accounts
- Both Python and TypeScript have official SDKs
- Free tier is genuinely generous (500MB DB, 1GB storage)
- PlanetScale removed free tier

### Why Railway not Render/Fly.io/Heroku
- Dockerfile deploy in minutes -- no config files beyond railway.toml
- Managed Redis available (for future Celery)
- ~$5/mo starter -- cheapest viable option
- Render has slower cold starts
- Fly.io requires more configuration
- Heroku is expensive

### Why Gelato not Printful/Lulu/Blurb
- Global print network (32 countries) -- faster international delivery
- API-first -- designed for programmatic orders
- Competitive pricing for books (~$13.50 A5 softcover)
- Printful is more expensive for books
- Lulu API is slower and poorly documented
- Blurb has no proper API

### Why Inngest was rejected in favour of FastAPI BackgroundTasks
- Inngest is excellent but adds complexity for a solo founder in early sprints
- FastAPI BackgroundTasks is zero-infrastructure for v1
- asyncio.create_task handles the background pipeline without timeouts
- Plan: migrate to Celery + Redis before significant traffic

### Why we timestamp PDF filenames
- Browser and CDN cache PDF files aggressively by URL
- Same URL = same cached file = user sees old version
- Adding Unix timestamp ensures every PDF has a unique URL
- format: {job_id}/storykin_book_{timestamp}.pdf

### Why JSONB for child_data not separate columns
- Intake form fields may change (we added pronouns, skin_tone, sidekick post-launch)
- JSONB stores any JSON without schema migrations
- Both Python and TypeScript can read it natively
- Supabase Table Editor shows it beautifully

### Why we download DALL-E images immediately
- DALL-E returns temporary signed Azure Blob URLs
- URLs expire after 2 hours
- If we store the URL and download later, it fails
- Solution: download bytes immediately after generation, upload to Supabase Storage
- Supabase Storage URLs are permanent and never expire

---

## 8. Project Structure

storykin/
├── CLAUDE.md                       -- This file. Read before touching anything.
├── .gitignore                      -- Excludes .env, venv, node_modules, __pycache__
├── frontend/
│   ├── app/
│   │   ├── page.tsx                -- Landing page (purple theme, #7C3AED)
│   │   ├── create/
│   │   │   └── page.tsx            -- Intake form (name, pronouns, skin, sidekick, moral, theme)
│   │   ├── loading/
│   │   │   └── page.tsx            -- Magic loading screen, polls /status every 2s
│   │   ├── preview/
│   │   │   └── [jobId]/
│   │   │       └── page.tsx        -- Flipbook viewer + watermark + checkout CTA
│   │   ├── order/
│   │   │   └── success/
│   │   │       └── page.tsx        -- Post-payment success page
│   │   ├── error-page/
│   │   │   └── page.tsx            -- Generation/payment error page
│   │   └── components/
│   │       └── Logo.tsx            -- SVG book + star logo (purple)
│   ├── sentry.client.config.ts     -- Sentry frontend config (auto-generated)
│   ├── sentry.server.config.ts     -- Sentry server config (auto-generated)
│   ├── next.config.ts              -- Next.js config (Sentry plugin added)
│   ├── .env.local                  -- Local env vars (never commit)
│   └── package.json
├── backend/
│   ├── main.py                     -- FastAPI app, all endpoints, CORS config
│   ├── pipeline.py                 -- Full generation orchestration (story+images+DB)
│   ├── story_generator.py          -- GPT-4o story generation, Pydantic models
│   ├── image_generator.py          -- DALL-E 3 async loop, Supabase upload
│   ├── pdf_builder.py              -- ReportLab PDF, Pillow CMYK, Supabase upload
│   ├── checkout.py                 -- Stripe session creation, Resend email
│   ├── Dockerfile                  -- python:3.11-slim, pip install, uvicorn
│   ├── railway.toml                -- Forces Dockerfile builder, sets start command
│   ├── requirements.txt            -- All Python dependencies
│   └── .env                       -- Local env vars (never commit)

---

## 9. API Endpoints (FastAPI)

### GET /health
Returns: {"status": "ok", "service": "storykin-backend"}
Used by: Vercel frontend health check, monitoring

### POST /generate
Creates job record, fires pipeline as background task, returns immediately.
Request body (all fields required except sidekick):
  child_name: str
  age: int (2-8)
  pronouns: str ("she", "he", "they")
  hair_color: str
  eye_color: str
  skin_tone: str ("light", "medium-light", "medium", "medium-dark", "dark")
  theme: str ("dinosaur", "space", "mermaid", "forest", "superhero", "princess")
  moral: str ("none", "bravery", "kindness", "sharing", "trying", "friendship", "family")
  sidekick: Optional[str] ("Buster the Dog", "Teddy the Bear", etc.)
Returns: {"job_id": "uuid"}

### GET /status/{job_id}
Polled every 2 seconds by loading screen.
Returns: status, progress (0-100), current_page, error_message
Status values: pending -> generating_story -> generating_images -> complete / failed

### GET /book/{job_id}
Fetches complete book for preview page.
Returns: child_name, title, pages[]
Each page: page_number, page_text, dalle_prompt, image_url

### POST /checkout
Creates Stripe checkout session and returns redirect URL.
Request: {"job_id": "uuid", "tier": "physical" or "digital"}
Returns: {"checkout_url": "https://checkout.stripe.com/..."}

### POST /webhook
Stripe webhook handler. Validates signature with STRIPE_WEBHOOK_SECRET.
Listens for: checkout.session.completed only.
On payment:
  1. Saves order to Supabase orders table
  2. Sends confirmation email via Resend
  3. (Future) Submits Gelato print order

### GET /test-db
Debug endpoint. Returns all jobs. Used during development only.

### POST /test-db
Debug endpoint. Creates a test job record. Used during development only.

---

## 10. Database Schema (Supabase PostgreSQL)

### jobs table
id: UUID primary key (gen_random_uuid())
status: text -- pending/generating_story/generating_images/complete/failed
progress: integer -- 0 to 100
current_page: integer -- which illustration is currently being painted
child_data: JSONB -- all intake form fields as JSON
story_data: JSONB -- full GPT-4o output (title + 10 pages with text and prompts)
image_urls: JSONB -- {"1": "https://...", "2": "https://...", ...}
error_message: text -- populated if status=failed
created_at: timestamptz (auto)
updated_at: timestamptz (auto-updated via trigger)

### orders table
id: UUID primary key
job_id: UUID foreign key -> jobs.id
stripe_session_id: text (cs_test_... or cs_live_...)
stripe_payment_intent: text (pi_...)
order_type: text (physical / digital)
amount: integer (cents -- 3999 or 999)
currency: text (usd)
customer_email: text
shipping_address: JSONB (from Stripe shipping_details)
gelato_order_id: text (not yet used -- future)
status: text (pending/paid/shipped/delivered)
created_at, updated_at: timestamptz

### story_pages table
id: UUID primary key
job_id: UUID foreign key -> jobs.id
page_number: integer (1-10)
page_text: text
dalle_prompt: text (full prompt sent to DALL-E)
image_url: text (permanent Supabase Storage URL)
created_at: timestamptz

### Supabase Storage buckets
storykin-images (public):
  Structure: {job_id}/page_{n}.png (illustrations)
             {job_id}/storykin_book_{timestamp}.pdf (print-ready PDF)

---

## 11. AI Pipeline (complete detail)

### Step 1: Story generation (GPT-4o)

Model: gpt-4o
Temperature: 0.8
response_format: {"type": "json_object"}

Pydantic models:
  class StoryPage(BaseModel):
    page_number: int
    page_text: str
    dalle_prompt: str

  class Story(BaseModel):
    title: str
    child_name: str
    theme: str
    pages: List[StoryPage]

Pronoun mapping:
  she -> (she, her, her, herself)
  he  -> (he, him, his, himself)
  they -> (they, them, their, themselves)

Moral mapping:
  none -> "Just make it a fun, joyful adventure with no specific lesson."
  bravery -> "Weave in a theme of being brave and facing your fears."
  kindness -> "Weave in a theme of kindness and caring for others."
  sharing -> "Weave in a theme of sharing and generosity."
  trying -> "Weave in a theme of trying new things even when scared."
  friendship -> "Weave in a theme of the value of true friendship."
  family -> "Weave in a theme of family love and belonging."

Sidekick instruction (if provided):
  "{child_name} has a loyal companion called {sidekick} who appears
   throughout the story and helps {obj} on the adventure."

DALL-E style anchor (appended to every image prompt):
  "Children's book illustration, watercolour style, warm colours, magical atmosphere"

tenacity retry: 3 attempts, exponential backoff 2-10 seconds
Cost: ~$0.15 per book

### Step 2: Illustration generation (DALL-E 3)

Model: dall-e-3
Size: 1024x1024
Quality: standard (not hd -- saves cost, quality is sufficient)

Parallelism: asyncio.gather with Semaphore(3)
  - Semaphore(3) = max 3 concurrent DALL-E calls
  - Stays within OpenAI Tier 1 rate limits (5 images/min)
  - Total time: ~35-55 seconds for 10 illustrations

Image handling:
  1. Generate -> get temporary Azure URL (valid 2 hours)
  2. Download bytes immediately with httpx (30s timeout)
  3. Upload to Supabase Storage as PNG
  4. Store permanent public URL in story_pages table

tenacity retry: 3 attempts per image
Cost: ~$0.60 per book (10 x $0.06)

### Step 3: PDF generation (ReportLab + Pillow)

Gelato A5 softcover spec:
  Page size: 148mm x 210mm
  Bleed: 3mm all sides
  Full size with bleed: 154mm x 216mm
  Color: CMYK
  Resolution: 300 DPI

image_to_reader() function:
  1. Download image from Supabase Storage URL
  2. Open with Pillow
  3. Convert to RGB if not already (DALL-E returns RGB)
  4. Save to in-memory BytesIO as JPEG (quality=95)
  5. Wrap in ReportLab ImageReader
  6. CRITICAL: use in-memory ImageReader not temp files (ReportLab caches by filename)

Cover page layout:
  - Full bleed illustration (FULL_WIDTH x FULL_HEIGHT)
  - Dark overlay bottom 35% (opacity 0.50) for text readability
  - Child name in Helvetica-Bold 26pt white centered at 22% height
  - Story subtitle in Helvetica 17pt white centered at 12% height

Interior page layout:
  - Illustration: top 65% of page (full width)
  - Cream background (#FFFEF5): bottom 35%
  - Story text: Helvetica 13pt, centered, word-wrapped at 38 chars
  - Page number: Helvetica 9pt grey, centered at bottom

PDF upload:
  - Filename includes Unix timestamp to bust browser/CDN cache
  - format: {job_id}/storykin_book_{int(time.time())}.pdf
  - Uploaded to storykin-images Supabase Storage bucket

### Step 4: Order fulfilment (partial)

On Stripe checkout.session.completed:
  1. Parse metadata: job_id, tier, child_name
  2. Get customer email from session.customer_details
  3. Get shipping address from session.shipping_details
  4. Insert into orders table (status: paid)
  5. Send confirmation email via Resend
  6. TODO: Submit Gelato API order with PDF URL

Gelato integration (not yet built):
  - API docs: https://dashboard.gelato.com/api-explorer
  - Product: Softcover book, A5 format
  - Need to: fetch PDF from Supabase Storage, submit to Gelato with shipping address
  - Add to webhook handler in checkout.py after Step 5

---

## 12. The Master GPT-4o Prompt

This is the exact prompt structure used in story_generator.py:

---
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
- The story has a clear beginning, middle and end
- {child_name} is the hero who solves a problem or goes on an adventure
- Warm, magical, joyful tone
- Never mention AI or that this is generated

For each page also write a DALL-E image prompt that:
- Describes a children's book illustration in a warm, watercolour style
- Always describes {child_name} as a {age} year old child with {hair_color} hair,
  {eye_color} eyes and {skin_tone} skin tone
- Is specific about the scene, colours and mood
{sidekick_dalle_instruction}
- Ends with: "Children's book illustration, watercolour style, warm colours, magical atmosphere"

Return ONLY valid JSON in this exact format:
{
  "title": "story title here",
  "child_name": "{child_name}",
  "theme": "{theme}",
  "pages": [
    {
      "page_number": 1,
      "page_text": "page text here",
      "dalle_prompt": "detailed image prompt here"
    }
  ]
}

Return exactly 10 pages. No extra text outside the JSON.
---

System message: "You are a children's book author. You always return valid JSON exactly as requested."

---

## 13. Character Consistency Strategy

Problem: DALL-E 3 generates each image independently with no memory of previous images.
A child with curly red hair on page 1 may look different on page 7.

Current mitigation (style-anchor approach):
- Every DALL-E prompt ends with the same style anchor phrase
- Every prompt explicitly describes the child: "{age} year old child with {hair_color}
  hair, {eye_color} eyes and {skin_tone} skin tone"
- Warm watercolour style creates artistic consistency even if character varies slightly
- We market this as "dreamy storybook art" not "realistic portrait"

Future improvements:
- img2img: generate character reference image first, use as seed for all subsequent images
- Fine-tuned model: train on consistent character style
- Ideogram or other models with better consistency

The watercolour style is deliberately chosen because it makes character variation
less jarring than photorealistic styles.

---

## 14. Frontend Pages (detailed)

### Landing page (/) -- app/page.tsx
Theme: Purple/violet (#7C3AED gradient)
Sections in order:
  1. Nav: Logo + "Create a book" CTA button
  2. Hero: badge + h1 + subtext + primary CTA + social proof microtext
  3. Social proof bar: 4 trust signals on purple background
  4. How it works: 4 steps in grid with step numbers
  5. Highlighted message: "From first click to front door in under a minute"
  6. 6 themes grid with hover previews
  7. Gift angle section (birthdays, Christmas, baby showers)
  8. Pricing: two cards (physical vs digital)
  9. FAQ: 6 questions with answers
  10. Final CTA section (purple gradient background)
  11. Footer

Key copy decisions:
  - Never say "AI" anywhere on the landing page
  - Lead with the physical book not the technology
  - "Preview before you pay" removes the biggest purchase objection
  - Grandparents are the primary target -- language is warm not techy

### Create page (/create) -- app/create/page.tsx
Fields in order:
  1. Child's name (text input) + privacy microcopy below
  2. Age (select 2-8) + Pronouns (She/He/They toggle buttons)
  3. Skin tone (5 coloured circles with hover label)
  4. Hair colour (select) + Eye colour (select)
  5. Sidekick toggle (off by default) -- reveals name + type fields when on
  6. Moral/lesson (select dropdown, 7 options)
  7. Theme (6 card grid with hover preview text)
  8. Submit button -- "Create [Name]'s book" (dynamic, updates as name typed)

On submit:
  - Validates child_name not empty
  - POST to $NEXT_PUBLIC_API_URL/generate
  - Receives job_id
  - Redirects to /loading?jobId={job_id}
  - On error: redirects to /error-page

### Loading page (/loading) -- app/loading/page.tsx
Uses Suspense wrapper (required for useSearchParams in Next.js App Router)
Polls $NEXT_PUBLIC_API_URL/status/{jobId} every 2000ms
Status messages:
  generating_story -> "Writing the story..."
  generating_images -> "Painting illustration {current_page} of 10..."
  complete -> "Your book is ready!" then redirect after 1500ms
  failed -> redirect to /error-page
Progress bar uses CSS transition duration 1000ms for smooth animation
Animated dots (...) on message text cycle every 500ms

### Preview page (/preview/[jobId]) -- app/preview/[jobId]/page.tsx
Fetches book from $NEXT_PUBLIC_API_URL/book/{jobId}
State: pages[], currentPage index, childName, title, checkoutLoading
Navigation: Previous/Next buttons + dot indicators (active dot wider)
Watermark: absolute positioned, opacity 0.15, rotated -30deg
Checkout flow:
  POST to $NEXT_PUBLIC_API_URL/checkout with {job_id, tier}
  Receives checkout_url
  window.location.href = checkout_url (full redirect to Stripe)

---

## 15. Environment Variables

### backend/.env (never commit to git)
SUPABASE_URL=https://jweriwhordrjpffmmrcp.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
OPENAI_API_KEY=sk-proj-...
STRIPE_SECRET_KEY=sk_test_... (switch to sk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_... (different for local CLI vs Railway)
RESEND_API_KEY=re_...
FRONTEND_URL=https://storykin-eta.vercel.app
ENVIRONMENT=production

### frontend/.env.local (never commit to git)
NEXT_PUBLIC_SUPABASE_URL=https://jweriwhordrjpffmmrcp.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_API_URL=https://storykin-production.up.railway.app
SENTRY_AUTH_TOKEN=sntrys_...

### Vercel environment variables (set in dashboard, all environments)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_API_URL=https://storykin-production.up.railway.app
SENTRY_AUTH_TOKEN

### Railway environment variables (set in service Variables tab)
SUPABASE_URL
SUPABASE_SECRET_KEY
OPENAI_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET (use Railway webhook endpoint secret, not CLI secret)
RESEND_API_KEY
FRONTEND_URL=https://storykin-eta.vercel.app
ENVIRONMENT=production

IMPORTANT: Local Stripe CLI webhook secret (whsec_...) is DIFFERENT from
Railway webhook secret. Each Stripe endpoint has its own signing secret.
Local dev uses: stripe listen --forward-to localhost:8000/webhook -> use that whsec
Railway uses: Stripe dashboard webhook endpoint -> use that whsec

---

## 16. Local Development

### Start backend
cd /Users/A3014443/storykin/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

### Start frontend
cd /Users/A3014443/storykin/frontend
npm run dev

### Start Stripe webhook listener (separate terminal)
stripe listen --forward-to localhost:8000/webhook
(copy the whsec_... and put in backend/.env as STRIPE_WEBHOOK_SECRET)

### GitHub SSH (run after every Mac restart -- SSH agent clears on reboot)
ssh-add ~/.ssh/id_storykin
ssh -T git@github-storykin  -- should say: Hi storykin767!

### Fix git remote if push fails
git remote set-url origin git@github-storykin:storykin767/storykin.git
git push origin main

### Test the full pipeline locally (no frontend needed)
cd backend
source venv/bin/activate
python pipeline.py

### Build a PDF from existing job
cd backend
source venv/bin/activate
python pdf_builder.py  -- update job_id in __main__ block first

### Check which Python/venv is active
which python  -- should show .../storykin/backend/venv/bin/python

### SSL certificate fix (if getting CERTIFICATE_VERIFY_FAILED)
export SSL_CERT_FILE=$(python3 -c "import certifi; print(certifi.where())")
export REQUESTS_CA_BUNDLE=$(python3 -c "import certifi; print(certifi.where())")
Then restart uvicorn in same terminal session.

---

## 17. Operations Runbook

### How to check a failed job in Supabase
1. Go to Supabase -> Table Editor -> jobs
2. Filter by status = failed
3. Check error_message column
4. Check created_at to find when it failed
5. Cross-reference Railway logs at that timestamp

### How to manually check Railway logs
1. Go to railway.app -> surprising-playfulness project
2. Click storykin service
3. Click Deployments tab
4. Click active deployment -> View logs
5. Ctrl+F for the job_id to find specific errors

### How to manually trigger a Gelato order
(Until Gelato is auto-connected)
1. Go to Supabase -> orders table -> find the order
2. Get the job_id
3. Go to jobs table -> get the PDF URL from image_urls
4. Go to Gelato dashboard -> create order manually
5. Update orders table: set gelato_order_id, status=printing

### How to issue a refund in Stripe
1. Go to https://dashboard.stripe.com/test/payments
2. Find the payment by customer email or amount
3. Click the payment
4. Click "Refund" button
5. Select full or partial refund
6. Update orders table: set status=refunded

### How to monitor error rates
1. Sentry: https://sentry.io -> javascript-nextjs project -> Issues
2. Railway: surprising-playfulness -> storykin -> Metrics tab
3. Supabase: check jobs table for status=failed count
4. Stripe: dashboard -> Payments -> filter by failed

### How to add a new theme
1. Add to THEMES array in frontend/app/create/page.tsx
2. Add emoji, label, sample text, color gradient
3. Update story_generator.py prompt to handle new theme word
4. Test with python pipeline.py locally first
5. Push and deploy

### How to switch Stripe to live mode
1. Go to Stripe dashboard -> toggle off Test mode
2. Copy live keys (pk_live_..., sk_live_...)
3. Update Railway variables: STRIPE_SECRET_KEY=sk_live_...
4. Create new webhook endpoint in Stripe pointing to Railway URL
5. Update Railway: STRIPE_WEBHOOK_SECRET=whsec_... (new live secret)
6. Update frontend Vercel: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (if changed)
7. Test with a real $1 purchase

### How to go live with real domain
1. Buy storykin.com on Namecheap (~$14/yr)
2. Vercel -> Domains -> Add storykin.com
3. Follow Vercel DNS instructions (add CNAME/A records in Namecheap)
4. Update FRONTEND_URL in Railway variables
5. Update CORS in backend/main.py (add https://storykin.com)
6. Update Stripe webhook endpoint URL
7. Verify Resend domain -> update from address in checkout.py

---

## 18. Known Issues & Technical Debt

### SSL certificate issue on local Mac (pyenv Python 3.9)
pyenv Python 3.9 does not use Mac system certificates.
Symptoms: httpx.ConnectError: CERTIFICATE_VERIFY_FAILED
Fix: export SSL_CERT_FILE=$(python3 -c "import certifi; print(certifi.where())")
Production (Railway Docker python:3.11-slim) does NOT have this issue.

### Gelato API not yet connected
PDF is built and uploaded to Supabase Storage.
Gelato order submission not yet added to webhook handler.
Next step: add Gelato API call in checkout.py after email send.
Docs: https://dashboard.gelato.com/api-explorer

### Character consistency across illustrations
DALL-E 3 has no memory between generations.
Mitigation: style-anchor prompt + explicit character description every time.
Future: img2img reference image or fine-tuned model.

### Stripe still in test mode
All keys are sk_test_... and pk_test_...
To go live: see "How to switch Stripe to live mode" in Operations section.

### Resend domain not verified
Emails sent from onboarding@resend.dev (Resend sandbox address).
Limitation: can only send to storykin767@gmail.com in test mode.
Fix: verify storykin.com in Resend -> update from address in checkout.py.

### SSH key clears on Mac restart
Every time the Mac restarts, must run: ssh-add ~/.ssh/id_storykin
Permanent fix attempted but Mac keychain integration with pyenv is unreliable.
Workaround: add to ~/.zshrc: ssh-add ~/.ssh/id_storykin 2>/dev/null

### asyncio.create_task background pipeline
Currently uses FastAPI asyncio.create_task for background generation.
Works but is not fault-tolerant -- if Railway restarts mid-generation, job is lost.
Plan: migrate to Celery + Redis before significant traffic.
Redis is available on Railway as a managed service.

---

## 19. Sprint History

Sprint 1 (Week 1) -- Project scaffold
  Next.js 14 + Tailwind CSS frontend
  Python FastAPI backend
  Supabase PostgreSQL schema (jobs, orders, story_pages + triggers)
  Both services connected and talking
  Test job written and read from database
  Code pushed to GitHub (storykin767/storykin)

Sprint 2 (Week 2-3) -- AI engine
  GPT-4o story generation with Pydantic validation
  DALL-E 3 illustration loop (asyncio.gather + Semaphore(3))
  tenacity retries on every API call
  Images downloaded immediately (URL expiry fix)
  Permanent upload to Supabase Storage
  Full pipeline: story + 10 illustrations + DB storage

Sprint 3 (Week 4-5) -- PDF pipeline
  ReportLab PDF builder
  Pillow CMYK conversion at 300 DPI
  3mm bleed, A5 format, Gelato spec compliant
  Cover page + 10 interior pages
  In-memory ImageReader (fixed same-image-on-all-pages bug)
  Timestamp in filename (cache busting fix)
  Physical proof ordered from Gelato sandbox

Sprint 4 (Week 6-7) -- Frontend
  Intake form with all personalisation fields
  Pronouns (She/He/They) replaces binary gender
  Skin tone circle selector (5 options)
  Sidekick companion toggle (name + type)
  Moral/lesson dropdown (7 options)
  Theme cards with hover preview text
  Dynamic CTA button updates with child name
  Privacy microcopy under name field
  Magic loading screen with live SSE polling
  Flipbook preview with page navigation and watermark
  Error pages (generation fail + payment fail)
  Success page after payment

Sprint 5 (Week 8-9) -- Commerce
  Stripe Checkout ($39.99 physical + $9.99 digital tiers)
  Stripe webhook handler (checkout.session.completed)
  Order saved to Supabase orders table
  Resend confirmation email (beautiful HTML template)
  Order status page
  Full end-to-end test with real $1 charge

Sprint 6 (Week 10-11) -- Launch
  Landing page (purple theme, full sections)
  Logo (SVG book + star, purple)
  Sentry error monitoring (frontend)
  Dockerfile + requirements.txt for Railway
  CORS updated for production Vercel URL
  Railway backend deployment (surprising-playfulness project)
  Vercel frontend deployment (storykin-eta.vercel.app)
  Environment variables set in both platforms
  Stripe webhook endpoint updated to Railway URL
  Full production test: book generated on real servers

---

## 20. Roadmap (post-launch)

### Month 1 (after first 10 orders)
  Connect Gelato API for automatic print fulfilment
  Switch Stripe from test to live mode
  Verify storykin.com domain in Resend
  Add $9.99 digital PDF delivery by email (send PDF URL)
  Buy and connect storykin.com custom domain
  Collect first UGC (offer 50% refund for unboxing video)

### Month 2
  User accounts with Supabase Auth
  Order history page for returning customers
  Reviews + testimonials section on landing page
  Shareable preview links (viral loop)
  Refund policy page
  Age-to-reading-level toggle ("Bedtime" vs "Adventure" mode)
  Accessories toggle (glasses, freckles) on create form

### Month 3+
  Multiple languages (GPT-4o writes in any language natively)
  Subscription model: "Book of the Month" club
  Admin dashboard (currently use Supabase Table Editor directly)
  Bulk/corporate orders (schools, baby shower packages)
  Character consistency improvements (img2img or fine-tuned model)
  Celery + Redis migration for fault-tolerant background jobs
  WhatsApp/SMS order notifications

---

## 21. GTM Strategy

### Phase 1 -- Soft launch (week 11-12)
  10 friends and family orders
  Offer 50% refund to anyone who sends a 10-second unboxing video
  Fix any production bugs found by real users
  Post to Reddit r/Entrepreneur (Show HN style)
  Post to Hacker News Show HN

### Phase 2 -- Organic growth (month 2-3)
  Pinterest boards: "personalised baby gifts", "grandparent gift ideas",
    "unique first birthday gifts", "personalised Christmas gifts for kids"
  Facebook groups: parenting, grandparenting, baby shower planning
  NEVER market as an AI app -- always as "the ultimate personalised gift"
  Key message test: "The only book written just for [child's name]"

### Phase 3 -- Holiday sprints
  Mother's Day: start marketing early April (4x multiplier)
    -- email list push, Pinterest content, Facebook targeting grandmothers
  Christmas: start November 1 (6x multiplier)
    -- hard cutoff December 15 for delivery guarantee
    -- "Last order date for Christmas delivery" urgency messaging
  Valentine's Day: start late January (2x multiplier)
    -- "Give the gift of their own story"
  Father's Day: start late May (2x multiplier)
    -- "Adventure" and "Superhero" themes front and centre

### UGC strategy
  Every physical order includes insert card: "Share @storykin to get 20% off next order"
  Insert has QR code linking to TikTok upload prompt
  Target: 1 UGC video per 10 orders
  Even 3 good unboxing videos can drive thousands of visits from TikTok

---

## 22. Co-founder Notes

This entire project was built with Claude (claude.ai) as co-founder and lead developer.
Every architecture decision, line of code, and business strategy was developed
collaboratively across multiple sessions.

Claude does not retain memory between sessions -- this CLAUDE.md file is the
persistent memory that allows Claude to pick up exactly where we left off.

To resume any session effectively, paste this entire file at the start or
save it as CLAUDE.md in the repo root (Claude Code reads it automatically).

### Key decisions made together
- Chose hybrid stack over pure TypeScript or pure Python
- Named the product Storykin (Story + Kin)
- Decided to never use the word "AI" in marketing
- Chose purple over amber for the brand colour
- Added pronouns/skin tone/sidekick/moral to the intake form
- Chose preview-before-pay as the core conversion mechanic
- Decided to target grandparents as primary buyer not parents

### What Claude knows deeply about this project
- Every file, its purpose, and why it was written that way
- Every bug we hit and how we fixed it
- Every architecture decision and the alternatives we rejected
- The exact GPT-4o prompt and why each line is there
- The business model, unit economics, and GTM strategy
- The full sprint history and what was built when

### Starting a new session
Say: "Continue building Storykin" and paste this file.
Claude will immediately know the full context and can:
  - Debug any issue
  - Add new features
  - Deploy changes
  - Answer business questions
  - Write new prompts

Total build time: 6 sprints, ~15 sessions
Total cash outlay to launch: ~$130
First live URL: https://storykin-eta.vercel.app
GitHub: https://github.com/storykin767/storykin

---

## 17. Marketing History (Sprint 7 onwards)

### Current Status (as of April 2026)
- Live at storykinbooks.com
- 0 real paid orders yet
- 14+ books generated by real users since launch
- Stripe live mode approved and active
- No digital marketing spend yet

### Channels Attempted

#### WhatsApp
- Sent launch messages to personal WhatsApp groups
- Used 3 message variants: warm/personal, short/curious, offer discount
- Result: Some interest but no conversions yet
- Key learning: Need real book screenshot attached to messages

#### Product Hunt
- Launched April 14, 2026
- Current rank: 598
- Only 1 comment
- Key learning: Needed more upvoters ready at 12:01 AM PST
- Lesson: Product Hunt audience (tech) ≠ Storykin buyer (grandparents)
- Can relaunch after significant product update

#### Reddit
- Account has 1 karma — cannot post in major subreddits yet
- Building karma via comments on r/aww, r/mildlyinteresting, r/todayilearned
- Target: 50+ karma before posting
- Posts ready to go for: r/Parenting, r/GiftIdeas, r/Mommit, r/SideProject
- Key learning: Never post link in body — put in first comment

#### Facebook Groups
Joined and approved in these groups:
- Grandparents raising grandchildren ✅ POSTED
- Gift ideas for newborns baby & kids ✅ POSTED
- Baby shower gift ideas ⬜ Post tomorrow
- Moms of toddlers ⬜ Post tomorrow
- Grandparents love their grandchildren ⬜ Post day after

Facebook posting strategy:
- Post text without link → then add link in FIRST COMMENT
- This beats Facebook algorithm suppression of external links
- Always attach real book screenshot (stops the scroll)
- Reply to every comment within 1 hour
- Post max 1-2 groups per day to avoid spam flags

#### Google Search Console
- Verified ownership via DNS TXT record in Namecheap
- Sitemap submitted: storykinbooks.com/sitemap.xml
- 2 pages discovered, 0 indexed yet (normal for new domain)
- Issue: "Duplicate canonical" — Google seeing / and no trailing slash as duplicates
- Validation started 4/16/26 — resolves in 1-2 weeks
- SEO takes 4-8 weeks for new domains

#### Bing Webmaster Tools
- Submitted and being processed (48hr window)
- Important for ChatGPT visibility (ChatGPT uses Bing)

#### Vercel Analytics
- Installed @vercel/analytics package
- Added <Analytics /> component to layout.tsx
- Now tracking all visitors from April 2026 onwards

### SEO Implementation
- layout.tsx: Full metadata, OpenGraph, Twitter cards
- sitemap.ts: Auto-generates sitemap.xml
- robots.ts: Auto-generates robots.txt
- page.tsx: Product schema + FAQ schema structured data
- about/page.tsx: About page for AI search indexing
- Canonical URL: https://storykinbooks.com (no trailing slash)
- Target keywords:
  "personalised children's book" (8,100/mo)
  "custom storybook for kids" (2,400/mo)
  "child as hero book" (1,900/mo)
  "personalised birthday gift for child" (4,400/mo)
  "unique gift for grandchild" (1,600/mo)

### Marketing Strategy Decisions

#### Why NOT paid ads yet
- No organic conversions yet = don't know what message converts
- Paid ads before organic validation = burning money
- Rule: Get 10 organic orders first → then give data to marketing team
- Without knowing who buys and why, no targeting possible

#### Why NOT login/accounts yet
- Adds friction to checkout flow
- Grandparents abandon at account creation step
- Estimated 30-40% conversion drop
- Build when repeat buyers start appearing (after 50+ orders)

#### Target customer priority
1. Grandparents buying for grandchildren (highest value)
2. Parents for birthdays/baby showers
3. Gift-givers for Christmas/special occasions

#### What converts
- Real screenshot of actual book illustration (stops scroll)
- Emotional story angle ("she said I'm in a BOOK!")
- Preview before pay removes biggest objection
- Never mention AI — always "personalised gift"
- Physical book angle beats digital subscription

### Messages Written (ready to use)

#### Personal outreach (WhatsApp/text)
3 variants available: Warm & personal, Short & curious, Offer discount (50% off)

#### WhatsApp groups (non-family)
3 variants: Soft launch, Lead with gift angle, Curiosity hook

#### Facebook groups
5 tailored posts written for each group above

#### Reddit posts
- r/Parenting: Dad version emotional story
- r/SideProject: Founder story (no karma needed)
- r/GiftIdeas: Gift guide style
- Founder story for Indie Hackers (requires karma unlock)

#### Indie Hackers
- Account created but needs karma to post
- Founder story written and ready

### Next Marketing Actions (priority order)
1. Post remaining 3 Facebook groups (tomorrow + day after)
2. Build Reddit karma to 50+ (comment daily on r/aww etc)
3. Post r/SideProject founder story (low karma requirement)
4. Post r/Parenting emotional dad story (needs ~50 karma)
5. AlternativeTo listing (alternative to Wonderbly)
6. Parenting blogger outreach (send free books for reviews)
7. Consider paid ads ONLY after first 10 organic orders

### Key Metrics to Track Weekly
- Supabase jobs table: books generated (filter by date)
- Stripe dashboard: live payments
- Vercel Analytics: unique visitors
- Google Search Console: impressions and clicks
- Facebook: post reach and comments
