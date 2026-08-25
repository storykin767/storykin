import Link from 'next/link';
import Logo from './components/Logo';

const STEPS = [
  {
    emoji: '✏️',
    title: 'Tell us about your child',
    desc: 'Name, age, appearance and their favourite theme. Takes 60 seconds.'
  },
  {
    emoji: '✨',
    title: 'We write and illustrate it',
    desc: 'Our AI writes a unique 10-page story and paints every illustration just for them.'
  },
  {
    emoji: '📖',
    title: 'Preview it instantly',
    desc: 'Read the complete book before you buy. Only pay if you love it.'
  },
  {
    emoji: '📦',
    title: 'We print and ship it',
    desc: 'A beautiful softcover book, printed and posted to your door.'
  },
];

const THEMES = [
  { emoji: '🦕', label: 'Dinosaur Adventure', id: 'dinosaur' },
  { emoji: '🚀', label: 'Space Explorer', id: 'space' },
  { emoji: '🧜', label: 'Ocean Magic', id: 'mermaid' },
  { emoji: '🌲', label: 'Enchanted Forest', id: 'forest' },
  { emoji: '⚡', label: 'Superhero', id: 'superhero' },
  { emoji: '👑', label: 'Magical Kingdom', id: 'princess' },
];

const FAQS = [
  {
    q: 'How personalised is the book really?',
    a: "Every word and every illustration is created specifically for your child. We use their name, appearance, chosen theme and even their pet's name throughout the story. No two Storykin books are ever the same."
  },
  {
    q: 'Can I see the book before I pay?',
    a: 'Yes — always. We generate the complete 10-page book and let you read every page before you decide to purchase. You only pay if you love it.'
  },
  {
    q: 'How long does delivery take?',
    a: 'Your book goes to print as soon as you order. Printing and dispatch take 2-4 business days, and delivery time after that depends on where you are — our print partner has presses in 32 countries, so most orders ship from close to home. You will get a confirmation email at each step.'
  },
  {
    q: 'What age is this suitable for?',
    a: "We write stories for children aged 2-8. The language and complexity automatically adjusts based on your child's age."
  },
  {
    q: 'What if I am not happy with the book?',
    a: "If the printed book arrives damaged, misprinted, or simply is not what you hoped for, email us within 14 days of delivery and we will reprint it or refund you in full. Full terms are on our refund policy page."
  },
  {
    q: "Is my child's data safe?",
    a: "We only use your child's name and appearance details to write the story. We never store personal data beyond what is needed to fulfil your order."
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Storykin Personalised Children's Storybook",
              "description": "A completely unique personalised children's storybook where your child is the hero. Written by AI, illustrated, printed and delivered.",
              "url": "https://storykinbooks.com",
              "brand": {
                "@type": "Brand",
                "name": "Storykin"
              },
              "offers": {
                "@type": "Offer",
                "price": "39.99",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "url": "https://storykinbooks.com/create"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "1"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How personalised is the book?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Every word and illustration is created uniquely for your child. We use their name, appearance, chosen theme and even their pet. No two books are ever the same."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I see the book before I pay?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes — always. We generate the complete 10-page book and let you read every page before you decide to purchase."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long does delivery take?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Printing and dispatch take 2-4 business days. Delivery time after that depends on the destination country."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What age is this suitable for?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We write stories for children aged 2-8. Language complexity adjusts automatically based on age."
                  }
                }
              ]
            })
          }}
        />
      {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-white">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={32}/>
            <span className="text-xl sm:text-2xl font-bold" style={{ color: '#6B21A8' }}>Storykin</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-5">
            <Link href="/about" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-purple-700 transition-all">
              About
            </Link>
            <Link
              href="/create"
              className="px-5 py-2 text-white font-medium rounded-xl transition-all text-sm"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
            >
              Create a book
            </Link>
          </div>
        </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center" style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #ffffff 100%)' }}>
        <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full mb-6 shadow-sm"
              style={{ background: '#7C3AED', color: '#ffffff', fontSize: '16px' }}>
              <span>✨</span>
              <span>The only book written just for your child</span>
            </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            A storybook where
            <span style={{ color: '#7C3AED' }}> your child </span>
            is the hero
          </h1>
          <p className="text-base sm:text-xl text-gray-500 mb-8 leading-relaxed">
            We write and illustrate a completely personalised children's book
            starring your child — printed and delivered to your door.
            The perfect gift for any occasion.
          </p>
          <Link
            href="/create"
            className="inline-block px-10 py-5 text-white font-bold text-xl rounded-2xl transition-all shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
          >
            See a free preview
          </Link>
          {/* Real books, above the fold. Everything below was text and emoji. */}
          <div className="mt-10 mb-2 grid grid-cols-2 gap-3 sm:gap-5 max-w-md mx-auto">
            <img
              src="/samples/cover-noor.jpg"
              alt="A personalised storybook cover reading Noor's Cosmic Adventure"
              width={760} height={760}
              className="w-full rounded-2xl shadow-lg"
            />
            <img
              src="/samples/cover-ava.jpg"
              alt="A personalised storybook cover reading Ava and the Dinosaur Adventure"
              width={760} height={760}
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
          <p className="text-xs text-gray-400 mb-8">Two real books, made for two real children.</p>

          <p className="text-sm text-gray-400 mt-4">
            Preview the complete book before you pay. Takes 60 seconds to create.
          </p>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-4 px-6" style={{ background: '#7C3AED' }}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-white text-sm font-medium">
          <span>📚 100% personalised — no templates</span>
          <span>👀 Preview before you pay</span>
          <span>🚚 Printed and shipped worldwide</span>
          <span>💛 14-day reprint or refund</span>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            How it works
          </h2>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base"
                style={{ background: '#F5F3FF', color: '#6D28D9', border: '2px solid #7C3AED' }}>
                ⏱️ From first click to front door in under a minute of your time
              </span>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl" style={{ background: '#F5F3FF' }}>
                <div className="text-4xl flex-shrink-0">{step.emoji}</div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 text-white text-xs font-bold rounded-full flex items-center justify-center"
                      style={{ background: '#7C3AED' }}>
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="px-6 py-16" style={{ background: '#FAFAFA' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            6 magical themes to choose from
          </h2>
          <p className="text-gray-500 mb-8">
            Every theme comes with a completely unique story and illustrations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {['art-1','art-2','art-3','art-4'].map((a) => (
              <img
                key={a}
                src={`/samples/${a}.jpg`}
                alt="An illustration from a personalised Storykin book"
                width={760} height={760}
                loading="lazy"
                className="w-full rounded-xl shadow-sm"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {THEMES.map(theme => (
              <Link
                key={theme.label}
                href={`/books/${theme.id}`}
                className="bg-white rounded-2xl p-6 border border-purple-100 hover:border-purple-300 transition-all block"
                style={{ background: 'white' }}
              >
                <div className="text-4xl mb-2">{theme.emoji}</div>
                <p className="font-medium text-gray-800 text-sm">{theme.label}</p>
              </Link>
            ))}
          </div>
          <Link
            href="/create"
            className="inline-block px-8 py-4 text-white font-bold text-lg rounded-2xl transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
          >
            Start creating
          </Link>
        </div>
      </section>

      {/* Gift angle */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">🎁</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The gift they will never forget
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            Unlike toys that get forgotten and clothes they grow out of,
            a Storykin book is a keepsake they will treasure forever.
            Perfect for birthdays, baby showers, Christmas and every
            special moment in between.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { emoji: '🎂', label: 'Birthdays', slug: 'birthday' },
              { emoji: '🎄', label: 'Christmas', slug: 'christmas' },
              { emoji: '👶', label: 'Baby showers', slug: 'baby-shower' },
              { emoji: '💛', label: 'From grandparents', slug: 'grandparent' },
            ].map(o => (
              <Link key={o.label} href={`/gifts/${o.slug}`}
                className="p-4 rounded-2xl block hover:opacity-80 transition-all" style={{ background: '#F5F3FF' }}>
                <div className="text-3xl mb-1">{o.emoji}</div>
                <p className="text-sm font-medium text-gray-700">{o.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16" style={{ background: '#F5F3FF' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-gray-500 mb-10">No subscriptions. Pay once, own it forever.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Physical */}
            <div className="bg-white rounded-2xl p-8 border-2" style={{ borderColor: '#7C3AED' }}>
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Printed book</h3>
              <p className="text-gray-500 text-sm mb-4">Shipped to your door</p>
              <p className="text-4xl font-bold mb-6" style={{ color: '#7C3AED' }}>$39.99</p>
              <ul className="text-sm text-gray-600 space-y-2 text-left mb-6">
                {[
                  '28-page 8×8" softcover book',
                  '12 full-page illustrations',
                  'Printed at 300 DPI',
                  'Printed and posted worldwide',
                  '14-day reprint or refund',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span style={{ color: '#7C3AED' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link
                href="/create"
                className="block w-full py-3 text-white font-bold rounded-xl transition-all text-center"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
              >
                Create my book
              </Link>
            </div>

            {/* Digital */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Digital PDF</h3>
              <p className="text-gray-500 text-sm mb-4">Instant download</p>
              <p className="text-4xl font-bold text-gray-700 mb-6">$9.99</p>
              <ul className="text-sm text-gray-600 space-y-2 text-left mb-6">
                {[
                  'High resolution 29-page PDF',
                  '12 full-page illustrations',
                  'Instant delivery by email',
                  'Print at home anytime',
                  'Share with family',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-gray-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link
                href="/create"
                className="block w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all text-center"
              >
                Create my book
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 text-center" style={{ background: 'linear-gradient(135deg, #6D28D9, #7C3AED, #9333EA)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to create the magic?
          </h2>
          <p className="text-purple-200 text-lg mb-10">
            Give your child the gift of their very own story.
          </p>
          <Link
            href="/create"
            className="inline-block px-10 py-5 bg-white font-bold text-xl rounded-2xl hover:bg-purple-50 transition-all"
            style={{ color: '#7C3AED' }}
          >
            Create your book — $39.99
          </Link>
          <p className="text-purple-200 text-sm mt-4">
            Preview the complete book before you pay
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100 text-center">
        <p className="text-2xl font-bold mb-2" style={{ color: '#7C3AED' }}>Storykin</p>
        <p className="text-gray-400 text-sm">Every child deserves their own story</p>
        <div className="flex justify-center gap-6 mt-5 text-sm text-gray-500">
          <Link href="/about" className="hover:text-purple-700 transition-all">About</Link>
          <Link href="/create" className="hover:text-purple-700 transition-all">Create a book</Link>
          <Link href="/refund-policy" className="hover:text-purple-700 transition-all">Refunds</Link>
          <a href="mailto:hello@storykinbooks.com" className="hover:text-purple-700 transition-all">Contact</a>
        </div>
        <p className="text-gray-300 text-xs mt-5">© 2026 Storykin. All rights reserved.</p>
      </footer>

    </main>
  );
}