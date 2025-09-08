'use client'
import Header from './Header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        {children}
      </main>
    </>
  )
}
