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

log.info("Storykin backend starting in %s mode", ENVIRONMENT)
