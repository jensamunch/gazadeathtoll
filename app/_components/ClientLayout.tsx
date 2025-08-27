'use client'
import { usePathname } from 'next/navigation'
import { ClerkProvider, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import UserButtonWithEmail from './UserButtonWithEmail'
import { Button } from '@/components/ui/button'

export default function ClientLayout({ 
  children, 
  clerkConfigured, 
  publishableKey 
}: { 
  children: React.ReactNode
  clerkConfigured: boolean
  publishableKey?: string
}) {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith('/en')
  
  // Update HTML attributes based on language
  if (typeof document !== 'undefined') {
    document.documentElement.lang = isEnglish ? 'en' : 'ar'
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl'
  }

  return (
    <>
      {clerkConfigured ? (
        <ClerkProvider publishableKey={publishableKey}>
          <HeaderWithClerk isEnglish={isEnglish} />
          <main>{children}</main>
        </ClerkProvider>
      ) : (
        <>
          <HeaderWithoutClerk isEnglish={isEnglish} />
          <main>{children}</main>
        </>
      )}
    </>
  )
}

function HeaderWithClerk({ isEnglish }: { isEnglish: boolean }) {
  const baseUrl = isEnglish ? '/en' : ''
  return (
    <header className="w-full border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href={baseUrl || '/'} className="font-semibold">Palestinian Deaths</Link>
          <SignedIn>
            <Link href={`${baseUrl}/admin`} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Admin</Link>
            <Link href={`${baseUrl}/whoami`} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" target="_blank">Whoami</Link>
          </SignedIn>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <UserButtonWithEmail />
          <SignedIn>
            <SignOutButton signOutOptions={{ redirectUrl: baseUrl || '/' }}>
              <Button variant="outline" size="sm">Sign out</Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link href={`${baseUrl}/sign-in`} className="inline-block">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

function HeaderWithoutClerk({ isEnglish }: { isEnglish: boolean }) {
  const baseUrl = isEnglish ? '/en' : ''
  return (
    <header className="w-full border-b bg-yellow-50 dark:bg-yellow-900/20" style={{ borderColor: 'var(--border)' }}>
      <div className="px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href={baseUrl || '/'} className="font-semibold">Palestinian Deaths</Link>
          <Link href={`${baseUrl}/admin`} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Admin</Link>
          <Link href={`${baseUrl}/whoami`} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" target="_blank">Whoami</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <div className="text-xs text-yellow-800 dark:text-yellow-300">Clerk not configured</div>
        </div>
      </div>
    </header>
  )
}
