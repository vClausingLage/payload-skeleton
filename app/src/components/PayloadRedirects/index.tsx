import type React from 'react'
import type { Page, Post } from '@/payload-types'
import { defaultLocale, type Locale } from '@/i18n/config'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  locale?: Locale
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, locale, url }) => {
  const redirects = await getCachedRedirects()()
  const relationToPath = {
    pages: '',
    posts: '/blogs',
  } as const

  const localeAgnosticURL = locale && url.startsWith(`/${locale}`) ? url.replace(`/${locale}`, '') || '/' : url
  const redirectItem = redirects.find(
    (redirect) => redirect.from === url || redirect.from === localeAgnosticURL,
  )

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id, locale ?? defaultLocale)()) as Page | Post
      const relationPath = collection ? relationToPath[collection] : ''
      redirectUrl = `${relationPath}/${document?.slug}`
    } else {
      const collection = redirectItem.to?.reference?.relationTo
      const relationPath = collection ? relationToPath[collection] : ''
      redirectUrl = `${relationPath}/${typeof redirectItem.to?.reference?.value === 'object' ? redirectItem.to?.reference?.value?.slug : ''}`
    }

    if (redirectUrl) {
      redirect(locale ? `/${locale}${redirectUrl}` : redirectUrl)
    }
  }

  if (disableNotFound) return null

  notFound()
}
