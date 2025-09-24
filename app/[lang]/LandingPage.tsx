'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Heart } from 'lucide-react'

type Dictionary = {
  metadata: {
    title: string
    description: string
  }
  nav: {
    title: string
    home: string
    mission: string
    about: string
    advisoryTeam: string
    faq: string
    database: string
    switchToArabic: string
    switchToEnglish: string
  }
  landing: {
    hero: {
      title: string
      subtitle: string
      description: string
      cta: string
      secondaryCta: string
    }
    mission: {
      title: string
      description: string
      principles: Array<{
        title: string
        description: string
      }>
    }
    cta: {
      title: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
  }
}

type LandingPageProps = {
  dict: Dictionary
  locale: 'ar' | 'en'
}

export default function LandingPage({ dict, locale }: LandingPageProps) {
  const t = dict.landing
  // Determine base path based on the locale
  const basePath = locale === 'en' ? '/en' : ''

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{t.hero.title}</h1>
            <p className="text-muted-foreground mt-6 text-lg leading-8 sm:text-xl">
              {t.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="px-8 py-6 text-lg">
                <Link href={`${basePath}/database`}>
                  {t.hero.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                <Link href={`${basePath}/mission`}>{t.hero.secondaryCta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold">{t.mission.title}</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg">
              {t.mission.description}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {t.mission.principles.map((principle, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Heart className="text-destructive h-6 w-6" />
                    {principle.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
