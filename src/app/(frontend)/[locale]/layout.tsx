import type { Metadata } from 'next'
import React from 'react'

import LocaleSwitcher from '@/components/LocaleSwitcher'
import { defaultLocale, isLocale, locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const locale = isLocale(resolvedParams.locale) ? resolvedParams.locale : defaultLocale
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:8080'
  const dictionary = await getDictionary(locale)

  const languages = locales.reduce<Record<string, string>>((acc, current) => {
    acc[current] = `${baseUrl}/${current}`
    return acc
  }, {})

  return {
    title: dictionary.home.seoTitle ?? 'Payload Skeleton',
    description: dictionary.home.seoDescription ?? 'A clean Payload + Next.js skeleton.',
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ...languages,
        'x-default': `${baseUrl}/${defaultLocale}`,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await params
  const locale = isLocale(resolvedParams.locale) ? (resolvedParams.locale as Locale) : defaultLocale

  return (
    <div className="mx-auto max-w-5xl px-6">
      <div className="flex items-center justify-end py-6">
        <LocaleSwitcher currentLocale={locale} />
      </div>
      {children}
    </div>
  )
}
