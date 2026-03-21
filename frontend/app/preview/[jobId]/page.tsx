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

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:8000/book/${jobId}`);
        const data = await res.json();
        setPages(data.pages);
        setChildName(data.child_name);
        setTitle(data.title);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch book:', err);
      }
    };
    fetchBook();
  }, [jobId]);

    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const handleCheckout = async (tier: string) => {
      setCheckoutLoading(true);
      try {
        const res = await fetch('http://localhost:8000/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_id: jobId, tier }),
        });
        const data = await res.json();
        window.location.href = data.checkout_url;
      } catch (err) {
        alert('Something went wrong. Please try again.');
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
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-sm text-amber-600 font-medium mb-1">
            {childName}'s personalised book
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
              <p className="text-white text-opacity-40 text-4xl font-bold rotate-[-30deg] select-none"
                 style={{ opacity: 0.15 }}>
                STORYKIN PREVIEW
              </p>
            </div>
            {/* Page number badge */}
            <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-3 py-1">
              <p className="text-xs font-medium text-gray-600">
                {page.page_number} / {pages.length}
              </p>
            </div>
          </div>

          {/* Story text */}
          <div className="p-6 bg-amber-50">
            <p className="text-gray-800 text-lg text-center leading-relaxed">
              {page.page_text}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={isFirst}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            Previous
          </button>

          {/* Page dots */}
          <div className="flex gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage ? 'bg-amber-400 w-4' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={isLast}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            Next
          </button>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Love {childName}'s book?
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Print it as a beautiful softcover book delivered to your door
          </p>
          <button
            onClick={() => handleCheckout('physical')}
            disabled={checkoutLoading}
            className="w-full py-4 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 text-white font-bold text-lg rounded-xl transition-all mb-2"
          >
            {checkoutLoading ? 'Redirecting...' : 'Print this book — $39.99'}
          </button>
          <button
            onClick={() => handleCheckout('digital')}
            disabled={checkoutLoading}
            className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-all"
          >
            Download digital PDF — $9.99
          </button>
        </div>

      </div>
    </main>
  );
}