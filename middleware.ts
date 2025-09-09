import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ar', 'en']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // For paths without locale prefix, treat as Arabic (default)
  // Rewrite to /ar internally but keep the URL clean
  request.nextUrl.pathname = `/ar${pathname}`
  return NextResponse.rewrite(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
