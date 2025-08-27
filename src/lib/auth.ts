import { auth } from '@clerk/nextjs/server'

interface AuthError extends Error {
  status: number
}

export async function assertAdmin() {
  const { userId } = await auth()
  const adminIds = (process.env.ADMIN_CLERK_IDS || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!userId || !adminIds.includes(userId)) {
    const error = new Error('Unauthorized') as AuthError
    error.status = 401
    throw error
  }
  return userId
}

export function isAdmin(userId: string | null | undefined): boolean {
  const adminIds = (process.env.ADMIN_CLERK_IDS || '').split(',').map((s) => s.trim()).filter(Boolean)
  return !!userId && adminIds.includes(userId)
}
