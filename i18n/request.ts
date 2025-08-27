import {getRequestConfig} from 'next-intl/server'
import {notFound} from 'next/navigation'

const SUPPORTED_LOCALES = ['en', 'ar'] as const

export default getRequestConfig(async ({locale}) => {
  if (!SUPPORTED_LOCALES.includes(locale as any)) {
    // Unknown locale → 404 (let middleware handle defaulting)
    notFound()
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})


