'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Github, Menu, X } from 'lucide-react'

// Import dictionaries directly as JSON (not server-only)
import enDict from '../app/[lang]/dictionaries/en.json'
import arDict from '../app/[lang]/dictionaries/ar.json'

export default function Header() {
  const pathname = usePathname()
  const [locale, setLocale] = useState<'en' | 'ar'>('ar')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Determine current locale from pathname
  useEffect(() => {
    if (pathname.startsWith('/en')) {
      setLocale('en')
    } else {
      setLocale('ar')
    }
  }, [pathname])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as Element
        if (!target.closest('header')) {
          setIsMobileMenuOpen(false)
        }
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Helper function to determine if a link is active
  const isActive = (href: string) => {
    const cleanPathname = pathname.replace(/^\/en/, '') || '/'
    const cleanHref = href.replace(/^\/en/, '') || '/'
    
    // Handle root path
    if (cleanHref === '/' && cleanPathname === '/') return true
    if (cleanHref === '/' && cleanPathname !== '/') return false
    
    // Handle other paths
    return cleanPathname.startsWith(cleanHref)
  }

  // Helper function to get link classes
  const getLinkClasses = (href: string, isMobile = false) => {
    const baseClasses = isMobile 
      ? "block py-2 text-sm transition-colors" 
      : "text-sm transition-colors"
    const activeClasses = isActive(href) 
      ? "text-foreground font-medium" 
      : "text-muted-foreground"
    const hoverClasses = isMobile 
      ? "hover:text-foreground hover:underline" 
      : "hover:text-foreground hover:underline"
    
    return `${baseClasses} ${activeClasses} ${hoverClasses}`
  }

  return (
    <header
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between px-3 py-4 md:px-4 md:py-5 lg:px-6">
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 md:flex">
          <Link href={`${basePath}/`} className={getLinkClasses(`${basePath}/`)}>
            {t.home}
          </Link>
          <Link
            href={`${basePath}/mission`}
            className={getLinkClasses(`${basePath}/mission`)}
          >
            {t.mission}
          </Link>
          <Link
            href={`${basePath}/about`}
            className={getLinkClasses(`${basePath}/about`)}
          >
            {t.about}
          </Link>
          <Link
            href={`${basePath}/roadmap`}
            className={getLinkClasses(`${basePath}/roadmap`)}
          >
            {t.roadmap}
          </Link>
          <Link
            href={`${basePath}/database`}
            className={getLinkClasses(`${basePath}/database`)}
          >
            {t.database}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="hover:bg-muted rounded-md p-2 transition-colors md:hidden"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
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

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
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
            className="hover:bg-muted rounded-md border-2 px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ borderColor: 'var(--border)' }}
            aria-label="Toggle language"
          >
            {locale === 'en' ? t.switchToArabic : t.switchToEnglish}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`overflow-hidden border-t transition-all duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ borderColor: 'var(--border)' }}
      >
        <nav className="space-y-3 px-3 py-4">
          <Link
            href={`${basePath}/`}
            className={getLinkClasses(`${basePath}/`, true)}
            onClick={closeMobileMenu}
          >
            {t.home}
          </Link>
          <Link
            href={`${basePath}/mission`}
            className={getLinkClasses(`${basePath}/mission`, true)}
            onClick={closeMobileMenu}
          >
            {t.mission}
          </Link>
          <Link
            href={`${basePath}/about`}
            className={getLinkClasses(`${basePath}/about`, true)}
            onClick={closeMobileMenu}
          >
            {t.about}
          </Link>
          <Link
            href={`${basePath}/roadmap`}
            className={getLinkClasses(`${basePath}/roadmap`, true)}
            onClick={closeMobileMenu}
          >
            {t.roadmap}
          </Link>
          <Link
            href={`${basePath}/database`}
            className={getLinkClasses(`${basePath}/database`, true)}
            onClick={closeMobileMenu}
          >
            {t.database}
          </Link>
        </nav>
      </div>
    </header>
  )
}
