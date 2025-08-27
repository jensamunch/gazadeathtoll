import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
const secretKey = process.env.CLERK_SECRET_KEY || ''
const clerkConfigured = publishableKey && secretKey && !publishableKey.includes('placeholder')

export default function middleware(request: NextRequest) {
  // Add pathname to headers so layout can access it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  
  const response = clerkConfigured 
    ? clerkMiddleware()(request) 
    : NextResponse.next({ request: { headers: requestHeaders } })
    
  if (response instanceof NextResponse) {
    response.headers.set('x-pathname', request.nextUrl.pathname)
  }
  
  return response
}

// Must be statically analyzable for Next.js
export const config = {
  // Let Clerk detect auth across the app (does not force sign-in by itself)
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
}
