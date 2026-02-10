export const locales = ['en', 'de'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
export const localeCookieName = 'payload-locale'

export const isLocale = (value: string | undefined | null): value is Locale => {
  if (!value) return false
  return (locales as readonly string[]).includes(value)
}
