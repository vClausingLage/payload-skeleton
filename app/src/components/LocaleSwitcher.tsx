import Link from 'next/link'

import { defaultLocale, locales, type Locale } from '@/i18n/config'

type Props = {
  currentLocale?: Locale
}

export default function LocaleSwitcher({ currentLocale }: Props) {
  const active = currentLocale ?? defaultLocale

  return (
    <nav className="flex items-center gap-2 text-sm">
      {locales.map((locale) => {
        const isActive = locale === active
        return (
          <Link
            key={locale}
            className={`rounded px-2 py-1 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
            href={`/${locale}`}
          >
            {locale.toUpperCase()}
          </Link>
        )
      })}
    </nav>
  )
}
