'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowRight,
  Database,
  Users,
  Shield,
  Globe,
  Heart,
  FileText,
  BarChart3,
} from 'lucide-react'

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
    stats: {
      title: string
      totalDeaths: string
      lastUpdated: string
      dataPoints: string
    }
    features: {
      title: string
      subtitle: string
      items: Array<{
        title: string
        description: string
        icon: string
      }>
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
                <Link href={`${basePath}/project-goals`}>{t.hero.secondaryCta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">{t.stats.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-destructive mb-2 text-4xl font-bold">30,000+</div>
                <p className="text-muted-foreground">{t.stats.totalDeaths}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-primary mb-2 text-4xl font-bold">100%</div>
                <p className="text-muted-foreground">{t.stats.lastUpdated}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-2 text-4xl font-bold text-green-600 dark:text-green-400">
                  50+
                </div>
                <p className="text-muted-foreground">{t.stats.dataPoints}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold">{t.features.title}</h2>
            <p className="text-muted-foreground mt-4 text-lg">{t.features.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((feature, index) => {
              const IconComponent = getIconComponent(feature.icon)
              return (
                <Card key={index} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <IconComponent className="text-primary h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
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
              <Link href={`${basePath}/advisory-team`}>
                {t.cta.secondaryButton}
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper function to get icon components
function getIconComponent(iconName: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    database: Database,
    users: Users,
    shield: Shield,
    globe: Globe,
    fileText: FileText,
    barChart: BarChart3,
  }
  return icons[iconName] || Database
}
