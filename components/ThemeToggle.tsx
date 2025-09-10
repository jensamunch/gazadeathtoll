'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded border p-2"
        style={{ borderColor: 'var(--border)' }}
        aria-label="Toggle theme"
      >
        <Moon className="h-4 w-4" />
      </button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="hover:bg-muted rounded border p-2 transition-colors"
      style={{ borderColor: 'var(--border)' }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  )
}
