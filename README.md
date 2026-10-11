# Storykin

Personalised children's storybooks. Every book is written and illustrated from
scratch for one child, then printed and shipped as an 8x8" softcover — or
delivered as a PDF.

Not a template with a name dropped into it. The child's name, age, appearance,
chosen companion and the lesson in the story all go into the generation, so two
children get two genuinely different books.

**Live:** [storykinbooks.com](https://storykinbooks.com)

---

## Picking this project up

**Read [`CLAUDE.md`](CLAUDE.md) before changing anything.** It is the project's
memory across sessions — architecture decisions and the alternatives rejected,
every bug hit and how it was fixed, the operations runbook, the full sprint
history, and the marketing state.

Start at **section 0**, which is a dated state-of-play: what is true right now,
what is urgent, and what is quietly broken. The rest of the file is reference.

This README is the front door. `CLAUDE.md` is the actual documentation.

## How a book gets made

1. Someone fills in the form on `/create` — name, age, pronouns, hair, eyes,
   skin tone, a theme, an optional sidekick and a moral
2. GPT-4o writes a 12-page story, returning structured JSON validated by
   Pydantic. Each page carries its own image prompt
3. `gpt-image-1` paints 12 illustrations, paced to stay inside the OpenAI
   rate limit, each uploaded to Supabase Storage as it finishes
4. The buyer reads the **whole finished book** before paying anything
5. Stripe Checkout takes the payment
6. Only then is the print-ready PDF built — ReportLab, 206mm square with 3mm
   bleed — and either submitted to Gelato for printing or emailed as a PDF

Preview-before-pay is the core mechanic. It's also why the PDF is built after
payment rather than during generation: most generated books are never bought.

## Architecture

Two services, each in the language that suits the job.

**Frontend** — Next.js 16, React 19, Tailwind v4, on Vercel.
Marketing site, intake form, live progress screen, preview.

**Backend** — Python 3.11, FastAPI, in Docker on Railway.
Story and image generation, PDF building, the Stripe webhook, Gelato
submission, transactional email, and the admin recovery endpoints.

Python earns the backend for two reasons: `asyncio` handles parallel image
generation cleanly, and ReportLab plus Pillow are the standard for
print-quality PDFs with real bleed and DPI handling.

**Supabase** holds everything else — Postgres for jobs, orders and story pages,
Storage for every illustration and generated PDF. It is deliberately the only
stateful dependency, and correspondingly the single point of failure.

## Layout

```
backend/      FastAPI service — pipeline, PDF builder, Stripe, Gelato
frontend/     Next.js app — site, intake form, preview
docs/         services.md: every third-party dependency and what breaks without it
marketing/    Channel playbooks written to be executed, not admired
CLAUDE.md     The full briefing. Start at section 0.
```

## Running it locally

You need a `backend/.env` and a `frontend/.env.local`. Neither is in git. The
backend refuses to start without its credentials and names whichever one is
missing rather than failing later with a confusing library error — the full
list is in `CLAUDE.md` section 15.

```bash
# backend
cd backend
python -m venv venv && source venv/bin/activate   # venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

```bash
# frontend
cd frontend
npm install
npm run dev
```

There is no staging environment. Running the pipeline locally spends real
OpenAI credit and writes to the live database.

## Worth knowing before you change anything

**There are no tests.** Nothing here has automated coverage. Correctness rests
on code review and manual runs against live services.

**The Dockerfile's port is load-bearing.** It must keep `--port 8000`
hardcoded. Making it configurable produced a container that passed every
healthcheck while returning 502 to every real request. `CLAUDE.md` section 18
has the story; read it before touching deploy config.

**Supabase's free tier pauses the project**, which takes production down in a
way that looks like nothing is wrong — the site stays up, `/health` keeps
returning 200, and failures leave no trace in the database. Section 18 has the
diagnosis steps.

## Status

Live and able to take orders. The digital tier is proven end to end with a real
payment. The printed tier is validated against Gelato's API but **no book has
ever been physically printed**. Zero orders from real customers so far.

---

Built by Fahad, with Claude as co-developer.

Not open source — published for reference, all rights reserved.
