'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Github } from 'lucide-react'

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
    <header
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between px-3 py-4 md:px-4 md:py-5 lg:px-6">
        <nav className="flex items-center gap-4">
          <Link href={`${basePath}/`} className="text-muted-foreground text-sm hover:underline">
            {t.home}
          </Link>
          <Link
            href={`${basePath}/mission`}
            className="text-muted-foreground text-sm hover:underline"
          >
            {t.mission}
          </Link>
          <Link
            href={`${basePath}/about`}
            className="text-muted-foreground text-sm hover:underline"
          >
            {t.about}
          </Link>
          <Link
            href={`${basePath}/roadmap`}
            className="text-muted-foreground text-sm hover:underline"
          >
            {t.roadmap}
          </Link>
          <Link
            href={`${basePath}/database`}
            className="text-muted-foreground text-sm hover:underline"
          >
            {t.database}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/jensamunch/gazadeaths"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground p-2 transition-colors"
            aria-label="View source code on GitHub"
          >
            <Github size={20} />
          </a>
          <button
            type="button"
            onClick={toggleLocale}
            className="hover:bg-muted rounded-md border-2 px-4 py-2 text-sm font-medium transition-colors"
            style={{ borderColor: 'var(--border)' }}
            aria-label="Toggle language"
          >
            {locale === 'en' ? t.switchToArabic : t.switchToEnglish}
          </button>
        </div>
      </div>
    </header>
  )
}
