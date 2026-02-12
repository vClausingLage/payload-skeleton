import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { locales } from '@/i18n/config'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const localizedBlogPaths = locales.map((locale) => `/${locale}/blogs/${doc.slug}`)
      const localizedLegacyPaths = locales.map((locale) => `/${locale}/posts/${doc.slug}`)
      const paths = [`/blogs/${doc.slug}`, `/posts/${doc.slug}`, ...localizedBlogPaths, ...localizedLegacyPaths]
      for (const path of paths) {
        payload.logger.info(`Revalidating post at path: ${path}`)
        revalidatePath(path)
      }
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const localizedOldBlogPaths = locales.map((locale) => `/${locale}/blogs/${previousDoc.slug}`)
      const localizedOldLegacyPaths = locales.map((locale) => `/${locale}/posts/${previousDoc.slug}`)
      const oldPaths = [
        `/blogs/${previousDoc.slug}`,
        `/posts/${previousDoc.slug}`,
        ...localizedOldBlogPaths,
        ...localizedOldLegacyPaths,
      ]
      for (const oldPath of oldPaths) {
        payload.logger.info(`Revalidating old post at path: ${oldPath}`)
        revalidatePath(oldPath)
      }
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const localizedBlogPaths = locales.map((locale) => `/${locale}/blogs/${doc?.slug}`)
    const localizedLegacyPaths = locales.map((locale) => `/${locale}/posts/${doc?.slug}`)
    const paths = [`/blogs/${doc?.slug}`, `/posts/${doc?.slug}`, ...localizedBlogPaths, ...localizedLegacyPaths]
    for (const path of paths) {
      revalidatePath(path)
    }
    revalidateTag('posts-sitemap')
  }

  return doc
}
