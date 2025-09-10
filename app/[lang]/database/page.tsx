import { getDictionary } from '../dictionaries'
import HomeClient from '../HomeClient'

// Server component wrapper for database page
export default async function DatabasePage({ params }: { params: Promise<{ lang: 'ar' | 'en' }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <HomeClient dict={dict} />
}
