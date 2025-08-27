import { auth } from '@clerk/nextjs/server'

type WhoAmIInfo = {
  clerkConfigured: boolean
  userId?: string | null
  admin?: boolean
  adminIds?: string[]
}

export default async function WhoAmIPage() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
  const secretKey = process.env.CLERK_SECRET_KEY || ''
  const clerkConfigured = publishableKey && secretKey && !publishableKey.includes('placeholder')

  let info: WhoAmIInfo = { clerkConfigured: !!clerkConfigured }
  if (clerkConfigured) {
    const { userId } = await auth()
    const adminIds = (process.env.ADMIN_CLERK_IDS || '').split(',').map((s) => s.trim()).filter(Boolean)
    const admin = !!userId && adminIds.includes(userId as string)
    info = { clerkConfigured: true, userId: userId || null, admin, adminIds }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Who am I</h1>
      <pre className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  )
}


