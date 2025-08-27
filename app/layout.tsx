import type { Metadata } from 'next'
import { ClerkProvider, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import ThemeToggle from './_components/ThemeToggle'
import UserButtonWithEmail from './_components/UserButtonWithEmail'
import { Button } from '@/components/ui/button'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Palestinian Deaths',
  description: 'Record of Palestinian deaths in Gaza since Oct. 7, 2023',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const clerkConfigured = !!publishableKey && !publishableKey.includes('placeholder')
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const ls = localStorage.getItem('theme'); const dark = ls ? ls === 'dark' : false; const root = document.documentElement; if (dark) root.classList.add('dark'); else root.classList.remove('dark'); root.setAttribute('data-ag-theme-mode', dark ? 'dark' : 'light'); } catch (e) {} })();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {clerkConfigured ? (
            <ClerkProvider publishableKey={publishableKey}>
              <HeaderWithClerk />
              <main>{children}</main>
            </ClerkProvider>
          ) : (
            <>
              <HeaderWithoutClerk />
              <main>{children}</main>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}

function HeaderWithClerk() {
  return (
    <header className="w-full border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-semibold">Palestinian Deaths</Link>
          <SignedIn>
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Admin</Link>
            <Link href="/whoami" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" target="_blank">Whoami</Link>
          </SignedIn>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButtonWithEmail />
          <SignedIn>
            <SignOutButton signOutOptions={{ redirectUrl: '/' }}>
              <Button variant="outline" size="sm">Sign out</Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="inline-block">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

function HeaderWithoutClerk() {
  return (
    <header className="w-full border-b bg-yellow-50 dark:bg-yellow-900/20" style={{ borderColor: 'var(--border)' }}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-semibold">Palestinian Deaths</Link>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Admin</Link>
          <Link href="/whoami" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" target="_blank">Whoami</Link>
        </nav>
        <div className="text-xs text-yellow-800 dark:text-yellow-300">Clerk not configured</div>
      </div>
    </header>
  )
}
