'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const STEPS = [
  {
    emoji: '📧',
    title: 'Check your email',
    desc: 'Your confirmation is on its way — it has your order reference in it.',
  },
  {
    emoji: '🖨️',
    title: 'We prepare the book',
    desc: 'Every page is laid out for print and sent to our printing partner.',
  },
  {
    emoji: '📦',
    title: 'It arrives',
    desc: 'Printed books ship within 2-3 business days. Digital PDFs arrive by email in minutes.',
  },
];

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #ffffff 100%)' }}
    >
      <div className="max-w-md mx-auto w-full text-center">
        <div className="text-8xl mb-6">🎉</div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank you — your order is confirmed
        </h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          The book is being made right now. You&apos;ll get an email at every
          step, so there&apos;s nothing else you need to do.
        </p>

        <div className="bg-white rounded-2xl border border-purple-100 p-6 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-4">What happens next</h2>
          <div className="space-y-4">
            {STEPS.map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <span className="text-2xl leading-none">{step.emoji}</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{step.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {sessionId && (
          <p className="text-xs text-gray-400 mb-8 break-all">
            Order reference: {sessionId}
          </p>
        )}

        <Link
          href="/create"
          className="inline-block w-full py-4 text-white font-bold text-lg rounded-2xl transition-all"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
        >
          Create another book
        </Link>
        <Link
          href="/"
          className="inline-block w-full py-3 mt-3 text-gray-400 text-sm hover:text-gray-600 transition-all"
        >
          Back to home
        </Link>

        <p className="text-xs text-gray-400 mt-8">
          Questions? Email{' '}
          <a href="mailto:hello@storykinbooks.com" className="underline">
            hello@storykinbooks.com
          </a>
        </p>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading…</p>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
