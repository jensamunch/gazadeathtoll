import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import ClientLayout from './_components/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Palestinian Deaths',
  description: 'Record of Palestinian deaths in Gaza since Oct. 7, 2023',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const clerkConfigured = !!publishableKey && !publishableKey.includes('placeholder')
  
  return (
    <html suppressHydrationWarning>
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
          <ClientLayout clerkConfigured={clerkConfigured} publishableKey={publishableKey}>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}


