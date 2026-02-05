import React from 'react'
import { headers } from 'next/headers'
import './globals.css'
import { defaultLocale } from '@/i18n/config'

export const metadata = {
  description: 'A clean Payload + Next.js skeleton.',
  title: 'Payload Skeleton',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const locale = (await headers()).get('x-locale') || defaultLocale

  return (
    <html lang={locale}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
