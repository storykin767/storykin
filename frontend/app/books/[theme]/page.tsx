import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '../../components/Logo';
import { notFound } from 'next/navigation';
import { THEME_PAGES, themeBySlug } from '../../content/themes';

export function generateStaticParams() {
  return THEME_PAGES.map((t) => ({ theme: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ theme: string }> }): Promise<Metadata> {
  const { theme } = await params;
  const t = themeBySlug(theme);
  if (!t) return {};
  const url = `https://storykinbooks.com/books/${t.slug}`;
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: url },
    openGraph: {
      title: t.h1, description: t.description, url, siteName: 'Storykin', type: 'article',
      images: [{ url: 'https://storykinbooks.com/og-image.jpg', width: 1200, height: 630 }],
    },
  };
}

export default async function ThemePage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const t = themeBySlug(theme);
  if (!t) notFound();
  const others = THEME_PAGES.filter((x) => x.slug !== t.slug);

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: t.faqs.map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      })}} />

      <nav className="flex items-center justify-between px-6 py-4 border-b border-purple-100">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={34} />
          <span className="text-2xl font-bold" style={{ color: '#6B21A8' }}>Storykin</span>
        </Link>
        <Link href="/create" className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}>Create a book</Link>
      </nav>

      <section className="px-6 py-16 text-center" style={{ background: t.gradient }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-5">{t.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">{t.h1}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{t.intro[0]}</p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 leading-relaxed text-lg mb-10">{t.intro[1]}</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What happens in the story</h2>
          <div className="space-y-6">
            {t.beats.map((b, i) => (
              <div key={b.h} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center"
                  style={{ background: '#7C3AED' }}>{i + 1}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{b.h}</h3>
                  <p className="text-gray-600 leading-relaxed">{b.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: '#FAFAFA' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Lines from real {t.label.toLowerCase()} books</h2>
          <p className="text-gray-500 mb-8 text-sm">Every book is written fresh, so yours will not contain these — but this is the voice.</p>
          <div className="space-y-4">
            {t.lines.map((l) => (
              <blockquote key={l} className="bg-white rounded-2xl p-6 border border-gray-100 text-gray-700 text-lg leading-relaxed italic">
                “{l}”
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Questions people ask</h2>
          <div className="space-y-7">
            {t.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-bold text-gray-900 mb-2">{f.q}</h3>
                <p className="text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-2xl mx-auto rounded-2xl border border-purple-100 p-6 text-center" style={{ background: '#FAF8FF' }}>
          <p className="text-gray-700 leading-relaxed">
            🎄 Buying ahead for Christmas? Printed books need ordering by early
            December — see the{' '}
            <Link href="/gifts/christmas" className="font-semibold underline" style={{ color: '#7C3AED' }}>
              Christmas ordering deadlines
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="px-6 py-16 text-center" style={{ background: '#F5F3FF' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Make one and read it first</h2>
          <p className="text-gray-600 mb-7 leading-relaxed">It takes a couple of minutes and costs nothing until you decide to keep it.</p>
          <Link href="/create" className="inline-block px-10 py-4 text-white font-bold text-lg rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}>
            Create a {t.label.toLowerCase()} book
          </Link>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Other kinds of story</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/books/${o.slug}`}
                className="rounded-xl p-4 border border-gray-100 text-center hover:border-purple-300 transition-all">
                <div className="text-3xl mb-1">{o.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{o.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-gray-100 text-center text-sm text-gray-400">
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
          <Link href="/refund-policy" className="hover:text-gray-600">Refunds</Link>
          <Link href="/create" className="hover:text-gray-600">Create a book</Link>
        </div>
        <p>Storykin — every child deserves their own story</p>
      </footer>
    </main>
  );
}
