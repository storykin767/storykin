import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '../components/Logo';

export const metadata: Metadata = {
  title: 'About Storykin — Personalised Storybooks Made For One Child',
  description:
    'Storykin creates one-of-a-kind personalised storybooks where your child is the hero. Every story is written and illustrated from scratch, printed as a keepsake book and delivered to your door.',
  alternates: { canonical: 'https://storykinbooks.com/about' },
  openGraph: {
    title: 'About Storykin — a storybook made for one child',
    description:
      'Why we make personalised storybooks, how each one is created, and what makes every Storykin book unrepeatable.',
    url: 'https://storykinbooks.com/about',
    siteName: 'Storykin',
    images: [{ url: 'https://storykinbooks.com/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
};

const PRINCIPLES = [
  {
    emoji: '✍️',
    title: 'Every story is written from scratch',
    body: "We don't keep a shelf of finished stories and drop a name into the gaps. Your child's book is composed for them — their name, their hair, their eyes, the companion they chose, the lesson you picked. Order two books for two children and you get two genuinely different stories.",
  },
  {
    emoji: '🎨',
    title: 'Every picture is painted for that story',
    body: 'The illustrations are made to match the words on the page, in a soft watercolour style chosen because it feels like the picture books people remember from their own childhood. No stock art, no clip art, no photographs.',
  },
  {
    emoji: '👀',
    title: 'You see the whole book before you pay',
    body: 'You read every page and see every illustration first. If it is not right, you close the tab and it costs you nothing. We would rather lose the sale than sell someone a book they did not love.',
  },
  {
    emoji: '📖',
    title: 'It is made to be kept',
    body: 'A 28-page square softcover book on proper paper, printed and shipped from a print partner with presses in 32 countries, so it reaches you quickly wherever you are. This is a keepsake for a shelf, not a file in a folder.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Storykin',
            url: 'https://storykinbooks.com/about',
            publisher: {
              '@type': 'Organization',
              name: 'Storykin',
              url: 'https://storykinbooks.com',
              logo: 'https://storykinbooks.com/og-image.jpg',
              email: 'hello@storykinbooks.com',
              description:
                'Storykin makes personalised children’s storybooks in which the child is the hero, printed as keepsake books and delivered worldwide.',
            },
          }),
        }}
      />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-purple-100">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={34} />
          <span className="text-2xl font-bold" style={{ color: '#6B21A8' }}>Storykin</span>
        </Link>
        <Link
          href="/create"
          className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
        >
          Create a book
        </Link>
      </nav>

      {/* Hero */}
      <section
        className="px-6 py-20 text-center"
        style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #ffffff 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            A book that belongs to
            <span style={{ color: '#7C3AED' }}> one child</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Children work out very early which things are truly theirs. A Storykin
            book has their name on the dedication page, their face in the pictures
            and their companion beside them on every adventure — because it was
            made for them and for nobody else.
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why we make these</h2>
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              Personalised books have been around for years, and most of them work
              the same way: one story, written once, with a space where a name gets
              dropped in. Buy two for two children and you have bought the same book
              twice.
            </p>
            <p>
              That always seemed like a missed opportunity. The thing that makes a
              child sit up is not seeing their name in someone else&apos;s story — it is
              recognising <em>themselves</em>. Their hair. Their eyes. The dog they
              actually own. A story that could not have been written for anyone else.
            </p>
            <p>
              So Storykin makes each book from nothing, one at a time, at the moment
              it is ordered. It takes a couple of minutes rather than being pulled
              off a shelf, and that is rather the point.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 py-16" style={{ background: '#FAFAFA' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            How a Storykin book is made
          </h2>
          <div className="space-y-8">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="flex items-start gap-5">
                <span className="text-4xl leading-none flex-shrink-0">{p.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{p.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who these are for</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Most Storykin books are bought by someone who is not the child —
            grandparents most of all, then parents, aunts, uncles and godparents
            looking for a birthday, Christmas, baby shower or new-sibling present
            that will not be forgotten by February.
          </p>
          <p className="text-gray-600 leading-relaxed">
            You do not need to be good with computers to make one. You answer a few
            questions about the child, you read the book we have written, and if you
            like it we print it and post it. That is the whole thing.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-16" style={{ background: '#F5F3FF' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Talk to a person</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Storykin is a small operation, which means that when you email us, a
            person who actually makes the books reads it and replies — usually the
            same day.
          </p>
          <a
            href="mailto:hello@storykinbooks.com"
            className="text-lg font-semibold"
            style={{ color: '#7C3AED' }}
          >
            hello@storykinbooks.com
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            See a book before you decide
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Making one is free. You only pay if you want to keep it.
          </p>
          <Link
            href="/create"
            className="inline-block px-10 py-4 text-white font-bold text-lg rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
          >
            Create a book
          </Link>
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-gray-100 text-center text-sm text-gray-400">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <Link href="/create" className="hover:text-gray-600">Create a book</Link>
          <Link href="/refund-policy" className="hover:text-gray-600">Refunds</Link>
        </div>
        <p>Storykin — every child deserves their own story</p>
      </footer>
    </main>
  );
}
