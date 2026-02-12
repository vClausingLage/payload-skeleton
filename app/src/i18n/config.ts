export const locales = ['en', 'de'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
export const localeCookieName = 'payload-locale'

export const isLocale = (value: string | undefined | null): value is Locale => {
  if (!value) return false
  return (locales as readonly string[]).includes(value)
}

export const getLocaleFromPathname = (pathname: string): Locale | null => {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  return isLocale(firstSegment) ? firstSegment : null
}

export const withLocalePath = (path: string, locale: Locale): string => {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  if (isLocale(path.split('/').filter(Boolean)[0])) {
    return path
  }

  if (path === '/') {
    return `/${locale}`
  }

  return path.startsWith('/') ? `/${locale}${path}` : `/${locale}/${path}`
}
