import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { locales } from '@/i18n/config'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const localizedPaths =
        doc.slug === 'home' ? locales.map((locale) => `/${locale}`) : locales.map((locale) => `/${locale}/${doc.slug}`)
      const paths = [doc.slug === 'home' ? '/' : `/${doc.slug}`, ...localizedPaths]

      for (const path of paths) {
        payload.logger.info(`Revalidating page at path: ${path}`)
        revalidatePath(path)
      }
      revalidateTag('pages-sitemap')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const localizedOldPaths =
        previousDoc.slug === 'home'
          ? locales.map((locale) => `/${locale}`)
          : locales.map((locale) => `/${locale}/${previousDoc.slug}`)
      const oldPaths = [previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`, ...localizedOldPaths]

      for (const oldPath of oldPaths) {
        payload.logger.info(`Revalidating old page at path: ${oldPath}`)
        revalidatePath(oldPath)
      }
      revalidateTag('pages-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const localizedPaths =
      doc?.slug === 'home' ? locales.map((locale) => `/${locale}`) : locales.map((locale) => `/${locale}/${doc?.slug}`)
    const paths = [doc?.slug === 'home' ? '/' : `/${doc?.slug}`, ...localizedPaths]
    for (const path of paths) {
      revalidatePath(path)
    }
    revalidateTag('pages-sitemap')
  }

  return doc
}
