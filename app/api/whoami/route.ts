import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export const runtime = 'nodejs'

export async function GET() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
  const secretKey = process.env.CLERK_SECRET_KEY || ''
  const clerkConfigured = publishableKey && secretKey && !publishableKey.includes('placeholder')

  if (!clerkConfigured) {
    return NextResponse.json({ clerkConfigured: false })
  }

  const { userId } = await auth()
  const adminIds = (process.env.ADMIN_CLERK_IDS || '').split(',').map((s) => s.trim()).filter(Boolean)
  const admin = !!userId && adminIds.includes(userId)

  return NextResponse.json({ clerkConfigured: true, userId: userId || null, admin, adminIds })
}


