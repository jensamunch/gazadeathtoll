import type { Metadata } from 'next'
import { ClerkProvider, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import ThemeToggle from '@/app/_components/ThemeToggle'
import LanguageSwitcher from '@/app/_components/LanguageSwitcher'
import UserButtonWithEmail from '@/app/_components/UserButtonWithEmail'
import { Button } from '@/components/ui/button'
import { ThemeProvider } from '@/components/theme-provider'
import '@/app/globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Palestinian Deaths',
  description: 'Record of Palestinian deaths in Gaza since Oct. 7, 2023',
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const messages = await getMessages()
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const clerkConfigured = !!publishableKey && !publishableKey.includes('placeholder')
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const ls = localStorage.getItem('theme'); const dark = ls ? ls === 'dark' : false; const root = document.documentElement; if (dark) root.classList.add('dark'); else root.classList.remove('dark'); root.setAttribute('data-ag-theme-mode', dark ? 'dark' : 'light'); } catch (e) {} })();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages} locale={locale} timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {clerkConfigured ? (
              <ClerkProvider publishableKey={publishableKey}>
                <HeaderWithClerk locale={locale} />
                <main>{children}</main>
              </ClerkProvider>
            ) : (
              <>
                <HeaderWithoutClerk locale={locale} />
                <main>{children}</main>
              </>
            )}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

function HeaderWithClerk({ locale }: { locale: string }) {
  return (
    <header className="w-full border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href={`/${locale}`} className="font-semibold">Palestinian Deaths</Link>
          <SignedIn>
            <Link href={`/${locale}/admin`} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Admin</Link>
            <Link href={`/${locale}/whoami`} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" target="_blank">Whoami</Link>
          </SignedIn>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          <UserButtonWithEmail />
          <SignedIn>
            <SignOutButton signOutOptions={{ redirectUrl: `/${locale}` }}>
              <Button variant="outline" size="sm">Sign out</Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <Link href={`/${locale}/sign-in`} className="inline-block">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

function HeaderWithoutClerk({ locale }: { locale: string }) {
  return (
    <header className="w-full border-b bg-yellow-50 dark:bg-yellow-900/20" style={{ borderColor: 'var(--border)' }}>
      <div className="px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href={`/${locale}`} className="font-semibold">Palestinian Deaths</Link>
          <Link href={`/${locale}/admin`} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Admin</Link>
          <Link href={`/${locale}/whoami`} className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" target="_blank">Whoami</Link>
        </nav>
        <div className="text-xs text-yellow-800 dark:text-yellow-300">Clerk not configured</div>
      </div>
    </header>
  )
}


