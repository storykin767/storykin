-- Optional but recommended before taking live orders.
-- Stripe retries webhook deliveries; this makes a duplicate order
-- impossible at the database level, not just in application code.
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_id_key
    ON orders (stripe_session_id);

-- Speeds up the duplicate check and the ops lookups in the runbook.
CREATE INDEX IF NOT EXISTS orders_job_id_idx ON orders (job_id);
CREATE INDEX IF NOT EXISTS story_pages_job_id_idx ON story_pages (job_id);
CREATE INDEX IF NOT EXISTS jobs_status_created_at_idx ON jobs (status, created_at DESC);
