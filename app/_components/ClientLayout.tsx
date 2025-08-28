'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function ClientLayout({ 
  children
}: { 
  children: React.ReactNode
}) {
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
      <div className="px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-semibold">Palestinian Deaths</Link>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Admin</Link>
          <Link href="/whoami" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" target="_blank">Whoami</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
