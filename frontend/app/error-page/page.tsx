import Link from 'next/link';

export default function ErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #ffffff 100%)' }}>
      <div className="max-w-md mx-auto">
        <div className="text-8xl mb-6">😔</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          We had trouble generating your book. This sometimes happens
          when our illustration service is busy. Your card was not charged.
        </p>
        <div className="bg-white rounded-2xl border border-purple-100 p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">What you can do:</h3>
          <div className="space-y-3">
            {[
              { emoji: '🔄', text: 'Try creating the book again — it usually works second time' },
              { emoji: '⏳', text: 'Wait 2 minutes and try again if the problem persists' },
              { emoji: '📧', text: 'Email us at hello@storykin.com and we will help immediately' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl">{item.emoji}</span>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/create"
          className="inline-block w-full py-4 text-white font-bold text-lg rounded-2xl transition-all"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
        >
          Try again
        </Link>
        <Link
          href="/"
          className="inline-block w-full py-3 mt-3 text-gray-400 text-sm hover:text-gray-600 transition-all"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}