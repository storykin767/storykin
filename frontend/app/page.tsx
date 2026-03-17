'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState<string>('checking...');

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('error — backend not reachable'));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Storykin
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Personalised storybooks for every child
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50">
          <span className={`w-2 h-2 rounded-full ${status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}/>
          <span className="text-sm text-gray-600">
            Backend: <span className="font-medium">{status}</span>
          </span>
        </div>
      </div>
    </main>
  );
}
