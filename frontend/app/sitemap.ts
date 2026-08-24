import { MetadataRoute } from 'next'
import { THEME_PAGES } from './content/themes'
import { OCCASION_PAGES } from './content/occasions'

const BASE = 'https://storykinbooks.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/create`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...OCCASION_PAGES.map(o => ({
      url: `${BASE}/gifts/${o.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...THEME_PAGES.map(t => ({
      url: `${BASE}/books/${t.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/refund-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]
}
