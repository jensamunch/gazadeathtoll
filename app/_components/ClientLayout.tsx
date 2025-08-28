'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

function Header() {
  return (
    <header className="w-full border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between px-6 py-3">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            Palestinian Deaths
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
