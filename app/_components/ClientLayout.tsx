'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

function Header() {
  const t = useTranslations('Nav')
  const [locale, setLocale] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    try {
      const m = document.cookie.match(/(?:^|; )locale=([^;]+)/)
      const v = m ? decodeURIComponent(m[1]) : null
      if (v === 'ar' || v === 'en') setLocale(v)
    } catch {}
  }, [])

  const toggleLocale = () => {
    const next = locale === 'en' ? 'ar' : 'en'
    setLocale(next)
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `locale=${next}; path=/; expires=${expires}`
    window.location.reload()
  }
  return (
    <header className="w-full border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between px-6 py-3">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            {t('title')}
          </Link>
          <Link
            href="https://www.notion.so/Online-document-of-Palestinian-deaths-since-Oct-7-2023-25e83c5e0bf3807a82aef13eeb179c0d?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-sm hover:underline"
          >
            {t('docs')}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded border px-2 py-1 text-xs"
            style={{ borderColor: 'var(--border)' }}
            aria-label="Toggle language"
          >
            {locale === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </div>
    </header>
  )
}
