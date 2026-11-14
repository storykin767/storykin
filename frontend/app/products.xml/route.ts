// Product feed for Google Merchant Center, which lists products in the Google
// Shopping tab, image search and Lens for free. Merchant Center fetches this
// URL on a schedule, so a price change here reaches Google on its own.
//
// Only the printed book is listed. Google's rules for digital goods in free
// listings are unclear, and a disapproved item is worse than a missing one.
// The price must match the checkout (checkout.py PRICES) or Google will
// disapprove the listing for a price mismatch.

const BASE = 'https://storykinbooks.com'

const PRINTED_BOOK = {
  id: 'storykin-printed-8x8',
  title: "Personalised Children's Storybook - Printed 8x8 Softcover",
  description:
    "A picture book written and illustrated for one child, who is the hero of the story. " +
    "Choose their name, age, hair, eyes and skin tone, a theme (dinosaurs, space, " +
    "mermaids, forest, superheroes or princesses), an optional companion and a lesson " +
    "such as kindness or bravery. Preview the whole book free before you pay. " +
    "28-page 8x8 inch square softcover, printed and posted to your door. " +
    "A keepsake gift for birthdays, Christmas and grandchildren.",
  link: `${BASE}/`,
  image: `${BASE}/samples/cover-ava.jpg`,
  additionalImages: [1, 2, 3, 4].map(n => `${BASE}/samples/art-${n}.jpg`),
  price: '39.99 USD',
  // Shipping is included in the price: the checkout charges nothing extra
  shipping: { country: 'US', price: '0.00 USD' },
  googleProductCategory: 'Media > Books > Print Books',
  productType: "Books > Children's Books > Personalised Books",
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const p = PRINTED_BOOK
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Storykin</title>
    <link>${BASE}</link>
    <description>Personalised children's storybooks</description>
    <item>
      <g:id>${p.id}</g:id>
      <g:title>${escapeXml(p.title)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:link>${p.link}</g:link>
      <g:image_link>${p.image}</g:image_link>
${p.additionalImages.map(u => `      <g:additional_image_link>${u}</g:additional_image_link>`).join('\n')}
      <g:availability>in_stock</g:availability>
      <g:price>${p.price}</g:price>
      <g:condition>new</g:condition>
      <g:brand>Storykin</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:is_bundle>no</g:is_bundle>
      <g:google_product_category>${escapeXml(p.googleProductCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(p.productType)}</g:product_type>
      <g:shipping>
        <g:country>${p.shipping.country}</g:country>
        <g:price>${p.shipping.price}</g:price>
      </g:shipping>
    </item>
  </channel>
</rss>
`
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
