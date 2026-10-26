import type { Metadata } from 'next';

// page.tsx is a client component, so its metadata lives here. Without this
// /create inherited the root layout's canonical and told Google it was a
// duplicate of the homepage, while sitemap.ts listed it as its own page.
export const metadata: Metadata = {
  title: 'Create a Personalised Storybook — Storykin',
  description: 'Tell us your child\'s name and a few details, and read their finished personalised storybook before you decide to buy.',
  alternates: { canonical: 'https://storykinbooks.com/create' },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
