import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { type Locale } from '@/i18n/config'

type Collection = keyof Config['collections']

async function getDocument(collection: Collection, slug: string, locale: Locale, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = (collection: Collection, slug: string, locale: Locale) =>
  unstable_cache(async () => getDocument(collection, slug, locale), [collection, slug, locale], {
    tags: [`${collection}_${slug}_${locale}`],
  })
