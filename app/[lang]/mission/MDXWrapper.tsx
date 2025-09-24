'use client'

import React, { useEffect, useState } from 'react'
import { getDictionary } from '../dictionaries'

type MDXWrapperProps = {
  lang: 'ar' | 'en'
}

export default function MDXWrapper({ lang }: MDXWrapperProps) {
  const [Content, setContent] = useState<React.ComponentType | null>(null)
  const [dict, setDict] = useState<any>(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const dictionary = await getDictionary(lang)
        setDict(dictionary)

        if (lang === 'ar') {
          const { default: ArContent } = await import('./ArContent.mdx')
          setContent(() => ArContent)
        } else {
          const { default: EnContent } = await import('./EnContent.mdx')
          setContent(() => EnContent)
        }
      } catch (error) {
        console.error('Error loading MDX content:', error)
      }
    }
    loadContent()
  }, [lang])

  if (!Content || !dict) {
    return <div>{dict?.common?.loading || 'Loading...'}</div>
  }

  return <Content />
}
