import { headers, cookies } from 'next/headers'

import { defaultLocale, isLocale, localeCookieName, type Locale } from './config'

export const getRequestLocale = async (): Promise<Locale> => {
  const requestHeaders = await headers()
  const headerLocale = requestHeaders.get('x-locale')

  if (isLocale(headerLocale)) {
    return headerLocale
  }

  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(localeCookieName)?.value

  if (isLocale(cookieLocale)) {
    return cookieLocale
  }

  return defaultLocale
}
