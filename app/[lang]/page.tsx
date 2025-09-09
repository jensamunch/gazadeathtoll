import { getDictionary } from './dictionaries'
import HomeClient from './HomeClient'

// Server component wrapper
export default async function Home({ params }: { params: Promise<{ lang: 'ar' | 'en' }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <HomeClient dict={dict} />
}
