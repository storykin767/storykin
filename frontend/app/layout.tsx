import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Storykin — Personalised Children\'s Storybooks',
  description: 'Create a unique personalised storybook where your child is the hero. Written and illustrated just for them, printed and delivered to your door. Perfect gift for birthdays, Christmas and baby showers.',
  keywords: 'personalised children\'s book, custom storybook, personalised gift for kids, child as hero book, unique children\'s gift, personalised birthday gift child',
  openGraph: {
    title: 'Storykin — A storybook where your child is the hero',
    description: 'Create a completely unique storybook starring your child. Written, illustrated, printed and delivered. Preview before you pay.',
    url: 'https://storykinbooks.com',
    siteName: 'Storykin',
    images: [
      {
        url: 'https://storykinbooks.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Storykin — Personalised Children\'s Storybooks',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Storykin — A storybook where your child is the hero',
    description: 'Create a completely unique storybook starring your child. Printed and delivered to your door.',
    images: ['https://storykinbooks.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://storykinbooks.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
