import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { defaultLocale, isLocale, localeCookieName } from '@/i18n/config'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/payload') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const pathnameLocale = pathname.split('/')[1]

  if (isLocale(pathnameLocale)) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', pathnameLocale)

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    })

    response.cookies.set(localeCookieName, pathnameLocale, {
      path: '/',
      sameSite: 'lax',
    })

    return response
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

  const redirectUrl = new URL(`/${locale}${pathname}`, request.url)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
