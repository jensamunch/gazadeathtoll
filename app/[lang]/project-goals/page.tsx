import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import MDXWrapper from './MDXWrapper'

type Props = {
  params: Promise<{ lang: 'ar' | 'en' }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const title = lang === 'ar' ? 'أهداف المشروع' : 'Project Goals'

  return {
    title,
  }
}

export default async function ProjectGoalsPage({ params }: Props) {
  const { lang } = await params

  if (!['ar', 'en'].includes(lang)) {
    notFound()
  }

  return (
    <article className="prose lg:prose-xl">
      <MDXWrapper lang={lang} />
    </article>
  )
}
