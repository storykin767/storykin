// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://bd8a1f741e501f84e7cbf1259217d007@o4511163852062720.ingest.us.sentry.io/4511163859992576",

  // Sample 10% of transactions in production — at 100% a traffic spike
  // burns the Sentry quota and you lose error visibility when you need it.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,

  // Off by default: this would send visitor IP addresses and request
  // headers to Sentry. We ship to the EU/UK, where IPs are personal data,
  // and we promise buyers we don't hold their child's details.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
});
