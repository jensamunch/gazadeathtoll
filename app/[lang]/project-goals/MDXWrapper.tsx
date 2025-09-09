'use client'

import React, { useEffect, useState } from 'react'

type MDXWrapperProps = {
  lang: 'ar' | 'en'
}

export default function MDXWrapper({ lang }: MDXWrapperProps) {
  const [Content, setContent] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
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

  if (!Content) {
    return <div>Loading...</div>
  }

  return <Content />
}
