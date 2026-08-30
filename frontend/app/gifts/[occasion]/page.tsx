import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '../../components/Logo';
import { notFound } from 'next/navigation';
import { OCCASION_PAGES, occasionBySlug } from '../../content/occasions';
import { THEME_PAGES } from '../../content/themes';

export function generateStaticParams() {
  return OCCASION_PAGES.map((o) => ({ occasion: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ occasion: string }> }): Promise<Metadata> {
  const { occasion } = await params;
  const o = occasionBySlug(occasion);
  if (!o) return {};
  const url = `https://storykinbooks.com/gifts/${o.slug}`;
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: url },
    openGraph: {
      title: o.h1, description: o.description, url, siteName: 'Storykin', type: 'article',
      images: [{ url: 'https://storykinbooks.com/og-image.jpg', width: 1200, height: 630 }],
    },
  };
}

export default async function OccasionPage({ params }: { params: Promise<{ occasion: string }> }) {
  const { occasion } = await params;
  const o = occasionBySlug(occasion);
  if (!o) notFound();
  const others = OCCASION_PAGES.filter((x) => x.slug !== o.slug);

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: o.faqs.map((f) => ({
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

      <section className="px-6 py-16 text-center" style={{ background: o.gradient }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-5">{o.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">{o.h1}</h1>
          <p className="text-lg text-gray-700 leading-relaxed">{o.intro[0]}</p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 leading-relaxed text-lg mb-10">{o.intro[1]}</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why it works as a present</h2>
          <div className="space-y-6">
            {o.why.map((w) => (
              <div key={w.h}>
                <h3 className="font-bold text-gray-900 mb-1">{w.h}</h3>
                <p className="text-gray-600 leading-relaxed">{w.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12" style={{ background: '#F5F3FF' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">When to order</h2>
          <p className="text-gray-700 leading-relaxed">{o.timing}</p>

          {o.deadlines && (
            <div className="mt-7 space-y-3">
              {o.deadlines.map((d) => (
                <div key={d.label} className="bg-white rounded-xl p-5 border border-purple-100">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{d.label}</span>
                    <span className="font-bold" style={{ color: '#7C3AED' }}>order by {d.by}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{d.note}</p>
                </div>
              ))}
              <p className="text-xs text-gray-400 pt-1">
                These are recommendations rather than guarantees — postal times in December
                are outside anyone&apos;s control, so earlier is always safer.
              </p>
            </div>
          )}
        </div>
      </section>

      {o.sections && (
        <section className="px-6 py-14">
          <div className="max-w-2xl mx-auto space-y-10">
            {o.sections.map((sec) => (
              <div key={sec.h}>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{sec.h}</h2>
                {sec.p.map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-3">{para}</p>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 py-14">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting it right</h2>
          <ul className="space-y-4">
            {o.tips.map((t) => (
              <li key={t} className="flex gap-3 text-gray-600 leading-relaxed">
                <span style={{ color: '#7C3AED' }} className="font-bold flex-shrink-0">→</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: '#FAFAFA' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Questions people ask</h2>
          <div className="space-y-7">
            {o.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-bold text-gray-900 mb-2">{f.q}</h3>
                <p className="text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Pick a kind of story</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {THEME_PAGES.map((t) => (
              <Link key={t.slug} href={`/books/${t.slug}`}
                className="rounded-xl p-3 border border-gray-100 text-center hover:border-purple-300 transition-all">
                <div className="text-2xl mb-1">{t.emoji}</div>
                <div className="text-xs font-medium text-gray-700">{t.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center" style={{ background: '#F5F3FF' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">See the book before you buy it</h2>
          <p className="text-gray-600 mb-7 leading-relaxed">Making one is free. You only pay if you want to keep it.</p>
          <Link href="/create" className="inline-block px-10 py-4 text-white font-bold text-lg rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}>Create a book</Link>
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            {others.map((x) => (
              <Link key={x.slug} href={`/gifts/${x.slug}`} className="text-sm text-gray-500 hover:text-purple-700">
                {x.emoji} {x.label}
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
