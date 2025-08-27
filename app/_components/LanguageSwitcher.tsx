'use client'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  
  const isEnglish = pathname.startsWith('/en')
  const currentLang = isEnglish ? 'en' : 'ar'
  
  const switchLanguage = () => {
    if (isEnglish) {
      // Switch to Arabic - remove /en prefix
      const newPath = pathname.replace(/^\/en/, '') || '/'
      router.push(newPath)
    } else {
      // Switch to English - add /en prefix
      const newPath = `/en${pathname === '/' ? '' : pathname}`
      router.push(newPath)
    }
  }
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={switchLanguage}
      className="min-w-[60px]"
    >
      {currentLang === 'ar' ? 'EN' : 'عربي'}
    </Button>
  )
}