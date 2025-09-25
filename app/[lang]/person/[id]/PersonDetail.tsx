'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import dynamic from 'next/dynamic'

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

type VersionHistory = {
  version: string
  timeUpdated: string
  sourceOfUpdate: string
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
    versionHistory: string
    version: string
    timeUpdated: string
    sourceOfUpdate: string
    selectVersion: string
    recordStatus: string
    active: string
    deleted: string
  }
  dialog: {
    suggestChanges: string
    unsavedChanges: string
    edited: string
    dateOfDeath: string
    category: string
    locationOfDeath: string
    dragZoom: string
    image: string
    noImage: string
    cancel: string
    submit: string
    submitting: string
    idLabel: string
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
  const [editing, setEditing] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<VersionHistory | null>(null)

  // Tooltip state for information symbols
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    text: string
    x: number
    y: number
  }>({ visible: false, text: '', x: 0, y: 0 })

  const showTooltip = useCallback(
    (text: string) => (e: React.MouseEvent) => {
      setTooltip({ visible: true, text, x: e.clientX, y: e.clientY })
    },
    []
  )

  const moveTooltip = useCallback((e: React.MouseEvent) => {
    setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))
  }, [])

  const hideTooltip = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }, [])

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = dict.home[key as keyof typeof dict.home] || key
    if (params && typeof text === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        text = (text as string).replace(`{${k}}`, String(v))
      })
    }
    return text
  }

  const tDialog = (key: string, params?: Record<string, string | number>) => {
    let text = dict.dialog[key as keyof typeof dict.dialog] || key
    if (params && typeof text === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        text = (text as string).replace(`{${k}}`, String(v))
      })
    }
    return text
  }

  const formatDateOnly = useCallback(
    (date: Date | string | null): string => {
      if (!date) return ''
      try {
        const dateObj = date instanceof Date ? date : new Date(date)
        return dateObj.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')
      } catch {
        return String(date)
      }
    },
    [lang]
  )

  // Deterministic date of death between Oct 7, 2023 and now
  const dodForId = useCallback(
    (id: string): string => {
      const start = new Date('2023-10-07T00:00:00Z').getTime()
      const end = Date.now()
      let hash = 0
      for (let i = 0; i < id.length; i++) hash = (hash * 33 + id.charCodeAt(i)) | 0
      const normalized = (Math.abs(hash) % 10000) / 10000
      const ts = Math.floor(start + normalized * (end - start))
      return formatDateOnly(new Date(ts).toISOString())
    },
    [formatDateOnly]
  )

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

  // Generate deterministic mock record status
  const recordStatusForId = useCallback((id: string): 'active' | 'deleted' => {
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 47 + id.charCodeAt(i)) | 0
    // 85% chance of being active, 15% chance of being deleted
    return Math.abs(hash) % 100 < 85 ? 'active' : 'deleted'
  }, [])

  // Generate deterministic mock version history
  const versionHistoryForId = useCallback(
    (id: string): VersionHistory[] => {
      const sources = [
        'Gaza Ministry of Health',
        'Community Verification',
        'Family Report',
        'Hospital Records',
        'Media Verification',
        'UNRWA Records',
        'Local Authority',
        'Witness Account',
      ]

      const versions = ['1.0', '1.1', '1.2', '2.0', '2.1', '2.2', '3.0']

      // Generate deterministic number of versions (2-5)
      let hash = 0
      for (let i = 0; i < id.length; i++) hash = (hash * 43 + id.charCodeAt(i)) | 0
      const numVersions = 2 + (Math.abs(hash) % 4)

      const history: VersionHistory[] = []
      const startDate = new Date('2023-10-07T00:00:00Z')
      const now = new Date()

      for (let i = 0; i < numVersions; i++) {
        // Generate deterministic dates
        const timeOffset = (Math.abs(hash + i * 17) % 10000) / 10000
        const updateDate = new Date(
          startDate.getTime() + timeOffset * (now.getTime() - startDate.getTime())
        )

        // Generate deterministic source and version
        const sourceHash = Math.abs(hash + i * 23) % sources.length
        const versionHash = Math.abs(hash + i * 29) % versions.length

        history.push({
          version: versions[versionHash],
          timeUpdated: updateDate.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US'),
          sourceOfUpdate: sources[sourceHash],
        })
      }

      // Sort by date (newest first)
      return history.sort(
        (a, b) => new Date(b.timeUpdated).getTime() - new Date(a.timeUpdated).getTime()
      )
    },
    [lang]
  )

  const basePath = lang === 'en' ? '/en' : ''
  const category = categoryForId(person.id)
  const geo = geoForId(person.id)
  const hasImage = hasImageForId(person.id)
  const versionHistory = versionHistoryForId(person.id)
  const recordStatus = recordStatusForId(person.id)

  // Set default selected version to the latest (first in sorted array)
  if (!selectedVersion && versionHistory.length > 0) {
    setSelectedVersion(versionHistory[0])
  }

  return (
    <div className="space-y-6">
      {/* Back button and Propose changes button */}
      <div className="flex gap-4">
        <Link href={`${basePath}/database`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} />
            {lang === 'ar' ? 'العودة إلى قاعدة البيانات' : 'Back to Database'}
          </Button>
        </Link>
        <Button onClick={() => setEditing(true)}>{tDialog('suggestChanges')}</Button>
      </div>

      {/* Version History Dropdown */}
      {versionHistory.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <h3 className="text-muted-foreground font-semibold">{t('versionHistory')}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {selectedVersion ? (
                      <>
                        <span>
                          {t('version')}: {selectedVersion.version}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {selectedVersion.timeUpdated}
                        </span>
                      </>
                    ) : (
                      t('selectVersion')
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={lang === 'ar' ? 'end' : 'start'} className="w-80">
                  {versionHistory.map((version, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setSelectedVersion(version)}
                      className="flex flex-col items-start gap-1 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {t('version')}: {version.version}
                        </span>
                        {index === 0 && (
                          <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                            {lang === 'ar' ? 'الأحدث' : 'Latest'}
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {t('timeUpdated')}: {version.timeUpdated}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {t('sourceOfUpdate')}: {version.sourceOfUpdate}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Record Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">{t('recordStatus')}:</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    recordStatus === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {recordStatus === 'active' ? t('active') : t('deleted')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main person card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {person.name}
            {person.enName && person.enName !== person.name && (
              <span className="text-muted-foreground ml-2 text-lg font-normal">
                ({person.enName})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo and Map Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Photo */}
            <div className="space-y-2">
              <h3 className="text-muted-foreground inline-flex items-center gap-1 font-semibold">
                {t('image')}
                <span
                  className="text-muted-foreground cursor-default"
                  aria-label={t('communitySubmission')}
                  onMouseEnter={showTooltip(t('communitySubmission'))}
                  onMouseMove={moveTooltip}
                  onMouseLeave={hideTooltip}
                >
                  ⓘ
                </span>
              </h3>
              <div className="flex justify-center">
                <div className="relative h-64 w-64 overflow-hidden rounded-lg border">
                  {hasImage ? (
                    <Image
                      src={squareImageUrlForId()}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-muted/60 flex h-full w-full items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        {lang === 'ar' ? 'لا توجد صورة' : 'No image available'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="space-y-2">
              <h3 className="text-muted-foreground inline-flex items-center gap-1 font-semibold">
                {t('locationOfDeath')}
                <span
                  className="text-muted-foreground cursor-default"
                  aria-label={t('communitySubmission')}
                  onMouseEnter={showTooltip(t('communitySubmission'))}
                  onMouseMove={moveTooltip}
                  onMouseLeave={hideTooltip}
                >
                  ⓘ
                </span>
              </h3>
              <div className="h-64 w-full overflow-hidden rounded-lg border">
                <LeafletMap
                  lat={geo.lat}
                  lon={geo.lon}
                  onChange={() => {}} // Read-only map
                />
              </div>
              <p className="text-muted-foreground text-center text-sm">
                {geo.lat.toFixed(4)}, {geo.lon.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-muted-foreground font-semibold">{t('id')}</h3>
              <p className="font-mono text-sm">{person.id}</p>
            </div>

            {person.age && (
              <div>
                <h3 className="text-muted-foreground font-semibold">{t('age')}</h3>
                <p>{person.age}</p>
              </div>
            )}

            {person.dob && (
              <div>
                <h3 className="text-muted-foreground font-semibold">{t('dob')}</h3>
                <p>{formatDateOnly(person.dob)}</p>
              </div>
            )}

            {person.sex && (
              <div>
                <h3 className="text-muted-foreground font-semibold">{t('sex')}</h3>
                <p className="uppercase">{person.sex}</p>
              </div>
            )}

            <div>
              <h3 className="text-muted-foreground font-semibold">{t('dod')}</h3>
              <p>{dodForId(person.id)}</p>
            </div>

            <div>
              <h3 className="text-muted-foreground inline-flex items-center gap-1 font-semibold">
                {t('categoryHeader')}
                <span
                  className="text-muted-foreground cursor-default"
                  aria-label={t('communitySubmission')}
                  onMouseEnter={showTooltip(t('communitySubmission'))}
                  onMouseMove={moveTooltip}
                  onMouseLeave={hideTooltip}
                >
                  ⓘ
                </span>
              </h3>
              <p className="capitalize">{category}</p>
            </div>
          </div>

          {/* Source */}
          {person.source && (
            <div>
              <h3 className="text-muted-foreground font-semibold">{t('source')}</h3>
              <p className="text-sm">{person.source}</p>
            </div>
          )}

          {/* Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm">
              {t('dobAndDod', {
                dob: person.dob ? formatDateOnly(person.dob) : 'Unknown',
                dod: dodForId(person.id),
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editing}
        onOpenChange={(o) => {
          if (!o) setEditing(false)
        }}
      >
        <DialogContent className="rounded-2xl p-8 shadow-xl sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1200px]">
          <DialogTitle className="sr-only">{tDialog('suggestChanges')}</DialogTitle>

          <EditForm
            person={person}
            imageUrl={hasImage ? squareImageUrlForId() : null}
            defaultDod={dodForId(person.id)}
            defaultGeo={geo}
            defaultCategory={category}
            dict={dict}
            onClose={() => setEditing(false)}
            onSaved={() => {
              setEditing(false)
              // Optionally refresh the page or show a success message
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="pointer-events-none fixed z-50 rounded bg-black/80 px-2 py-1 text-xs text-white"
          style={{ left: tooltip.x + 12, top: tooltip.y - 32 }}
          role="tooltip"
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}

// Leaflet map (client-only) for selecting location
const LeafletMap = dynamic(
  () => import('@/components/leaflet/LeafletPicker').then((m) => m.LeafletPicker),
  { ssr: false }
)

function EditForm({
  person,
  imageUrl,
  defaultDod,
  defaultGeo,
  defaultCategory,
  dict,
  onClose,
  onSaved,
}: {
  person: Person
  imageUrl?: string | null
  defaultDod: string
  defaultGeo: { lat: number; lon: number }
  defaultCategory: string
  dict: Dictionary
  onClose: () => void
  onSaved: () => void
}) {
  const tDialog = (key: string, params?: Record<string, string | number>) => {
    let text = dict.dialog[key as keyof typeof dict.dialog] || key
    if (params && typeof text === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        text = (text as string).replace(`{${k}}`, String(v))
      })
    }
    return text
  }
  const [saving, setSaving] = useState(false)
  // Mock, community-proposed fields
  const [dod, setDod] = useState<string>(() => String(defaultDod).slice(0, 10))
  const [lat, setLat] = useState<number>(defaultGeo.lat)
  const [lon, setLon] = useState<number>(defaultGeo.lon)
  const [category, setCategory] = useState<string>(defaultCategory)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(imageUrl ?? null)

  const onPickFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f) setPreview(URL.createObjectURL(f))
  }

  // Dirty state indicators
  const isDodDirty = dod !== String(defaultDod).slice(0, 10)
  const isGeoDirty = Math.abs(lat - defaultGeo.lat) > 1e-6 || Math.abs(lon - defaultGeo.lon) > 1e-6
  const isCategoryDirty = category !== defaultCategory
  const isImageDirty = Boolean(file)
  const isAnyDirty = isDodDirty || isGeoDirty || isCategoryDirty || isImageDirty

  const save = async () => {
    setSaving(true)
    try {
      // For now, just log the suggested changes. Backend fields are community-generated.
      // You can wire this to a suggestions endpoint later.
      console.log('Suggested changes', {
        id: person.id,
        dateOfDeath: dod,
        location: { lat, lon },
        category,
        imageSelected: Boolean(file),
      })
      onSaved()
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="bg-muted/30 rounded-md border p-4">
        <div className="mt-1 flex flex-wrap items-baseline gap-3">
          <div className="text-lg font-semibold">{person.name}</div>
          <div className="text-muted-foreground text-sm">{person.enName}</div>
          <div className="ml-auto font-mono text-xs">ID: {person.id}</div>
        </div>
      </div>
      {isAnyDirty && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {tDialog('unsavedChanges')}
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-muted-foreground text-sm">
            {tDialog('dateOfDeath')}
            {isDodDirty && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                {tDialog('edited')}
              </span>
            )}
          </label>
          <input
            type="date"
            className={`bg-background h-11 w-full rounded-md border px-3 text-sm ${
              isDodDirty ? 'ring-1 ring-amber-400' : ''
            }`}
            value={dod}
            onChange={(e) => setDod(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-muted-foreground text-sm">
            {tDialog('category')}
            {isCategoryDirty && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                {tDialog('edited')}
              </span>
            )}
          </label>
          <select
            className={`bg-background h-11 w-full rounded-md border px-3 text-sm ${
              isCategoryDirty ? 'ring-1 ring-amber-400' : ''
            }`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="civilian">civilian</option>
            <option value="medical staff">medical staff</option>
            <option value="journalist">journalist</option>
            <option value="other">other</option>
          </select>
        </div>

        <div className="space-y-3 md:col-span-2">
          <label className="text-muted-foreground text-sm">
            {tDialog('locationOfDeath')}
            {isGeoDirty && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                {tDialog('edited')}
              </span>
            )}
          </label>
          <LeafletMap
            lat={lat}
            lon={lon}
            onChange={({ lat: newLat, lon: newLon }) => {
              setLat(newLat)
              setLon(newLon)
            }}
          />
          <div className="text-muted-foreground text-xs">{tDialog('dragZoom')}</div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-muted-foreground text-sm">
            {tDialog('image')}
            {isImageDirty && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                {tDialog('edited')}
              </span>
            )}
          </label>
          <div className="flex items-center gap-4">
            <div className="w-28">
              {preview ? (
                <Image
                  src={preview}
                  alt={person.name || person.enName || person.id}
                  width={112}
                  height={112}
                  className={`aspect-square w-28 rounded-md border object-cover ${
                    isImageDirty ? 'ring-1 ring-amber-400' : ''
                  }`}
                />
              ) : (
                <div className="bg-muted/60 flex aspect-square w-28 items-center justify-center rounded-md border">
                  <span className="text-muted-foreground text-xs">{tDialog('noImage')}</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onPickFile}
              className="bg-background h-11 w-full rounded-md border px-3 text-sm"
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={saving}
          className="bg-background hover:bg-muted border-input hover:bg-accent hover:text-accent-foreground h-11 rounded-md border px-6 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          {tDialog('cancel')}
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-md px-6 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          {saving ? tDialog('submitting') : tDialog('submit')}
        </button>
      </div>
    </div>
  )
}
