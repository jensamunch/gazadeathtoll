'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Import dictionaries directly as JSON (not server-only)
import enDict from '../app/[lang]/dictionaries/en.json'
import arDict from '../app/[lang]/dictionaries/ar.json'

export default function Header() {
  const pathname = usePathname()
  const [locale, setLocale] = useState<'en' | 'ar'>('ar')

  // Determine current locale from pathname
  useEffect(() => {
    if (pathname.startsWith('/en')) {
      setLocale('en')
    } else {
      setLocale('ar')
    }
  }, [pathname])

  const toggleLocale = () => {
    const currentIsEn = pathname.startsWith('/en')

    if (currentIsEn) {
      // Switch to Arabic (remove /en prefix)
      const newPath = pathname.replace(/^\/en/, '') || '/'
      window.location.href = newPath
    } else {
      // Switch to English (add /en prefix)
      const newPath = `/en${pathname}`
      window.location.href = newPath
    }
  }

  // Get translations from dictionary files
  const dict = locale === 'en' ? enDict : arDict
  const t = dict.nav
  const basePath = locale === 'en' ? '/en' : ''

  return (
    <header className="w-full border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between px-3 py-4 md:px-4 md:py-5 lg:px-6">
        <nav className="flex items-center gap-4">
          <Link
            href={`${basePath}/`}
            className="text-lg font-semibold tracking-tight md:text-xl lg:text-2xl"
          >
            {t.title}
          </Link>
          <Link
            href={`${basePath}/project-goals`}
            className="text-muted-foreground text-sm hover:underline"
          >
            {t.docs}
          </Link>
          <Link
            href={`${basePath}/advisory-team`}
            className="text-muted-foreground text-sm hover:underline"
          >
            {t.advisoryTeam}
          </Link>
          <Link href={`${basePath}/faq`} className="text-muted-foreground text-sm hover:underline">
            {t.faq}
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
