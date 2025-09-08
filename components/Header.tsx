'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function Header() {
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
      <div className="flex items-center justify-between px-3 py-4 md:px-4 md:py-5 lg:px-6">
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight md:text-xl lg:text-2xl">
            {t('title')}
          </Link>
          <Link href="/project-goals" className="text-muted-foreground text-sm hover:underline">
            {t('docs')}
          </Link>
          <Link href="/advisory-team" className="text-muted-foreground text-sm hover:underline">
            {t('advisoryTeam')}
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
