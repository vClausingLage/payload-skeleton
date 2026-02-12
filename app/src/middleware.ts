import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { defaultLocale, isLocale, localeCookieName } from './i18n/config'

const EXCLUDED_PREFIXES = ['/api', '/admin', '/_next', '/next']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Skip files in /public and other direct asset requests.
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next()
  }

  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (isLocale(firstSegment)) {
    const locale = firstSegment
    const rewrittenPath = `/${segments.slice(1).join('/')}` || '/'
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-locale', locale)

    const rewriteURL = request.nextUrl.clone()
    rewriteURL.pathname = rewrittenPath === '/' ? '/' : rewrittenPath

    const response = NextResponse.rewrite(rewriteURL, {
      request: { headers: requestHeaders },
    })
    response.cookies.set(localeCookieName, locale, { path: '/' })
    return response
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

  const redirectURL = request.nextUrl.clone()
  redirectURL.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`

  const response = NextResponse.redirect(redirectURL)
  response.cookies.set(localeCookieName, locale, { path: '/' })
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
