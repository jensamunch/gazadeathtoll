import type { Metadata } from 'next'
import '@/app/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import DirectionWrapper from '@/components/DirectionWrapper'
import Header from '@/components/Header'
import { notFound } from 'next/navigation'
import { getDictionary } from './dictionaries'

const locales = ['ar', 'en']

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang as 'ar' | 'en')

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  }
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  // Validate that the incoming `lang` parameter is valid
  if (!locales.includes(lang)) notFound()

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <html dir={dir} lang={lang} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <DirectionWrapper dir={dir}>
          <Header />
          <main className="px-6 py-8 md:px-10 md:py-12 lg:px-16 lg:py-16 xl:px-24 2xl:px-32">
            {children}
          </main>
        </DirectionWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
