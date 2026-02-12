import { PayloadRequest, CollectionSlug } from 'payload'
import { defaultLocale, isLocale } from '@/i18n/config'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/blogs',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)
  const resolvedLocale = isLocale(req?.locale) ? req.locale : defaultLocale
  const path =
    collection === 'pages' && slug === 'home'
      ? `/${resolvedLocale}`
      : `/${resolvedLocale}${collectionPrefixMap[collection]}/${encodedSlug}`

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
