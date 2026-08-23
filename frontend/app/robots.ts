import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Personal book previews and post-payment pages are private
      disallow: ['/preview/', '/loading', '/order/'],
    },
    sitemap: 'https://storykinbooks.com/sitemap.xml',
  }
}
