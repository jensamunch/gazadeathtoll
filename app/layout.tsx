import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import ClientLayout from './_components/ClientLayout'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NextIntlClientProvider } from 'next-intl'
import { cookies } from 'next/headers'
import DirectionWrapper from './_components/DirectionWrapper'

export const metadata: Metadata = {
  title: 'Palestinian Deaths since Oct. 7 2023',
  description: 'Record of Palestinian deaths in Gaza since Oct. 7, 2023',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies()
  const locale = store.get('locale')?.value || 'en'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  return (
    <html dir={dir} lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const ls = localStorage.getItem('theme'); const dark = ls ? ls === 'dark' : false; const root = document.documentElement; if (dark) root.classList.add('dark'); else root.classList.remove('dark'); } catch (e) {} })();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider>
          <DirectionWrapper dir={dir}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ClientLayout>{children}</ClientLayout>
            </ThemeProvider>
          </DirectionWrapper>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
