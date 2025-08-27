export const locales = ['en', 'ar'] as const
export const defaultLocale = 'ar' as const

// We are not using next-intl's navigation helpers to avoid version export issues.
// The app uses Next.js' useRouter/usePathname directly in the language switcher.


