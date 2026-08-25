'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Page {
  page_number: number;
  page_text: string;
  image_url: string;
}

export default function PreviewPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [childName, setChildName] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${jobId}`);
        if (!res.ok) throw new Error(`Book unavailable (${res.status})`);
        const data = await res.json();
        if (!data.pages?.length) throw new Error('Book has no pages');
        setPages(data.pages);
        setChildName(data.child_name);
        setTitle(data.title);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch book:', err);
        router.push('/error-page');
      }
    };
    fetchBook();
  }, [jobId, router]);

  const handleCheckout = async (tier: string) => {
    setCheckoutLoading(true);
    setCheckoutError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, tier }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkout_url) {
        throw new Error(data.detail || 'Checkout unavailable');
      }
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error('Checkout failed:', err);
      setCheckoutError(
        "We couldn't open the payment page. Please try again in a moment."
      );
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your book...</p>
      </main>
    );
  }

  const isFirst = currentPage === 0;
  const isLast = currentPage === pages.length - 1;
  const page = pages[currentPage];

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-sm text-purple-600 font-medium mb-1">
            {childName}&apos;s personalised book
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Book page */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-6">

          {/* Illustration */}
          <div className="relative">
            <img
              src={page.image_url}
              alt={`Page ${page.page_number}`}
              className="w-full object-cover"
              style={{ height: '320px' }}
            />
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-white text-4xl font-bold rotate-[-30deg] select-none"
                 style={{ opacity: 0.15 }}>
                STORYKIN PREVIEW
              </p>
            </div>
            {/* Page number badge */}
            <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1">
              <p className="text-xs font-medium text-gray-600">
                {page.page_number} / {pages.length}
              </p>
            </div>
          </div>

          {/* Story text */}
          <div className="p-6 bg-purple-50">
            <p className="text-gray-800 text-lg text-center leading-relaxed">
              {page.page_text}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 mb-8">
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={isFirst}
            className="px-4 sm:px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium disabled:opacity-30 hover:bg-gray-50 transition-all flex-shrink-0"
          >
            Previous
          </button>

          {/* Page dots */}
          <div className="flex flex-wrap gap-1.5 justify-center min-w-0">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage ? 'bg-purple-600 w-4' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={isLast}
            className="px-4 sm:px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium disabled:opacity-30 hover:bg-gray-50 transition-all flex-shrink-0"
          >
            Next
          </button>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Love {childName}&apos;s book?
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Print it as a beautiful softcover book delivered to your door
          </p>
          <button
            onClick={() => handleCheckout('physical')}
            disabled={checkoutLoading}
            className="w-full py-4 text-white font-bold text-lg rounded-xl transition-all mb-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
          >
            {checkoutLoading ? 'Redirecting...' : 'Print this book — $39.99'}
          </button>
          <button
            onClick={() => handleCheckout('digital')}
            disabled={checkoutLoading}
            className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-all disabled:opacity-50"
          >
            Download digital PDF — $9.99
          </button>
          {checkoutError && (
            <p className="text-sm text-red-600 mt-3">{checkoutError}</p>
          )}
        </div>

      </div>
    </main>
  );
}
