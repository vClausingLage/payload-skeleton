import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import { Button } from '@/components/ui/button'
import config from '@/payload.config'
import { getDictionary } from '@/i18n/getDictionary'
import { defaultLocale, isLocale, locales, type Locale } from '@/i18n/config'

type Params = {
  locale: Locale
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params
  const locale = isLocale(resolvedParams.locale) ? resolvedParams.locale : defaultLocale
  const dictionary = await getDictionary(locale)

  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="flex min-h-[calc(100vh-96px)] flex-col gap-10 pb-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        {!user && <h1 className="text-4xl font-semibold">{dictionary.home.title}</h1>}
        {user && (
          <h1 className="text-4xl font-semibold">
            {dictionary.home.welcomeBack.replace('{{email}}', user.email)}
          </h1>
        )}
        <p className="max-w-2xl text-lg text-muted-foreground">{dictionary.home.tagline}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href={payloadConfig.routes.admin} target="_blank" rel="noopener noreferrer">
              {dictionary.home.adminCta}
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="https://payloadcms.com/docs" target="_blank" rel="noopener noreferrer">
              {dictionary.home.docsCta}
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:justify-center">
        <span>{dictionary.home.editHint}</span>
        <a className="rounded bg-muted px-2 py-1 font-mono text-xs text-foreground" href={fileURL}>
          app/(frontend)/[locale]/page.tsx
        </a>
      </div>
    </div>
  )
}
