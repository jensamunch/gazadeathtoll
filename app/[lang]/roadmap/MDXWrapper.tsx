import { notFound } from 'next/navigation'
import EnContent from './EnContent.mdx'
import ArContent from './ArContent.mdx'

type MDXWrapperProps = {
  lang: 'ar' | 'en'
}

export default function MDXWrapper({ lang }: MDXWrapperProps) {
  if (lang === 'en') {
    return <EnContent />
  } else if (lang === 'ar') {
    return <ArContent />
  } else {
    notFound()
  }
}
