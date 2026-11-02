'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect, useState } from 'react';

// If anything crashes the loading screen, the book is usually still being
// made, or already finished, on the server. On 31 October 2026 a visitor
// whose browser translated the page hit a crash here four times and never
// saw any of their four finished books. This page makes sure they can.
export default function LoadingError({ error }: { error: Error & { digest?: string } }) {
  // Read the id straight from the URL: the React tree that held it is gone.
  // Error boundaries only render in the browser, but guard for the server.
  const [jobId] = useState<string | null>(() =>
    typeof window === 'undefined'
      ? null
      : new URLSearchParams(window.location.search).get('jobId')
  );

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #ffffff 100%)' }}>
      <div className="max-w-md mx-auto">
        <div className="text-8xl mb-6">📖</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Your book is still being made
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          This screen stopped updating, but your book was not lost. It takes
          two to three minutes in all, so if you have been waiting a while it
          is probably ready now.
        </p>
        {/* Plain links, not next/link: a full page load starts from a clean
            page rather than the one that just broke */}
        {jobId && (
          <a
            href={`/preview/${jobId}`}
            className="inline-block w-full py-4 text-white font-bold text-lg rounded-2xl transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
          >
            See your book
          </a>
        )}
        {jobId && (
          <a
            href={`/loading?jobId=${jobId}`}
            className="inline-block w-full py-3 mt-3 text-gray-500 text-sm hover:text-gray-700 transition-all"
          >
            Not ready yet? Keep waiting
          </a>
        )}
        {!jobId && (
          <a
            href="/create"
            className="inline-block w-full py-4 text-white font-bold text-lg rounded-2xl transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
          >
            Start again
          </a>
        )}
      </div>
    </main>
  );
}
