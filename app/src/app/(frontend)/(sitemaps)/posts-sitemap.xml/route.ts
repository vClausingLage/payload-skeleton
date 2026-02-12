import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { locales } from '@/i18n/config'

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const dateFallback = new Date().toISOString()

    const localizedSitemaps = await Promise.all(
      locales.map(async (locale) => {
        const results = await payload.find({
          collection: 'posts',
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
              .filter((post) => Boolean(post?.slug))
              .map((post) => ({
                loc: `${SITE_URL}/${locale}/blogs/${post?.slug}`,
                lastmod: post.updatedAt || dateFallback,
              }))
          : []
      }),
    )

    return localizedSitemaps.flat()
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
