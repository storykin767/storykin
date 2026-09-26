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
- AI generation cost: ~$0.65 per book
  (GPT-4o $0.15 + 12 x gpt-image-1 at medium, ~$0.042 each)
- Print + ship cost: $16.68 (Gelato 8x8" softcover $9.69 + shipping $6.99, US)
- Stripe fee: ~$1.46 (2.9% + $0.30)
- Supabase storage: ~$0.09 per book
- Net profit per book: ~$21.11 (53% gross margin)

The print figure is confirmed against a real Gelato draft order receipt
(August 2026), not an estimate. The earlier $13.50 print figure was for an A5
product that does not exist in Gelato's catalog.

The generation figure follows the image model in the code and moves when that
does. It was $0.87 when the pipeline used dall-e-3, which OpenAI has retired.

- Digital PDF profit: ~$8.66 (87% margin)
  ($9.99 less ~$0.59 Stripe, ~$0.65 generation, ~$0.09 storage)
- Break-even: 6 book sales covers all setup costs (~$130 total capex)
- Monthly fixed costs: ~$6/mo today, ~$31/mo from 23 October 2026
    Railway    ~$5
    Vercel     $0 — the account is on Hobby, NOT Pro. This file claimed
               "Vercel Pro $20" for months and it was never true. Verified
               in the dashboard on 24 September 2026.
    Supabase   free until 23 October 2026, then $25/mo (see section 18)
    Domain     ~$14/yr ≈ $1.20/mo
    Sentry, Resend, GitHub: free tier
  From 23 October, Supabase is ~80% of the entire fixed cost base.

### Revenue milestones
Physical orders, before fixed costs.
- 10 orders/mo = $211 profit
- 50 orders/mo = $1,056 profit
- 100 orders/mo = $2,111 profit
- 500 orders/mo = $10,555 profit
- December (Christmas, 6x): 600 orders = ~$12,666 profit in one month

Note these are lower than the figures this file carried before Sprint 8. They
were never recalculated after the print cost was corrected from $13.50 to
$16.68, so they were running on a $24.19 margin that no longer existed.

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
- Vercel dashboard: https://vercel.com/storykin767s-projects/storykin
    The URL scope is "storykin767s-projects", NOT "storykin767" — the latter
    404s even while logged in. Analytics: .../storykin/analytics
    Plan: Hobby (free).
- Sentry dashboard: https://sentry.io (project: javascript-nextjs, org: storykin)
- Resend dashboard: https://resend.com
- GitHub: https://github.com/storykin767/storykin

### Companion documents in this repo
- docs/services.md  -- every third-party service, what breaks without it,
                       what it costs, and where the real risk sits
- marketing/        -- the channel playbooks, written to be executed:
                       etsy.md, facebook.md, pinterest.md, outreach.md

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

### Frontend -- Next.js 16 on Vercel
- Location: /frontend
- React 19 + Tailwind CSS v4
- App Router (not Pages Router)
- Deployed automatically on every push to main branch
- Free tier handles early traffic, scales automatically
- API calls use NEXT_PUBLIC_API_URL env var

### Backend -- Python FastAPI on Railway
- Location: /backend
- Deployed via Dockerfile (python:3.11-slim base)
- No railway.toml: Railway detects the Dockerfile on its own. The file was
  removed in the 23 August 2026 revert and deliberately never restored —
  see "Never change the port the Dockerfile binds" in section 18.
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
- Semaphore(3) caps parallel image calls at 3
- It is no longer the binding constraint: the organisation's 5 images/minute
  cap is, so image_generator.py also paces calls through MinuteRateLimiter.
  The semaphore alone attempts ~11/min and fails the book partway with a 429.

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
- Dockerfile deploy in minutes -- no config files at all, it just finds it
- Managed Redis available (for future Celery)
- ~$5/mo starter -- cheapest viable option
- Render has slower cold starts
- Fly.io requires more configuration
- Heroku is expensive

### Why Gelato not Printful/Lulu/Blurb
- Global print network (32 countries) -- faster international delivery
- API-first -- designed for programmatic orders
- Competitive pricing for books ($9.69 for the 8x8" softcover we actually sell;
  the A5 product this originally assumed does not exist in their catalog)
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

### Why we hold image bytes, never image URLs
- dall-e-3 returned temporary signed Azure Blob URLs that expired after 2 hours,
  so storing the URL and downloading later failed
- gpt-image-1 sidesteps this entirely: it returns the image inline as base64,
  so there is no expiring link to race against
- Either way the rule is the same — get the bytes, upload them to Supabase
  Storage, and store only that permanent URL
- image_generator.py still handles both shapes, in case a future model
  returns a URL again

---

## 8. Project Structure

storykin/
├── CLAUDE.md                       -- This file. Read before touching anything.
├── .gitignore                      -- Excludes .env, venv, node_modules, __pycache__
├── frontend/
│   ├── app/
│   │   ├── layout.tsx              -- Metadata, OpenGraph, Pinterest claim, Analytics
│   │   ├── page.tsx                -- Landing page (purple theme, #7C3AED)
│   │   ├── globals.css             -- Tailwind v4 entry point
│   │   ├── create/
│   │   │   └── page.tsx            -- Intake form (name, pronouns, skin, sidekick, moral, theme)
│   │   ├── loading/
│   │   │   └── page.tsx            -- Magic loading screen, polls /status every 2s
│   │   ├── preview/
│   │   │   └── [jobId]/
│   │   │       └── page.tsx        -- Flipbook viewer + watermark + checkout CTA
│   │   ├── order/
│   │   │   └── success/
│   │   │       └── page.tsx        -- Post-payment success page (Stripe success_url)
│   │   ├── error-page/
│   │   │   └── page.tsx            -- Generation/payment error page
│   │   ├── global-error.tsx        -- Root error boundary, reports to Sentry
│   │   ├── about/
│   │   │   └── page.tsx            -- About page (written for AI search indexing)
│   │   ├── refund-policy/
│   │   │   └── page.tsx            -- 14-day reprint-or-refund promise
│   │   ├── books/
│   │   │   └── [theme]/
│   │   │       └── page.tsx        -- 6 static SEO pages, one per theme
│   │   ├── gifts/
│   │   │   └── [occasion]/
│   │   │       └── page.tsx        -- 4 static SEO pages, one per occasion
│   │   ├── content/
│   │   │   ├── themes.ts           -- Copy + FAQs for the 6 /books pages
│   │   │   └── occasions.ts        -- Copy + FAQs for the 4 /gifts pages
│   │   │                              (Christmas also has sections + deadlines)
│   │   ├── sitemap.ts              -- Generates sitemap.xml from the two above
│   │   ├── robots.ts               -- Generates robots.txt; hides /preview, /order
│   │   └── components/
│   │       └── Logo.tsx            -- SVG book + star logo (purple)
│   ├── instrumentation-client.ts   -- Sentry browser config (Next 16 convention)
│   ├── instrumentation.ts          -- Sentry server/edge registration hook
│   ├── sentry.server.config.ts     -- Sentry server config
│   ├── sentry.edge.config.ts       -- Sentry edge config
│   ├── next.config.ts              -- Next.js config (Sentry plugin added)
│   ├── public/                     -- og-image, favicons, samples/ book shots
│   ├── .env.local                  -- Local env vars (never commit)
│   └── package.json
├── backend/
│   ├── config.py                   -- Env validation + logging. Imported FIRST by main.py
│   ├── main.py                     -- FastAPI app, all endpoints, CORS, rate limiting
│   ├── pipeline.py                 -- Full generation orchestration (story+images+DB)
│   ├── fulfillment.py              -- Post-payment: build PDF -> Gelato print / email PDF
│   ├── story_generator.py          -- GPT-4o story generation, Pydantic models
│   ├── image_generator.py          -- gpt-image-1 async loop, rate limiter, upload
│   ├── pdf_builder.py              -- ReportLab cover/interior/digital PDFs, upload
│   ├── checkout.py                 -- Stripe session creation, Resend emails
│   ├── gelato.py                   -- Gelato print order submission
│   ├── migrations/                 -- Optional SQL to run in the Supabase SQL editor
│   ├── Dockerfile                  -- python:3.11-slim, non-root user, uvicorn
│   ├── .dockerignore               -- Keeps venv/.env out of the image
│   ├── requirements.txt            -- All Python dependencies (pinned)
│   └── .env                       -- Local env vars (never commit)
├── docs/
│   └── services.md                 -- Every third-party service: what it does,
│                                      what breaks without it, what it costs
└── marketing/
    ├── etsy.md + etsy/             -- Digital-first Etsy listing pack + images
    ├── facebook.md                 -- Group posts, mapped to specific groups
    ├── pinterest.md                -- Boards, pin copy, posting cadence
    ├── outreach.md                 -- Blogger and gift-guide outreach (time-sensitive:
    │                                  Christmas guides are commissioned Sep-Oct)
    ├── pins/                       -- Pin images
    └── logo-icon-1024.png

There is no test suite. Nothing in this repo is covered by automated tests —
see section 18.

---

## 9. API Endpoints (FastAPI)

### GET /health
Returns: {"status": "ok", "service": "storykin-backend"}
Used by: Vercel frontend health check, monitoring

### POST /generate
Creates job record, fires pipeline as background task, returns immediately.
Rate limited per IP (default 5/hour, 20/day) because each call spends ~$0.75
of OpenAI credit. Over the limit returns 429 with a Retry-After header.
All fields are validated against the allowed values below — an invalid theme,
pronoun, moral or an age outside 2-8 returns 422 and never reaches GPT-4o.
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
Polled every 2 seconds by loading screen. 404 if the job does not exist.
Returns: status, progress (0-100), current_page, error_message
Status values: pending -> generating_story -> generating_images -> complete / failed
progress: 10 (story starting) -> 30 (story done) -> 30..95 (one step per
illustration) -> 100. current_page counts finished illustrations.

### GET /book/{job_id}
Fetches complete book for preview page.
404 if unknown, 409 if the book is not finished generating.
Returns: child_name, title, pages[]
Each page: page_number, page_text, image_url

### POST /checkout
Creates Stripe checkout session and returns redirect URL.
Request: {"job_id": "uuid", "tier": "physical" or "digital"}
Returns: {"checkout_url": "https://checkout.stripe.com/..."}
409 if the job is not complete — you cannot sell a book that does not exist yet.
Shipping address is only collected for the physical tier.

### POST /webhook
Stripe webhook handler. Validates signature with STRIPE_WEBHOOK_SECRET.
Returns 400 on a bad signature so Stripe retries instead of marking it delivered.
Listens for: checkout.session.completed only.
Idempotent — a repeated delivery for the same session_id is ignored, so Stripe
retries can never create two orders or two print jobs for one payment.
On payment:
  1. Saves order to Supabase orders table (status: paid)
  2. Sends confirmation email via Resend
  3. Spawns fulfillment.fulfill_order as a background task and returns
     immediately — building the PDF takes far longer than Stripe will wait

### GET /admin/orders?status=paid
Requires header X-Admin-Token: $ADMIN_TOKEN. Lists orders stuck in a status.
Use status=fulfillment_failed to find orders that need attention.

### POST /admin/orders/{order_id}/fulfill
Requires header X-Admin-Token: $ADMIN_TOKEN.
Re-runs fulfilment for one order: rebuilds the PDF and re-submits to Gelato
(physical) or re-sends the download email (digital). This is the recovery
lever when a paid order failed to fulfil.

### GET /test-db and POST /test-db
Debug endpoints. Only registered when ENVIRONMENT is not "production" —
they return 404 on Railway.

NOTE: the old POST /generate-story endpoint was removed. It still called
generate_story with a `gender` argument that no longer exists, so every
call raised TypeError.

---

## 10. Database Schema (Supabase PostgreSQL)

### jobs table
id: UUID primary key (gen_random_uuid())
status: text -- pending/generating_story/generating_images/complete/failed
progress: integer -- 0 to 100
current_page: integer -- which illustration is currently being painted
child_data: JSONB -- all intake form fields as JSON
story_data: JSONB -- full GPT-4o output (title + 12 pages with text and prompts)
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
status: text (pending/paid/printing/shipped/delivered/fulfillment_failed/test)
created_at, updated_at: timestamptz

NOTE: the four rows dated 21 March 2026 are Stripe TEST orders (every
stripe_session_id starts cs_test_), left over from Sprint 5 checkout testing.
They were physical, $39.99, status "paid" and gelato_order_id null, so at a
glance they read exactly like $160 of real revenue. They are not. The account
has never taken a live payment — see "Stripe live mode" in section 18.

They were re-marked status "test" on 25 September 2026 so nothing mistakes
them for income again. "test" is not a status any code writes or reads; it
exists purely to keep them out of the way. As of that date no row in this
table has status "paid", and the next one that does will be a real customer.

### story_pages table
id: UUID primary key
job_id: UUID foreign key -> jobs.id
page_number: integer (1-12)
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

### Step 2: Illustration generation (gpt-image-1)

Model: gpt-image-1 (override with IMAGE_MODEL)
Size: 1024x1024
Quality: medium (override with IMAGE_QUALITY)

dall-e-3 WAS RETIRED by OpenAI. Every image call returned
"The model 'dall-e-3' does not exist" and every book silently failed —
this is what the 36 failed jobs in the table were. Do not switch back.
gpt-image-2 also works but takes ~55s an image versus ~16s, which would
blow the loading screen's timeout. quality=low renders the wrong eye
colour often enough to matter on a personalised product.

gpt-image-* return the image inline as base64, not as a temporary URL,
so there is no longer an expiring link to download before it dies.

Parallelism: asyncio.gather with Semaphore(3) AND a 5-per-minute limiter
  - The organisation is capped at 5 images/minute. Semaphore(3) alone
    attempts ~11/min and fails the book partway with a 429.
  - MinuteRateLimiter paces calls; raise IMAGES_PER_MINUTE when OpenAI
    raises the account tier.
  - Total time: ~2-3 minutes for 12 illustrations at 5/min

Image handling:
  1. Generate -> get temporary Azure URL (valid 2 hours)
  2. Download bytes immediately with httpx (30s timeout)
  3. Upload to Supabase Storage as PNG
  4. Store permanent public URL in story_pages table

tenacity retry: 3 attempts per image
Cost: ~$0.50 per book (12 x ~$0.042, gpt-image-1 medium)

### Step 3: PDF generation (ReportLab + Pillow)

Gelato 8x8" softcover photobook spec (verified against the live catalog):
  Trim size: 200mm x 200mm square
  Bleed: 3mm all sides
  Interior page with bleed: 206mm x 206mm
  Cover spread with bleed: 408.72mm x 206mm (back | spine | front)
  Spine width: 2.72mm at 28 pages — grows with page count, so it is
    fetched per book from the Gelato cover-dimensions endpoint
  Interior page count: must be EVEN, minimum 28, maximum 200
  Resolution: 300 DPI

The cover and the inner block are printed as two separate files. A single
combined PDF is rejected.

Interior structure (exactly 28 pages):
  1        title page
  2        colophon / imprint
  3        dedication — "This book belongs to {name}"
  4-27     12 spreads: full-bleed illustration (verso) + story text (recto)
  28       "The End"

Three PDFs are produced by pdf_builder.py:
  build_cover_pdf()      -> the cover spread, print only
  build_interior_pdf()   -> the 28 inner pages, print only
  build_digital_pdf()    -> 29 pages (front cover + interior) for digital buyers,
                            since digital buyers would otherwise get no cover

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

### Step 4: Order fulfilment (automatic)

On Stripe checkout.session.completed (main.py):
  1. Verify the signature, reject with 400 if bad
  2. Skip if an order already exists for this session_id (Stripe retries)
  3. Parse metadata: job_id, tier, child_name
  4. Insert into orders table (status: paid)
  5. Send confirmation email via Resend
  6. Spawn fulfillment.fulfill_order and return 200 immediately

fulfillment.fulfill_order (background, never raises):
  1. Build the print-ready PDF in memory and upload it to Supabase Storage
     (this is the step that used to be missing entirely — the PDF was only
      ever built by running pdf_builder.py by hand)
  2. Record the PDF URL on jobs.image_urls["pdf"]
  3. Physical -> submit to Gelato, set gelato_order_id, status=printing
     Digital  -> email the download link, status=delivered
  4. Any failure -> status=fulfillment_failed, full traceback in Railway logs

The PDF is deliberately built after payment, not during generation: most
generated books are never bought, so building every one wastes time and storage.

Gelato (v4 orders API, verified with a real draft order in August 2026):
  - Endpoint: POST https://order.gelatoapis.com/v4/orders
  - productUid (override with GELATO_PRODUCT_UID):
      photobooks-softcover_pf_200x200-mm-8x8-inch
      _pt_170-gsm-65lb-coated-silk_cl_4-4_ccl_4-4_bt_glued-left
      _ct_matt-lamination_prt_1-0_cpt_250-gsm-100-lb-cover-coated-silk_ver
  - pageCount: 28 (even, 28-200)
  - files: [{"type": "cover", ...}, {"type": "default", ...}]
      "cover" is the cover spread, "default" is the inner block
  - shipmentMethodUid: "normal"
  - Requires GELATO_API_KEY to be set on Railway

To test the format without spending money, submit with "orderType": "draft".
Gelato validates and prices the order without printing it, and the draft can
be deleted with DELETE /v4/orders/{id}.

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

Return exactly 12 pages. No extra text outside the JSON.
---

System message: "You are a children's book author. You always return valid JSON exactly as requested."

---

## 13. Character Consistency Strategy

Problem: every image is generated independently, with no memory of the ones
before it. A child with curly red hair on page 1 may look different on page 7.

Current mitigation (style-anchor approach):
- Every image prompt ends with the same style anchor phrase
- Every prompt explicitly describes the child: "{age} year old child with {hair_color}
  hair, {eye_color} eyes and {skin_tone} skin tone"
- Warm watercolour style creates artistic consistency even if character varies slightly
- We market this as "dreamy storybook art" not "realistic portrait"
- IMAGE_QUALITY stays at medium: at low, the model drops the stated eye colour
  often enough to matter on a product sold as personalised

In practice this stopped being the problem it was under dall-e-3. Books
generated through the live site with gpt-image-1 hold the character across all
12 pages well enough that no buyer has been given a reason to comment.

Future improvements, if it regresses:
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
  generating_images -> "Painting illustration {current_page} of 12..."
  complete -> "Your book is ready!" then redirect after 1500ms
  failed -> redirect to /error-page
Progress bar uses CSS transition duration 1000ms for smooth animation
Animated dots (...) on message text cycle every 500ms
Timeouts (generation normally takes 2-3 minutes at the current image rate):
  after 3 minutes  -- swaps in a "taking a little longer than usual" line
  after 7 minutes  -- gives up and redirects to /error-page
  5 consecutive failed polls -- gives up and redirects to /error-page

### Preview page (/preview/[jobId]) -- app/preview/[jobId]/page.tsx
Fetches book from $NEXT_PUBLIC_API_URL/book/{jobId}
State: pages[], currentPage index, childName, title, checkoutLoading
Navigation: Previous/Next buttons + dot indicators (active dot wider)
Watermark: absolute positioned, opacity 0.15, rotated -30deg
Illustrations render through next/image (fill + sizes), NOT a plain <img>.
  The stored files are 1024x1024 PNGs at ~1.7MB each — twelve of those is
  ~20MB to read one preview, on an audience that is 69% mobile. Next serves a
  resized WebP/AVIF instead. The PNG in Supabase Storage is untouched, so
  pdf_builder still fetches the full-quality original for print; this is
  deliberate, because the print-resolution question in section 19c is still
  open and must not be pre-empted by re-encoding the masters.
  Requires images.remotePatterns in next.config.ts, which derives the host
  from NEXT_PUBLIC_SUPABASE_URL so it survives a project-ref change.
  Watch the Vercel image-optimisation quota if volume grows — on Hobby it is
  finite, though at current volume (~60 images/month) it is not close.
Checkout flow:
  POST to $NEXT_PUBLIC_API_URL/checkout with {job_id, tier}
  Receives checkout_url
  window.location.href = checkout_url (full redirect to Stripe)

### SEO pages -- /books/[theme] and /gifts/[occasion]
10 statically generated pages, built from app/content/themes.ts (6 themes) and
app/content/occasions.ts (4 occasions). Both routes use generateStaticParams
plus generateMetadata, emit FAQPage structured data, and are listed in
sitemap.ts automatically — adding an entry to the content file is all it takes
to ship a new page.

The Christmas occasion carries extra fields the others do not: `sections` for
long-form prose and `deadlines` for the ordering cutoff table. Those deadlines
are built from real Gelato transit times and must be kept in step with the
shipping upgrade window in gelato.py.

### Static pages
/about          -- Founder story, written to be quotable by AI search
/refund-policy  -- 14-day reprint-or-refund on printed books; digital is
                   non-refundable once the download email has been sent,
                   except on delivery failure

---

## 15. Environment Variables

### backend/.env (never commit to git)
SUPABASE_URL=https://jweriwhordrjpffmmrcp.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
OPENAI_API_KEY=sk-proj-...
STRIPE_SECRET_KEY=sk_test_... (switch to sk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_... (different for local CLI vs Railway)
RESEND_API_KEY=re_...
GELATO_API_KEY=...              (required for physical fulfilment)
FRONTEND_URL=https://storykinbooks.com
ENVIRONMENT=production

Optional (sensible defaults if unset):
ADMIN_TOKEN=...                 (enables /admin endpoints; 503 without it)
SENTRY_DSN=...                  (backend error monitoring; logs only if unset)
SENTRY_TRACES_SAMPLE_RATE=0.1   (backend trace sampling)
STALE_AFTER_MINUTES=15          (age at which in-flight work counts as orphaned)
RECOVER_WINDOW_HOURS=24         (how far back startup recovery will look)
ALLOWED_ORIGINS=...             (comma separated; defaults to the known frontends)
RATE_LIMIT_PER_HOUR=5           (books per IP per hour on /generate)
RATE_LIMIT_PER_DAY=20           (books per IP per day)
RATE_LIMIT_ENABLED=true         (set false only for local load testing)
FROM_EMAIL=Storykin <hello@storykinbooks.com>
SUPPORT_EMAIL=hello@storykinbooks.com
STORY_MODEL=gpt-4o
IMAGE_MODEL=gpt-image-1          (do NOT set this to dall-e-3 — it was retired)
IMAGE_QUALITY=medium             (low renders the wrong eye colour too often)
IMAGE_SIZE=1024x1024
MAX_CONCURRENT_IMAGES=3
IMAGES_PER_MINUTE=5              (raise only after OpenAI raises the account tier)
GELATO_PAGE_COUNT=28             (defaults to pdf_builder.INTERIOR_PAGES)
GELATO_SHIPMENT_METHOD=...       (forces normal/express; unset = seasonal logic)
HOLIDAY_EXPRESS_FROM=11-01       (MM-DD; free shipping upgrade starts)
HOLIDAY_EXPRESS_UNTIL=12-22      (MM-DD; free shipping upgrade ends)
LOG_LEVEL=INFO

Do NOT set GELATO_PRODUCT_UID unless you have verified the new value against
the live Gelato catalog. The default in gelato.py and pdf_builder.py is the
real 8x8" softcover UID. The value this file used to recommend
(softcover_book_perfect_binding_a5_portrait) does not exist and would make
every physical order fail with NOT_FOUND — that was the Sprint 8 bug.

The backend refuses to start if SUPABASE_URL, SUPABASE_SECRET_KEY,
OPENAI_API_KEY, STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is missing —
it names the missing variable in the Railway logs rather than failing later
with a confusing library error.

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

Paths below are relative to the repo root. This project has been worked on
from more than one machine, so neither the venv nor backend/.env is in git —
both have to exist locally before the backend will start, and config.py will
name whichever credential is missing.

### Start backend
cd backend
source venv/bin/activate            # macOS/Linux
venv\Scripts\activate               # Windows (PowerShell or cmd)
uvicorn main:app --reload --port 8000

### Start frontend
cd frontend
npm run dev

### Start Stripe webhook listener (separate terminal)
stripe listen --forward-to localhost:8000/webhook
(copy the whsec_... and put in backend/.env as STRIPE_WEBHOOK_SECRET)

### Test the full pipeline locally (no frontend needed)
cd backend
python pipeline.py
Creates a real job for "Ava" and runs it end to end. This spends real OpenAI
credit (~$0.50) and writes a real row to the live jobs table.

### Build a PDF from an existing job
cd backend
python pdf_builder.py <job_id>            # cover + interior print files
python pdf_builder.py <job_id> digital    # the 29-page digital edition
Each prints the public Supabase URL it uploaded to.

### Check which Python/venv is active
which python   (macOS/Linux)  /  where python  (Windows)
-- should point inside storykin/backend/venv

### GitHub SSH (macOS -- the agent clears on reboot)
ssh-add ~/.ssh/id_storykin
ssh -T git@github-storykin  -- should say: Hi storykin767!

### Fix git remote if push fails
macOS reaches GitHub through an SSH host alias, so the remote is rewritten to it:
git remote set-url origin git@github-storykin:storykin767/storykin.git
git push origin main

Do NOT run that anywhere else. github-storykin is defined in the Mac's
~/.ssh/config and nowhere else, so on any other machine it swaps a working
remote for an unresolvable host. Everywhere else the remote is the plain one:
git remote set-url origin git@github.com:storykin767/storykin.git

### SSL certificate fix (if getting CERTIFICATE_VERIFY_FAILED)
Only affects pyenv Python on macOS; see section 18.
export SSL_CERT_FILE=$(python3 -c "import certifi; print(certifi.where())")
export REQUESTS_CA_BUNDLE=$(python3 -c "import certifi; print(certifi.where())")
Then restart uvicorn in same terminal session.
pipeline.py already sets this itself at import time.

---

## 16b. Windows machine notes (verified 21 September 2026)

Section 16 covers both platforms. This is the Windows-only detail that does
not belong there.

Repo root on this machine:
C:\Users\test1\Desktop\Projects\storykin\storykin

### Toolchain present
Git 2.55.0.3, Python 3.14.7 + pip 26.2.1, Node 24.19.0 LTS + npm 11.17.0,
GitHub CLI 2.101.0, VS Code 1.138.0.
VS Code extensions: Python, Pylance, Ruff, ESLint, Prettier, Tailwind.
package.json pins no engines constraint, so Node 24 LTS suits Next 16 / React 19.

### Installed 21 September 2026
- backend\venv           created on 3.14; all 69 pinned packages installed
                         from prebuilt wheels, nothing built from source
- frontend\node_modules  npm install, 521 packages, package-lock.json unchanged

### Still missing -- the app will not run until these exist
- backend\.env, frontend\.env.local
                         gitignored, so they are not in the clone. The backend
                         refuses to start without them and names the missing
                         variable (section 15). Copy them from the Mac, or
                         re-read each value from its own dashboard.
- Stripe CLI (optional)  winget install Stripe.StripeCli
- Docker (optional)      only to verify Dockerfile/port changes -- see
                         "Never change the port the Dockerfile binds"

### Python version
Production is python:3.11-slim; this machine runs 3.14.7. Every pin in
requirements.txt had a cp314 wheel, so the 3.11 fallback was not needed. If a
future pin lacks a 3.14 build, install 3.11 alongside
(winget install Python.Python.3.11) and rebuild the venv with
py -3.11 -m venv venv. Local and production sit on different minor versions
either way -- production remains the authority.

### npm 11 gates install scripts
npm 11 does not run install scripts by default. Three are pending here:
@sentry/cli, sharp, unrs-resolver. sharp does not need its script -- the
win32-x64 binary arrives prebuilt as an optional dependency. @sentry/cli never
downloaded sentry-cli.exe, which is only used to upload source maps during
next build; npm run dev does not touch it. Enable with npm approve-scripts <pkg>.

### If venv\Scripts\activate is blocked by execution policy
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
(or run venv\Scripts\activate.bat from cmd, which needs no policy change)

### GitHub SSH here -- nothing to run
The key has no passphrase, so there is no ssh-add step.
  key:    C:\Users\test1\.ssh\id_ed25519
  remote: git@github.com:storykin767/storykin.git   (plain, no host alias)
  verify: ssh -T git@github.com  -- should say: Hi storykin767!
Commit identity: storykin767 <storykin767@users.noreply.github.com>

### PATH does not reach open terminals
Windows does not push environment changes into running processes, and a
terminal opened inside an app inherits that app's stale copy -- so a new tab
in the same app is still stale. After any install, open a fresh terminal or
refresh the current one:
$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ';' + [Environment]::GetEnvironmentVariable("Path","User")

### PowerShell 5.1 drops empty-string arguments
It silently discards "" before the argument reaches a native program, so
ssh-keygen -N "" yields a key with a literal two-quote passphrase instead of
no passphrase. Put --% ahead of the arguments when an empty one matters.

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

### How to recover an order that failed to fulfil
Fulfilment is automatic. An order only needs attention if its status is
still "paid" long after payment, or is "fulfillment_failed".

1. Find it:
   curl -H "X-Admin-Token: $ADMIN_TOKEN" \
     "https://storykin-production.up.railway.app/admin/orders?status=fulfillment_failed"
   (or filter the orders table in Supabase on status)
2. Read the cause in Railway logs — search the logs for the order id
3. Fix the cause (e.g. missing GELATO_API_KEY, bad shipping address)
4. Retry it:
   curl -X POST -H "X-Admin-Token: $ADMIN_TOKEN" \
     "https://storykin-production.up.railway.app/admin/orders/<order_id>/fulfill"
5. Confirm status flips to printing (physical) or delivered (digital)

Order statuses: paid -> printing / delivered, or fulfillment_failed.

### How to build and send a book by hand (last resort)
1. cd backend && source venv/bin/activate
2. python pdf_builder.py <job_id>  -- prints the public PDF URL
3. Email the URL to the customer, or upload it in the Gelato dashboard

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

### Supabase free tier pauses the project, and that takes production down
NEXT PAUSE: 23 OCTOBER 2026. Paying $25/mo for Pro is what stops it.

This already happened. The project was paused around 11 September 2026 and was
still down on 23 September. What it looks like from outside is the dangerous
part — nothing announces itself:
  - storykinbooks.com serves normally (Vercel is static, unaffected)
  - GET /health returns 200 (it returns a hardcoded dict, touches no database)
  - GET /status/{id} returns 404, because main.py catches every exception and
    returns 404 — a dead database is indistinguishable from a bad job id
  - POST /generate 500s, the frontend redirects to /error-page, and NO job row
    is written — so the failure leaves no trace in the jobs table at all

During the outage every visitor who tried to create a book got an error page,
and the jobs table recorded nothing, which made the database look merely quiet.
Vercel Analytics was the only place the damage was visible.

Diagnosis, in order:
  1. nslookup <project-ref>.supabase.co — a paused/deleted project stops
     resolving entirely (NXDOMAIN). Check against 8.8.8.8 too, to rule out
     local DNS.
  2. If it resolves, curl $SUPABASE_URL/rest/v1/ with the service key.
  3. Log into supabase.com and check whether the project is paused.

If the project is ever recreated rather than resumed it gets a NEW ref, which
must be updated in Railway, Vercel, backend/.env, frontend/.env.local and the
two places this file records it (sections 5 and 15).

### SSL certificate issue on local Mac (pyenv Python 3.9)
pyenv Python 3.9 does not use Mac system certificates.
Symptoms: httpx.ConnectError: CERTIFICATE_VERIFY_FAILED
Fix: export SSL_CERT_FILE=$(python3 -c "import certifi; print(certifi.where())")
Production (Railway Docker python:3.11-slim) does NOT have this issue.

### Gelato print format — validated, but never physically printed
The product UID in the original code (softcover_book_perfect_binding_a5_portrait)
did not exist. Every physical order would have failed with NOT_FOUND. It was
replaced with a real 8x8" softcover photobook UID and validated end to end with
a Gelato draft order, which returned HTTP 200 and a $16.68 contract receipt.

Confirmed accepted: the product UID, pageCount 28, both file types
("cover" and "default"), shipmentMethodUid "normal", and the shipping address
mapped from Stripe's format.

Still unproven: Gelato had not fetched or screened the PDF contents at draft
stage (contentScreeningResults was empty), so deep file validation happens at
production time. Our own checks confirm the interior is exactly 28 pages at
206x206mm and the cover is 408.72x206mm — matching Gelato's own
cover-dimensions response exactly — so the remaining risk is low. No book has
been physically printed yet. Order one proof before promoting the physical
tier hard.

### Character consistency across illustrations
No image model here has memory between generations.
Mitigation: style-anchor prompt + explicit character description every time.
Largely resolved in practice by gpt-image-1 — see section 13.
Future, if it regresses: img2img reference image or fine-tuned model.

### Stripe live mode — RESOLVED, the live webhook is confirmed working
Live mode is approved, active, and as of 26 September 2026 it has been
exercised for real. The Railway STRIPE_WEBHOOK_SECRET matches the live
endpoint: a genuine cs_live_ payment was accepted, the signature verified,
and the order row was written. See section 19c for the full run.

This was the single largest risk in the project and it is now closed with
evidence rather than assumption. What it used to say here: the live webhook
had never fired once, so a mismatched secret would have returned 400 and left
the first real customer charged and unfulfilled, with nothing to reveal the
problem beforehand.

Still true, and still worth guarding: if the webhook endpoint is ever
recreated, or the account is switched, the signing secret changes and must be
updated on Railway. The symptom is a 400 on every delivery and orders that
are paid in Stripe but absent from the orders table.

Note also that the current Stripe sandbox is empty. The four cs_test_ orders
in the orders table came from an older sandbox and cannot be traced in the
dashboard any more.

### Resend domain verification — done
Emails send from hello@storykinbooks.com (override with the FROM_EMAIL env var).
storykinbooks.com was verified in Resend on 23 August 2026, after sitting in a
failed state for five months.

Keep it that way. An unverified domain does not bounce loudly — delivery
silently narrows to storykin767@gmail.com, so digital buyers pay and simply
never hear anything. The DKIM and SPF records live in Namecheap DNS; if those
records are ever edited, re-check Resend.

### Never change the port the Dockerfile binds
The Dockerfile must keep `--port 8000` hardcoded. Railway's HTTP proxy routes
to port 8000 for this service, and it does not follow the app.

Changing the CMD to `${PORT:-8000}` (to "do it properly") made uvicorn bind
Railway's injected PORT instead. The container was perfectly healthy, Railway's
own healthcheck passed, and the deployment showed green — but every public
request returned 502 "Application failed to respond", because the proxy was
still knocking on 8000. It cost a production outage and a full revert.

Related: there is no railway.toml, and adding one back is not an improvement.
The version that existed carried a `startCommand`, which Railway runs without
a shell — `$PORT` reached uvicorn as a literal string and the container died
with "Invalid value for '--port'". Both files were removed in the revert and
Railway has found the Dockerfile by itself ever since. The Dockerfile CMD is
the single source of truth for how the app starts.

Rule: any change to the Dockerfile or Railway config must be run as a real
container first (`docker build` then `docker run -p 8000:8000`) and checked
for which port it actually binds. A local venv cannot catch either failure.

### SSH key clears on Mac restart
Every time the Mac restarts, must run: ssh-add ~/.ssh/id_storykin
Permanent fix attempted but Mac keychain integration with pyenv is unreliable.
Workaround: add to ~/.zshrc: ssh-add ~/.ssh/id_storykin 2>/dev/null

### Background work recovers on restart, but is not yet durable
Generation and fulfilment run as asyncio background tasks, so a Railway
restart still loses whatever is in flight. The app now heals itself on
startup instead of leaving the damage in place:
  - Jobs stuck in pending/generating_* for more than STALE_AFTER_MINUTES are
    marked failed, so the loading screen sends the user to the error page
    with a real reason instead of spinning.
  - Orders still at "paid" after STALE_AFTER_MINUTES, and newer than
    RECOVER_WINDOW_HOURS, have fulfilment restarted automatically.
    The window deliberately excludes old rows: anything older needs a human,
    and POST /admin/orders/{id}/fulfill is the lever for that.

This covers the actual failure mode (a restart) without new infrastructure.
It does NOT make the work durable: a task interrupted mid-run still restarts
from the beginning, and nothing survives if the app never comes back up.
Celery + Redis remains the real fix before significant traffic — Redis is
available on Railway as a managed service — but it adds a worker service and
a second deploy surface, which is not worth it at current volume.

### Backend error monitoring
Set SENTRY_DSN on Railway to send backend exceptions to Sentry. Without it
they exist only in the Railway log buffer, which is not searchable after the
fact. Create a separate Python project in Sentry rather than reusing the
javascript-nextjs DSN. send_default_pii is off: customer emails and shipping
addresses must not leave our own systems.

### There is no test suite
Nothing in this repo has automated tests, and none has ever been committed on
any branch. Every claim about correctness in this file rests on code review
and on manual runs against live services.

That matters most for the two paths that cannot be exercised without spending
money: the live Stripe webhook signature, and Gelato accepting a real print
order. It also means there is no safety net under a refactor of the pipeline
or the PDF geometry — the page-count assertion in build_interior_pdf and the
`INTERIOR_PAGES` import in gelato.py are doing that job instead, at runtime.

If tests get written, the webhook handler is the place to start: it is pure
enough to drive with a signed HMAC payload and a fake Supabase client, and it
is the one endpoint where a silent failure costs a paid order.

### Rate limiting is per-instance and in-memory
/generate allows 5 books per IP per hour. The counters live in process memory,
so they reset on deploy and would not be shared across multiple Railway
instances. Fine for one instance; move to Redis when scaling out.

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

Sprint 7 (August 2026) -- Production hardening
  FULFILMENT (the chain was broken end to end before this)
    PDF was never built outside a manual script -- every physical order would
      have failed at the Gelato step. Now built automatically after payment.
    /order/success page created -- Stripe's success_url was a 404 for every
      paying customer.
    Digital tier now actually delivers: the PDF download link is emailed.
    Webhook made idempotent -- a Stripe retry can no longer create two orders
      or two print jobs for one payment.
    Webhook returns 400 on a bad signature (was 200, so Stripe never retried).
    Fulfilment runs in the background and records fulfillment_failed on error.
    /admin/orders + /admin/orders/{id}/fulfill added to recover failed orders.
  SAFETY
    /generate rate limited per IP (5/hour, 20/day) -- it was open to anyone
      and each call spends ~$0.75 of OpenAI credit.
    Full input validation: age 2-8, enum themes/pronouns/morals, name length.
      Free-text theme used to go straight into the GPT-4o prompt.
    Debug /test-db endpoints hidden in production.
    Backend refuses to start with missing credentials and names what's missing.
    Background tasks held in a strong reference set (were GC-able mid-run).
  CORRECTNESS
    current_page is now actually written, so the loading screen counts real
      illustrations instead of always saying "1 of 10".
    Story validated for exactly 10 non-empty pages before it is saved.
    PDF text shrinks to fit -- long pages used to run off the bottom.
    Loading screen gives up instead of polling forever (4 minutes at the
      time; now 7, since generation got slower — see section 14).
    Preview and create pages handle backend errors instead of hanging.
    Removed the dead POST /generate-story endpoint (raised TypeError).
  DEPLOY
    railway.toml (since removed), .dockerignore, non-root Docker user,
      PYTHONUNBUFFERED.
    All Python dependencies pinned.
    Whole UI unified on the purple brand (create/loading/preview were amber).

Sprint 8 (August 2026) -- The physical book actually exists
  The Gelato product UID in the code was never real. Querying the catalog API
    returned NOT_FOUND: every physical order would have failed at submission,
    independent of the missing-PDF bug fixed in Sprint 7.
  Gelato has no A5 book. The whole PDF pipeline was built to a size the
    printer does not sell. Only three softcover photobook products are
    actually orderable: 140x140mm, 200x200mm and 210x280mm.
  Rebuilt on the real product: 8x8" (200x200mm) square softcover.
    Story grew from 10 to 12 pages so the interior hits Gelato's 28-page
    minimum with no blank filler:
      title, colophon, dedication, 12 illustration+text spreads, "The End".
    Cover and inner block are now two separate files, as Gelato requires.
    Spine width is fetched per book from the cover-dimensions endpoint.
    Digital buyers get a 29-page single file with the cover on the front,
      instead of a coverless interior.
    Typography rescaled for an 8-inch page (body text 16pt -> 22pt).
  Validated with a real Gelato draft order: HTTP 200, product recognised,
    both file types accepted, $16.68 contract receipt. Draft then deleted.
  Unit economics corrected from measured data, not estimates:
    print+ship is $16.68, not $13.50, so net margin is $20.89 (52%),
    not $24.19 (61%). (Corrected again since: with gpt-image-1 costing less
    than dall-e-3 did, the real figure is ~$21.11 — see section 2.)

Sprint 9 (23 August - 10 September 2026) -- Selling it
  THE SITE HAD TO BE HONEST FIRST
    Two claims the product could not keep were removed, and a real refund
      policy page written to replace the hand-waving.
    "60 seconds" replaced everywhere with two to three minutes, which is what
      generation actually takes at 5 images/minute.
  FOUND, NOT JUST LIVE
    10 SEO pages built from two content files: /books/[theme] (6) and
      /gifts/[occasion] (4), with FAQ structured data and automatic sitemap
      entries. Adding a page is now a content edit, not a code change.
    /about page written to be quotable by AI search.
    Open Graph share image added — links had been previewing as blank.
    Pinterest domain claimed via meta tag in layout.tsx.
  THE CHRISTMAS RUN-UP
    /gifts/christmas built out properly ahead of the season, with ordering
      deadlines taken from real Gelato transit times rather than guesses.
    Shipping upgrades itself to express between 1 November and 22 December,
      absorbed into margin, because standard post misses Christmas. It
      reverts on its own in January — no diary entry to forget.
  MOBILE
    The create form could not be completed on a phone. Fixed.
    Preview page overflowed on phones; hero pushed the books below the fold.
    Homepage now shows the actual product instead of describing it.
  RELIABILITY
    Supabase uploads and the two final writes are retried. A stale keep-alive
      socket surfacing as "Server disconnected" lost a real customer's book
      on 6 September 2026, after all the OpenAI credit had been spent.
  MARKETING, WRITTEN DOWN TO BE EXECUTED
    marketing/ added: Etsy listing pack (digital-first), Facebook posts mapped
      to named groups, Pinterest playbook with pin assets, and blogger and
      gift-guide outreach.
    docs/services.md: every third-party service, what breaks without it,
      what it costs.
    New logo mark applied sitewide, with a real favicon.

---

## 19b. Deploy Checklist (run through this before taking real orders)

1. Set the new Railway variables:
     GELATO_API_KEY   -- physical orders fail without it
     ADMIN_TOKEN      -- long random string; enables the recovery endpoints
     FRONTEND_URL     -- must be https://storykinbooks.com
     ENVIRONMENT      -- must be exactly "production" to hide /test-db
2. Confirm STRIPE_WEBHOOK_SECRET is the LIVE endpoint's secret, not the test
   or CLI one. A mismatch now returns 400 and no order is ever fulfilled.
3. Run backend/migrations/001_order_idempotency.sql in the Supabase SQL editor
   (adds the unique index that makes duplicate orders impossible). Already
   applied — it survived the August revert, which left it in place deliberately.
4. Confirm storykinbooks.com still shows verified in Resend. Verified on
   23 August 2026; re-check if the Namecheap DNS records were touched since.
5. Deploy backend and frontend, then check:
     GET /health returns ok
     GET /test-db returns 404 (proves ENVIRONMENT=production)
6. Place one real end-to-end order of each tier:
     digital  -- DONE 26 September 2026. Email arrived, PDF opened, 29 pages
                 at 206mm. Details in section 19c.
     physical -- STILL OUTSTANDING. Confirm the order reaches the Gelato
                 dashboard and that gelato_order_id lands on the order row.
7. Watch Railway logs during both. Every step logs with the order id.

---

## 19c. Current State (as of 24 September 2026)

Written down because it is easy to mistake a deliberate decision for an
oversight when picking this up later.

### Proven end to end, with real data, in production
- Book generation: 12 pages, 12 illustrations, ~160 seconds through the live
  site. Character stays consistent across pages with gpt-image-1.
  Re-verified 24 September 2026 after the Supabase outage, job
  47805078-8c1d-4d59-a8da-152c969e5e92: POST /generate 200, complete in
  2m27s, 12/12 illustrations, live progress 10->30->...->100 with
  current_page reaching 12, /book/{id} returning 12 pages each with a
  working image URL, and the preview page rendering on mobile. Hair and
  eye colour both honoured. THIS IS A TEST ROW in the production jobs table.
- Digital fulfilment: PDF built, uploaded, Resend email received in an inbox.
  The whole chain in fulfillment.py has been exercised for real.
- THE DIGITAL TIER IS PROVEN WITH REAL MONEY (26 September 2026). A live
  $9.99 self-purchase, order 268e7988-af3e-4096-bc90-f552f83bb2fd against
  job 2c4f81c8-b48a-479b-9220-ec3b494be3e6:
    cs_live_ session accepted, webhook signature verified, order row written
    paid -> delivered in 42 seconds
    PDF built and uploaded (storykin_book_1790385548.pdf, 5.49MB)
    jobs.image_urls["pdf"] recorded correctly
    Resend email arrived, download link worked, file opened
    29 pages, 583.937pt square = 206mm exactly (200mm trim + 3mm bleed)
  The founder reviewed the delivered PDF and is happy with it, including the
  bleed margin a digital buyer sees. That question is settled — do not
  re-open it without a new reason.
- The failure mode that actually bites is the network, not the AI: a dropped
  Supabase upload lost a finished book on 6 September 2026. Uploads and the
  final writes are retried since.
- Print files: a real cover and interior from a generated book were accepted
  by a Gelato draft order. Contract receipt $16.68 ($9.69 + $6.99 US shipping).

### Parked deliberately, not forgotten
- DONE, 26 September 2026: the live digital order. See above. Note the
  handler still has no automated test coverage — it is proven by one real
  transaction, not by tests.
- ONE PHYSICAL PROOF ($39.99) — now the only major unknown left, and the
  highest-value open item. No book has ever been physically printed and
  gelato_order_id has never been populated on any order. It is also the only
  way to answer the print-quality question below.
  The risk is narrower than it was: the Stripe and webhook half of this path
  was proven by the digital order, so a physical order now tests Gelato
  alone — whether it accepts the real cover and interior files, and whether
  what arrives is good enough to sell for $39.99.
  Worth doing before November: Christmas is the 6x season, the Christmas
  page and the automatic shipping upgrade are already built, and you cannot
  market a physical keepsake you have never held.

### Known open question: print resolution
Illustrations are 1024x1024, which is about 130 DPI on an 8 inch page, against
the 300 DPI in the spec above. gpt-image-1 maxes at 1024 for square images.
Options are upscaling (meets the number, adds no detail), a non-square format,
or accepting it. Watercolour is forgiving of low resolution in a way line art
is not. DECIDE THIS WHEN THE PHYSICAL PROOF ARRIVES, not from theory.

### Throughput ceiling — raise before any marketing
OVERDUE. The plan was to raise the usage tier on 1 SEPTEMBER 2026 and that
date has passed. Check the current tier at
https://platform.openai.com/account/rate-limits before doing anything that
drives traffic — the outreach and Etsy work in marketing/ is exactly that.

The OpenAI organisation is capped at 5 images/minute, so roughly 25 books/hour
and ~2.7 minutes per book. Tiers advance on cumulative paid spend, not on a
support request — pre-buying credit under Billing counts toward the threshold.
At ~$0.50 a book, $50 of credit is 100 books and also advances a tier.

AFTER raising the tier, increase IMAGES_PER_MINUTE in the Railway variables to
match. It is already an env var, so this is config, not a deploy. Raising the
tier alone changes nothing — the limiter keeps pacing at 5/min until that
variable moves.

### Deferred with reasoning
- Celery + Redis for durable background work. The startup recovery in main.py
  covers the failure that actually happens (a Railway restart). Celery adds a
  worker service and a second deploy surface, which is not worth it at zero
  orders. Revisit before significant traffic.
- Redis-backed rate limiting. Needs Redis, so it follows Celery. With one
  replica the only symptom is counters resetting on deploy.

---

## 20. Roadmap (post-launch)

### Month 1 (after first 10 orders)
  DONE: Gelato API connected for automatic print fulfilment (Sprint 7)
  DONE: Stripe switched to live mode
  DONE: $9.99 digital PDF delivered by email after payment (Sprint 7)
  DONE: storykinbooks.com custom domain connected
  DONE: storykinbooks.com verified in Resend (23 August 2026)
  DONE: Refund policy page (/refund-policy)
  DONE: 10 SEO pages for themes and occasions
  DONE: one real digital order, chain confirmed (26 September 2026)
  Place one real PHYSICAL order to confirm the print chain
    -- now the single most valuable outstanding item; see section 19c
  Collect first UGC (offer 50% refund for unboxing video)

### Month 2
  User accounts with Supabase Auth
  Order history page for returning customers
  Reviews + testimonials section on landing page
  Shareable preview links (viral loop)
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

### How this founder likes to work
On multi-step checks that span several tools — pre-deploy verification,
dashboard configuration — go ONE STEP AT A TIME and wait for the result before
giving the next step. This was asked for explicitly, and it earns its keep:
working this way is what caught the Stripe webhook sitting in a sandbox rather
than live mode, and the Resend domain having been in a failed state for five
months. Both would have been skimmed past in a batched checklist.

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

## 23. Marketing History

### Current Status (as of September 2026)
- Live at storykinbooks.com
- 0 orders from actual customers. One live $9.99 digital order exists, placed
  by the founder on 26 September 2026 to validate the payment and fulfilment
  chain — real money, but not demand. Do not count it as traction.
- Stripe live mode approved, active, and proven end to end (section 19c)
- No digital marketing spend yet
- 10 purpose-built SEO pages shipped (6 themes, 4 occasions). Search Console
  shows them ranking for real buying queries but too low to yield clicks —
  846 impressions on /gifts/christmas at around position 36. The bottleneck
  is backlinks, not content.
- Pinterest domain claimed 23 August 2026 (meta tag in layout.tsx)

### Measured traffic — Vercel Analytics, 30 days to 24 September 2026
45 visitors, 123 page views, 62% bounce. Up 13% on visitors and 89% on page
views against the previous 30 days: demand is growing slowly, not dying.

The funnel, by visitors:
  /                      36
  /create                16      <- two thirds of arrivals open the form
  /loading                5      <- only a third of those submit it
  /preview/{id}           3
  /error-page             6
  /gifts/christmas        3      <- the SEO pages have started to register
  /about                  1

The 16 -> 5 drop is the largest leak in the product, and it is worth more
attention than the checkout step. The five /loading hits match the five job
rows in the same window exactly, so the two sources agree.

Referrers: facebook.com 5, lm.facebook.com 5, google.com 2, l.facebook.com 2,
m.facebook.com 2, chatgpt.com 1, checkout.stripe.com 1. Facebook is carrying
this almost single-handedly — 14 of 45 visitors. ChatGPT sent someone, which
is the /about page doing its job.

71% United States. 69% MOBILE (Android 40%, iOS 29%). Design and test for a
phone first; the Sprint 9 mobile work was well judged.

That checkout.stripe.com referrer is an abandoned checkout, from the book
generated 28 August (job c820210e). Someone read the whole book, came back to
the preview three times, reached the card form and stopped. Closest this
product has come to revenue.

Caveat on this data: Vercel Hobby caps analytics history at 30 days, so there
is no way to compare against the June peak. The 3/12/24-month ranges need Pro.

### What the jobs table cannot tell you
Books generated is NOT traffic — it only counts people who got past a working
form. In the week to 24 September the jobs table showed almost nothing, which
read like a demand collapse; Analytics showed real visitors arriving and 100%
of them landing on /error-page because Supabase was paused. Always check both.

The channel playbooks below are the history. The live, current versions —
written to be executed rather than remembered — are in `marketing/`:
etsy.md, facebook.md, pinterest.md and outreach.md. Work from those.

Most time-sensitive item on the whole list: Christmas gift guides are
commissioned in September and October. See marketing/outreach.md.

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
1. Blogger and gift-guide outreach — marketing/outreach.md. First, because
   Christmas guides are written in September and October, and because links
   are the one thing that moves the SEO pages off position 36.
2. Etsy listing, digital only to start — marketing/etsy.md. Borrows an
   existing buying audience instead of building one, and earns the reviews a
   physical listing would need anyway.
3. Pinterest boards and the five pins — marketing/pinterest.md. Slow to start,
   but pins keep surfacing for years.
4. Facebook groups — marketing/facebook.md. Check each group's self-promotion
   rules first; posting into a group that bans it costs the group.
5. Build Reddit karma to 50+, then the r/SideProject and r/Parenting posts.
6. AlternativeTo listing (alternative to Wonderbly).
7. Consider paid ads ONLY after first 10 organic orders.

Blocked on product, not marketing: the physical tier should not be pushed
hard until one proof copy has been printed and seen. See section 19c.

### Key Metrics to Track Weekly
- Supabase jobs table: books generated (filter by date)
- Stripe dashboard: live payments
- Vercel Analytics: unique visitors
- Google Search Console: impressions and clicks
- Facebook: post reach and comments
