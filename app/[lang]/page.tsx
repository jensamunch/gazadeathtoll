import { getDictionary } from './dictionaries'
import LandingPage from './LandingPage'

// Server component wrapper
export default async function Home({ params }: { params: Promise<{ lang: 'ar' | 'en' }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <LandingPage dict={dict} locale={lang} />
}
