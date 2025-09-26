import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/src/lib/prisma'
import PersonDetail from './PersonDetail'
import { getDictionary } from '../../dictionaries'

type Props = {
  params: Promise<{ lang: 'ar' | 'en'; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params

  try {
    const person = await prisma.person.findUnique({ where: { id } })
    if (!person) {
      return {
        title: 'Person Not Found',
      }
    }

    const title = lang === 'ar' ? `${person.name} - ضحايا غزة` : `${person.name} - Gaza Death Toll`
    const description =
      lang === 'ar'
        ? `سجل ${person.name} في قاعدة بيانات ضحايا غزة`
        : `Record of ${person.name} in Gaza Death Toll database`

    return {
      title,
      description,
    }
  } catch (error) {
    return {
      title: 'Person Not Found',
    }
  }
}

export default async function PersonPage({ params }: Props) {
  const { lang, id } = await params

  if (!['ar', 'en'].includes(lang)) {
    notFound()
  }

  try {
    const person = await prisma.person.findUnique({ where: { id } })
    if (!person) {
      notFound()
    }

    const dict = await getDictionary(lang)

    return (
      <div className="mx-auto max-w-4xl space-y-8 px-6 pt-2 pb-6">
        <PersonDetail person={person} dict={dict} lang={lang} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching person:', error)
    notFound()
  }
}
