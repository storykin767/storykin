'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const STAGES = [
  { progress: 10, message: "Opening the storybook..." },
  { progress: 20, message: "Finding the perfect words..." },
  { progress: 30, message: "Writing the story..." },
  { progress: 40, message: "Mixing the paint colours..." },
  { progress: 50, message: "Painting illustration 1..." },
  { progress: 60, message: "Painting illustration 5..." },
  { progress: 70, message: "Painting illustration 8..." },
  { progress: 80, message: "Adding the final details..." },
  { progress: 90, message: "Binding the pages together..." },
  { progress: 100, message: "Your book is ready!" },
];

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Opening the storybook...");
  const [dots, setDots] = useState('');

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Poll backend for real progress
  useEffect(() => {
    if (!jobId) return;

    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/${jobId}`);
        const data = await res.json();

        setProgress(data.progress || 0);

        // Update message based on real status
        if (data.status === 'generating_story') {
          setMessage("Writing the story...");
        } else if (data.status === 'generating_images') {
          const page = data.current_page || 1;
          setMessage(`Painting illustration ${page} of 10...`);
        } else if (data.status === 'complete') {
          setMessage("Your book is ready!");
          setProgress(100);
          clearInterval(poll);
          // Redirect to preview after short delay
          setTimeout(() => {
            router.push(`/preview/${jobId}`);
          }, 1500);
            } else if (data.status === 'failed') {
              clearInterval(poll);
              router.push('/error-page');
            }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [jobId, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Animated book icon */}
        <div className="text-8xl mb-8 animate-bounce">📖</div>

        {/* Dynamic message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {message}{dots}
        </h2>
        <p className="text-gray-500 mb-10">
          This takes about 60 seconds — we're making something special
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
          <div
            className="bg-amber-400 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percentage */}
        <p className="text-sm text-gray-400">{progress}% complete</p>

        {/* Fun facts while waiting */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-100">
          <p className="text-sm text-gray-500">
            Did you know? Every Storykin book is written and illustrated
            just for your child — no two books are ever the same.
          </p>
        </div>

      </div>
    </main>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingContent />
    </Suspense>
  );
}