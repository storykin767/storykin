# Services reference

Every third-party service Storykin depends on, what it actually does, what
breaks without it, and what it costs. Written 24 August 2026.

---

## Follow one book through the system

1. **Vercel** serves storykinbooks.com. Someone fills in the form on `/create`.
2. The browser calls **Railway**, which runs the Python backend. It writes a
   job row to **Supabase** and starts work in the background.
3. **OpenAI** writes the story (GPT-4o), then paints 12 illustrations
   (gpt-image-1).
4. Each illustration is uploaded to **Supabase Storage**; the page text goes
   into the **Supabase** database.
5. The customer reads the preview — a Vercel page, pulling from Railway,
   pulling from Supabase.
6. They click buy. **Railway** creates a **Stripe** checkout session and Stripe
   takes the card.
7. Stripe calls Railway's `/webhook`. Railway saves the order to **Supabase**
   and sends a confirmation through **Resend**.
8. In the background Railway builds the PDF, uploads it to **Supabase
   Storage**, then either submits it to **Gelato** to print and ship, or emails
   the download link through **Resend**.
9. Any exception along the way is captured by **Sentry**.

---

## What each service does

### Vercel — the website
Hosts the Next.js frontend at storykinbooks.com: landing page, `/create`,
`/about`, the theme and gift pages, the preview and the post-payment page.
Rebuilds automatically on every push to `main`.
**Without it:** the site is offline.
**Dashboard:** vercel.com, account storykin767, project `storykin`.

### Railway — the backend
Runs the Python FastAPI service in a Docker container at
storykin-production.up.railway.app. Everything difficult happens here: story
and image generation, PDF building, the Stripe webhook, Gelato submission,
Resend delivery, and the admin recovery endpoints. Auto-deploys from `main`.
**Without it:** no new books and no fulfilment. The site still loads, but
nothing works.
**Dashboard:** railway.app, project `surprising-playfulness`.
**Careful:** never change the port the Dockerfile binds — see CLAUDE.md.

### Supabase — database and file storage
Two jobs in one service.
- **Database (PostgreSQL):** the `jobs`, `orders` and `story_pages` tables.
- **Storage:** the `storykin-images` bucket, holding every illustration and
  every generated PDF. It is public, which is what allows Gelato to fetch the
  print files and customers to open their download link.

**Without it:** everything stops. This is the single point of failure.
**Dashboard:** supabase.com, project `jweriwhordrjpffmmrcp`.

### OpenAI — the writing and the illustrations
GPT-4o writes each story. gpt-image-1 paints the 12 illustrations at medium
quality. Both are called from Railway.
**Without it:** no new books can be created.
**Note:** the organisation is capped at 5 images/minute, which caps throughput
at roughly 25 books/hour. Raising the usage tier lifts it.

### Stripe — payments
Hosts the checkout page, takes the card, and calls the backend webhook when a
payment succeeds. Live mode, account FBF GROUP LLC.
**Without it:** no revenue.
**Careful:** the webhook signing secret in Railway must match the *live*
endpoint. A sandbox secret means every paid order silently goes unfulfilled.

### Gelato — printing and shipping
Print-on-demand for the physical book. Receives two PDFs (cover and interior)
by URL, prints an 8x8" softcover and ships it. Presses in 32 countries, so most
orders ship from near the customer.
**Without it:** physical orders fail. Digital is unaffected.
**Cost:** $16.68 per book to the US ($9.69 print + $6.99 shipping).

### Resend — transactional email
Sends the order confirmation and, for digital orders, the email containing the
download link. Sends from hello@storykinbooks.com, a domain verified on
23 August 2026.
**Without it:** customers pay and hear nothing.

### Sentry — error monitoring
Catches exceptions in the frontend (project `javascript-nextjs`) and the
backend (via `SENTRY_DSN` on Railway). Releases are tagged with the git commit,
so an error can be traced to a deploy.
**Without it:** you are blind to bugs. Backend errors would live only in
Railway's rolling log buffer, which is not searchable after it scrolls.

### GitHub — the code, and the deploy trigger
Repository `storykin767/storykin`. Pushing to `main` deploys **both** Vercel
and Railway simultaneously.
**Without it:** you cannot deploy.

### Namecheap — domain and DNS
Owns storykinbooks.com and holds the DNS records, including the ones that make
Resend email deliverable (DKIM and SPF) and the Google Search Console
verification.
**Without it:** the domain stops resolving and email stops being delivered.

---

## Costs

**Fixed, per month**

| Service | Cost |
|---|---|
| Railway | ~$5 |
| Vercel | ~$20 (Pro) |
| Supabase, Sentry, Resend | free tier, nowhere near the limits |

**Per book generated: ~$0.50** (OpenAI). Charged whether or not anyone buys,
which is why `/generate` is rate-limited per IP.

**Per book sold**

| | Physical $39.99 | Digital $9.99 |
|---|---|---|
| Gelato | $16.68 | — |
| Stripe | ~$1.46 | ~$0.59 |
| OpenAI + storage | ~$0.59 | ~$0.59 |
| **Net** | **~$21** | **~$8.80** |

---

## Where the real risk sits

**Supabase is the single point of failure.** It holds both the data and the
files, and every other service reads from it. There is currently no backup
strategy. Worth addressing before there are real customer orders in there.

**Railway carries the complexity.** The frontend is comparatively simple; the
backend handles the money, the AI, the PDFs and the printing. It is also the
service that broke twice on 23 August 2026, both times from deploy
configuration rather than application code.

**Credentials live in two places only:** the Railway and Vercel dashboards, and
`backend/.env` on the founder's machine. Most can be reissued from their own
dashboard if lost. The awkward ones are `STRIPE_WEBHOOK_SECRET` (re-reveal on
the Stripe webhook endpoint) and `SUPABASE_SECRET_KEY` (Supabase settings).
