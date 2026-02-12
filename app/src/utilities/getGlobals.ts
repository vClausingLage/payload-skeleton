import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { type Locale } from '@/i18n/config'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0, locale: Locale) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0, locale: Locale) =>
  unstable_cache(async () => getGlobal(slug, depth, locale), [slug, String(depth), locale], {
    tags: [`global_${slug}_${locale}`],
  })
