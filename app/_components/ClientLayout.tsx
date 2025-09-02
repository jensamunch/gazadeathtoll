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
            Palestinian Deaths since Oct. 7 2023
          </Link>
          <Link
            href="https://www.notion.so/Online-document-of-Palestinian-deaths-since-Oct-7-2023-25e83c5e0bf3807a82aef13eeb179c0d?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground text-sm hover:underline"
          >
            Project documentation
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
