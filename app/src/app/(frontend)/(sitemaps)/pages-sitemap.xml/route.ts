import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { locales } from '@/i18n/config'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const dateFallback = new Date().toISOString()

    const localizedDefaultSitemap = locales.flatMap((locale) => [
      {
        loc: `${SITE_URL}/${locale}/search`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/${locale}/blogs`,
        lastmod: dateFallback,
      },
    ])

    const localizedSitemap = await Promise.all(
      locales.map(async (locale) => {
        const results = await payload.find({
          collection: 'pages',
          overrideAccess: false,
          draft: false,
          depth: 0,
          limit: 1000,
          locale,
          pagination: false,
          where: {
            _status: {
              equals: 'published',
            },
          },
          select: {
            slug: true,
            updatedAt: true,
          },
        })

        return results.docs
          ? results.docs
              .filter((page) => Boolean(page?.slug))
              .map((page) => {
                return {
                  loc:
                    page?.slug === 'home'
                      ? `${SITE_URL}/${locale}`
                      : `${SITE_URL}/${locale}/${page?.slug}`,
                  lastmod: page.updatedAt || dateFallback,
                }
              })
          : []
      }),
    )

    return [...localizedDefaultSitemap, ...localizedSitemap.flat()]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
