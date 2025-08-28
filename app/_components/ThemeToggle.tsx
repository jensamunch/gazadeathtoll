'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && theme) {
      // Tell AG Grid to switch color schemes per docs
      document.documentElement.setAttribute(
        'data-ag-theme-mode',
        theme === 'dark' ? 'dark' : 'light'
      )
    }
  }, [theme, mounted])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        <Switch checked={false} disabled />
        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      <Switch checked={theme === 'light'} onCheckedChange={(v) => setTheme(v ? 'light' : 'dark')} />
      <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
    </div>
  )
}
