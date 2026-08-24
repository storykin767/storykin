import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund & Reprint Policy — Storykin',
  description:
    'Our 14-day reprint or refund promise on printed Storykin books, how digital orders work, and how to get in touch if something is wrong.',
  alternates: { canonical: 'https://storykinbooks.com/refund-policy' },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    h: 'Printed books — 14-day reprint or refund',
    p: [
      'If your printed book arrives damaged, misprinted, or simply is not what you hoped for, email us within 14 days of delivery and we will reprint it or refund you in full. You choose which.',
      'You do not need to return the book. Sending a photograph of the problem helps us fix it with our print partner, but it is not a condition of your refund.',
    ],
  },
  {
    h: 'Before you pay, nothing is charged',
    p: [
      'Every Storykin book is written and illustrated before you are asked for any payment. You read the whole story and see every picture first. If it is not right, close the page — you are not charged and there is nothing to cancel.',
      'This is why we can be relaxed about refunds: almost nobody buys a book they have not already read.',
    ],
  },
  {
    h: 'Digital books',
    p: [
      'Digital PDFs are delivered by email within a few minutes of payment. Because the file is yours immediately and cannot be returned, digital orders are not refundable once the download email has been sent.',
      'If the email does not arrive, the link does not work, or the file will not open, tell us and we will fix it or refund you. That is a delivery failure, not a change of mind.',
    ],
  },
  {
    h: 'Cancelling a printed order',
    p: [
      'Printed books go to press quickly, which is what makes delivery fast. If you need to cancel, email us as soon as you can — if the book has not reached the press we will cancel and refund it immediately.',
      'If it has already been printed, the 14-day promise above still covers you once it arrives.',
    ],
  },
  {
    h: 'Wrong details on the book',
    p: [
      'If you spot a spelling of a name or another detail you would like changed, contact us before the book goes to press and we will sort it. Once printed, a book with the wrong details is covered by the reprint promise — we would rather reprint it than have a keepsake with a mistake in it.',
    ],
  },
  {
    h: 'How refunds are paid',
    p: [
      'Refunds go back to the card used for the original payment through Stripe, our payment processor. Depending on your bank, the money usually appears within 5 to 10 business days.',
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-purple-100">
        <Link href="/" className="text-2xl font-bold" style={{ color: '#6B21A8' }}>
          Storykin
        </Link>
        <Link
          href="/create"
          className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
        >
          Create a book
        </Link>
      </nav>

      <section
        className="px-6 py-16 text-center"
        style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #ffffff 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund &amp; reprint policy</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The short version: you see the finished book before you pay, and if a
            printed book disappoints you, we reprint it or refund you within 14 days.
          </p>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="max-w-2xl mx-auto space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-3">{para}</p>
              ))}
            </div>
          ))}

          <div className="rounded-2xl p-6 border border-purple-100" style={{ background: '#F5F3FF' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Getting in touch</h2>
            <p className="text-gray-600 leading-relaxed">
              Email{' '}
              <a href="mailto:hello@storykinbooks.com" className="font-semibold" style={{ color: '#7C3AED' }}>
                hello@storykinbooks.com
              </a>{' '}
              with your order reference — it is in your confirmation email. A person
              reads it, usually the same day.
            </p>
          </div>

          <p className="text-sm text-gray-400">
            Nothing in this policy affects your statutory consumer rights.
          </p>
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-gray-100 text-center text-sm text-gray-400">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <Link href="/about" className="hover:text-gray-600">About</Link>
          <Link href="/create" className="hover:text-gray-600">Create a book</Link>
        </div>
        <p>Storykin — every child deserves their own story</p>
      </footer>
    </main>
  );
}
