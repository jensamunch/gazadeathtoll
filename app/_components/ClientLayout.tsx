'use client'
import Header from './Header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="px-6 py-8 md:px-10 md:py-12 lg:px-16 lg:py-16 xl:px-24 2xl:px-32">
        {children}
      </main>
    </>
  )
}
