"""Configuration and logging, imported before anything that needs credentials.

Every other module builds its Supabase and OpenAI clients at import time, so
this has to run first — otherwise a missing variable surfaces as a confusing
library error instead of saying which variable is missing.
"""
import logging
import os

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)-7s [%(name)s] %(message)s",
)
log = logging.getLogger("storykin.config")

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT == "production"

# Without these the service cannot take or fulfil a single order
REQUIRED_ENV = [
    "SUPABASE_URL", "SUPABASE_SECRET_KEY", "OPENAI_API_KEY",
    "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET",
]
# Without these individual features degrade, but the service still runs
OPTIONAL_ENV = ["RESEND_API_KEY", "GELATO_API_KEY", "FRONTEND_URL", "ADMIN_TOKEN"]

missing = [name for name in REQUIRED_ENV if not os.getenv(name)]
if missing:
    raise RuntimeError(
        "Missing required environment variables: " + ", ".join(missing)
        + ". Set them in Railway (or backend/.env locally) and redeploy."
    )

for name in OPTIONAL_ENV:
    if not os.getenv(name):
        log.warning("%s is not set — the features that use it will fail", name)

# ── Error monitoring ──────────────────────────────────────────
# Optional: without SENTRY_DSN the backend simply logs to Railway as before.
# The frontend has had Sentry since launch; the backend never did, so every
# Python error has only ever existed in the Railway log buffer.
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    try:
        import sentry_sdk

        sentry_sdk.init(
            dsn=SENTRY_DSN,
            environment=ENVIRONMENT,
            # Sample lightly: a traffic spike should not burn the quota
            traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
            # Never ship customer emails, addresses or IPs to a third party
            send_default_pii=False,
        )
        log.info("Sentry error monitoring enabled")
    except Exception as e:
        log.warning("Could not initialise Sentry: %s", e)
else:
    log.info("SENTRY_DSN not set — backend errors go to Railway logs only")

log.info("Storykin backend starting in %s mode", ENVIRONMENT)
