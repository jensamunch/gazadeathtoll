'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Person = {
  id: string
  name: string
  enName: string
  age?: number | null
  dob?: Date | null
  sex?: 'm' | 'f' | null
  source?: string | null
  createdAt: Date
}

type Dictionary = {
  home: {
    id: string
    name: string
    enName: string
    age: string
    dob: string
    sex: string
    source: string
    dod: string
    locationOfDeath: string
    categoryHeader: string
    image: string
    dobAndDod: string
    civilian: string
    medicalStaff: string
    journalist: string
    other: string
  }
  common: {
    loading: string
  }
}

type PersonDetailProps = {
  person: Person
  dict: Dictionary
  lang: 'ar' | 'en'
}

export default function PersonDetail({ person, dict, lang }: PersonDetailProps) {
  const t = (key: string, params?: Record<string, string | number>) => {
    let text = dict.home[key as keyof typeof dict.home] || key
    if (params && typeof text === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        text = (text as string).replace(`{${k}}`, String(v))
      })
    }
    return text
  }

  const formatDateOnly = useCallback((date: Date | string | null): string => {
    if (!date) return ''
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      return dateObj.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')
    } catch {
      return String(date)
    }
  }, [lang])

  // Deterministic date of death between Oct 7, 2023 and now
  const dodForId = useCallback((id: string): string => {
    const start = new Date('2023-10-07T00:00:00Z').getTime()
    const end = Date.now()
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 33 + id.charCodeAt(i)) | 0
    const normalized = (Math.abs(hash) % 10000) / 10000
    const ts = Math.floor(start + normalized * (end - start))
    return formatDateOnly(new Date(ts).toISOString())
  }, [formatDateOnly])

  // Deterministic category assignment
  const categoryForId = useCallback((id: string): string => {
    const categories = ['civilian', 'medical staff', 'journalist', 'other']
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 37 + id.charCodeAt(i)) | 0
    const idx = Math.abs(hash) % categories.length
    return categories[idx]
  }, [])

  // Deterministic mock geo location (lat/long within Gaza region)
  const geoForId = useCallback((id: string): { lat: number; lon: number } => {
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
    const n1 = Math.abs(hash % 1000) / 1000
    const n2 = Math.abs((hash >> 3) % 1000) / 1000
    // Gaza Strip bounds: 31.2-31.6°N, 34.2-34.5°E
    const lat = 31.2 + n1 * 0.4
    const lon = 34.2 + n2 * 0.3
    return { lat, lon }
  }, [])

  // Check if person has an image
  const hasImageForId = useCallback((id: string): boolean => {
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 41 + id.charCodeAt(i)) | 0
    return Math.abs(hash) % 3 === 0 // 1/3 chance
  }, [])

  const squareImageUrlForId = useCallback(() => {
    return `/placeholder-male-square.png`
  }, [])

  const basePath = lang === 'en' ? '/en' : ''
  const category = categoryForId(person.id)
  const geo = geoForId(person.id)
  const hasImage = hasImageForId(person.id)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href={`${basePath}/database`}>
        <Button variant="outline" className="gap-2">
          <ArrowLeft size={16} />
          {lang === 'ar' ? 'العودة إلى قاعدة البيانات' : 'Back to Database'}
        </Button>
      </Link>

      {/* Main person card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {person.name}
            {person.enName && person.enName !== person.name && (
              <span className="ml-2 text-lg font-normal text-muted-foreground">
                ({person.enName})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image */}
          {hasImage && (
            <div className="flex justify-center">
              <div className="relative h-48 w-48 overflow-hidden rounded-lg">
                <Image
                  src={squareImageUrlForId()}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-muted-foreground">{t('id')}</h3>
              <p className="font-mono text-sm">{person.id}</p>
            </div>
            
            {person.age && (
              <div>
                <h3 className="font-semibold text-muted-foreground">{t('age')}</h3>
                <p>{person.age}</p>
              </div>
            )}

            {person.dob && (
              <div>
                <h3 className="font-semibold text-muted-foreground">{t('dob')}</h3>
                <p>{formatDateOnly(person.dob)}</p>
              </div>
            )}

            {person.sex && (
              <div>
                <h3 className="font-semibold text-muted-foreground">{t('sex')}</h3>
                <p className="uppercase">{person.sex}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-muted-foreground">{t('dod')}</h3>
              <p>{dodForId(person.id)}</p>
            </div>

            <div>
              <h3 className="font-semibold text-muted-foreground">{t('categoryHeader')}</h3>
              <p className="capitalize">{category}</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold text-muted-foreground">{t('locationOfDeath')}</h3>
            <p className="font-mono text-sm">
              {geo.lat.toFixed(4)}, {geo.lon.toFixed(4)}
            </p>
          </div>

          {/* Source */}
          {person.source && (
            <div>
              <h3 className="font-semibold text-muted-foreground">{t('source')}</h3>
              <p className="text-sm">{person.source}</p>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm">
              {t('dobAndDod', {
                dob: person.dob ? formatDateOnly(person.dob) : 'Unknown',
                dod: dodForId(person.id)
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
