import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
const secretKey = process.env.CLERK_SECRET_KEY || ''
const clerkConfigured = publishableKey && secretKey && !publishableKey.includes('placeholder')

export default clerkConfigured ? clerkMiddleware() : (() => NextResponse.next())

// Must be statically analyzable for Next.js
export const config = {
  // Let Clerk detect auth across the app (does not force sign-in by itself)
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
}
