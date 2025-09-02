import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import ClientLayout from './_components/ClientLayout'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NextIntlClientProvider } from 'next-intl'

export const metadata: Metadata = {
  title: 'Palestinian Deaths since Oct. 7 2023',
  description: 'Record of Palestinian deaths in Gaza since Oct. 7, 2023',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const ls = localStorage.getItem('theme'); const dark = ls ? ls === 'dark' : false; const root = document.documentElement; if (dark) root.classList.add('dark'); else root.classList.remove('dark'); root.setAttribute('data-ag-theme-mode', dark ? 'dark' : 'light'); } catch (e) {} })();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayout>{children}</ClientLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
