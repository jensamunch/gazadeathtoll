'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Database, Users, Heart } from 'lucide-react'

type Dictionary = {
  metadata: {
    title: string
    description: string
  }
  nav: {
    title: string
    docs: string
    advisoryTeam: string
    faq: string
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
  faq: {
    title: string
    questions: Array<{
      question: string
      answer: string
    }>
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
                <Link href={`${basePath}/about`}>{t.hero.secondaryCta}</Link>
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

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">{t.cta.title}</h2>
          <p className="text-muted-foreground mb-8 text-lg">{t.cta.description}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href={`${basePath}/database`}>
                {t.cta.primaryButton}
                <Database className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
              <Link href={`${basePath}/about`}>
                {t.cta.secondaryButton}
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold">{dict.faq.title}</h2>
          <div className="space-y-4">
            {dict.faq.questions.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-left text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
