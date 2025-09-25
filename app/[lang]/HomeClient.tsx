'use client'
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import Slideshow from '@/components/Slideshow'

type Person = {
  id: string
  name: string
  enName: string
  age?: number | null
  dob?: string | null
  sex?: 'm' | 'f' | null
  source?: string | null
  createdAt: string
}

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
  advisoryTeam: {
    title: string
    productLeader: string
    productLeaderDesc: string
    geoDataTech: string
    geoDataTechDesc: string
    visualArtist: string
    visualArtistDesc: string
    strategistTechBuilder: string
    strategistTechBuilderDesc: string
    technicalLead: string
    technicalLeadDesc: string
    directorOfVideo: string
    directorOfVideoDesc: string
    internationalLawyer: string
    internationalLawyerDesc: string
  }
  home: {
    [key: string]: string
  }
  common: {
    [key: string]: string
  }
  dialog: {
    [key: string]: string
  }
}

type HomeProps = {
  dict: Dictionary
}

export default function HomeClient({ dict }: HomeProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<Person[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'list' | 'gallery'>('list')
  const [editing, setEditing] = useState<Person | null>(null)
  const [showSlideshow, setShowSlideshow] = useState(false)
  // Use dictionary-based translations with interpolation support
  const t = (key: string, params?: Record<string, string | number>) => {
    let text = dict.home[key as keyof typeof dict.home] || key
    if (params && typeof text === 'string') {
      Object.entries(params).forEach(([k, v]) => {
        text = (text as string).replace(`{${k}}`, String(v))
      })
    }
    return text
  }

  const tCommon = (key: string, params?: Record<string, string | number>) => {
    let text = dict.common[key as keyof typeof dict.common] || key
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

  // Instant, cursor-following tooltip
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    text: string
    x: number
    y: number
  }>({ visible: false, text: '', x: 0, y: 0 })

  const showTooltip = useCallback(
    (text: string) => (e: ReactMouseEvent) => {
      setTooltip({ visible: true, text, x: e.clientX, y: e.clientY })
    },
    []
  )

  const moveTooltip = useCallback((e: ReactMouseEvent) => {
    setTooltip((t) => (t.visible ? { ...t, x: e.clientX, y: e.clientY } : t))
  }, [])

  const hideTooltip = useCallback(() => {
    setTooltip((t) => ({ ...t, visible: false }))
  }, [])

  // Navigation to person detail page
  const handlePersonClick = useCallback((person: Person) => {
    const basePath = pathname.startsWith('/en') ? '/en' : ''
    router.push(`${basePath}/people/${person.id}`)
  }, [router, pathname])

  // Filters
  const [nameFilter, setNameFilter] = useState('')
  const [ageMax, setAgeMax] = useState<number | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [sortKey, setSortKey] = useState<
    'id' | 'name' | 'enName' | 'age' | 'dob' | 'dod' | 'sex' | 'category' | 'source'
  >('dod')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDateOnly = (value: unknown): string => {
    if (value == null) return ''
    const raw = String(value)
    if (raw.includes('T')) return raw.split('T')[0]
    const d = new Date(raw)
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }
    return raw
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(limit))
      if (nameFilter.trim()) params.set('name', nameFilter.trim())
      if (ageMax != null) {
        params.set('age', `0-${ageMax}`)
      }
      if (categoryFilter) params.set('category', categoryFilter)
      params.set('sortKey', sortKey)
      params.set('sortDir', sortDir)

      const res = await fetch(`/api/rows?${params.toString()}`)
      const json = await res.json()
      const rows: Person[] = json.data || []
      setData(rows)
      setTotal(json.pagination?.total ?? rows.length)
    } catch (e) {
      console.error('Failed to fetch rows', e)
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [page, limit, nameFilter, ageMax, categoryFilter, sortKey, sortDir])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalPages = useMemo(
    () => (total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1),
    [total, limit]
  )

  // Pseudo-random but stable image assignment per row id
  const hasImageForId = useCallback((id: string): boolean => {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) | 0
    }
    return (hash & 1) === 0
  }, [])

  // Placeholder image only; no per-id mapping now
  // (kept for potential future expansion)
  const squareImageUrlForId = useCallback((): string => {
    return `/placeholder-male-square.png`
  }, [])

  // Deterministic date of death between Oct 7, 2023 and now
  const dodForId = useCallback((id: string): string => {
    const start = new Date('2023-10-07T00:00:00Z').getTime()
    const end = Date.now()
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 33 + id.charCodeAt(i)) | 0
    const normalized = (Math.abs(hash) % 10000) / 10000
    const ts = Math.floor(start + normalized * (end - start))
    return formatDateOnly(new Date(ts).toISOString())
  }, [])

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
    // Simple hash -> 0..1
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
    const n1 = Math.abs(hash % 1000) / 1000 // 0..0.999
    const n2 = Math.abs((hash >> 3) % 1000) / 1000
    // Gaza approx bounds
    const latMin = 31.2,
      latMax = 31.6
    const lonMin = 34.2,
      lonMax = 34.6
    const lat = latMin + n1 * (latMax - latMin)
    const lon = lonMin + n2 * (lonMax - lonMin)
    return { lat, lon }
  }, [])

  const filteredData = useMemo(() => data, [data])
  const sortedData = useMemo(() => filteredData, [filteredData])
  const toggleSort = useCallback(
    (key: typeof sortKey) => {
      setSortDir((prevDir) => (sortKey === key ? (prevDir === 'asc' ? 'desc' : 'asc') : 'asc'))
      setSortKey(key)
    },
    [sortKey]
  )

  const galleryData = useMemo(() => sortedData, [sortedData])

  if (!mounted) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center py-24">{tCommon('loading')}</div>
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="flex w-full flex-wrap lg:flex-nowrap">
        <div className="flex items-center">
          <div className="inline-flex items-center gap-1">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              {t('list')}
            </Button>
            <Button
              variant={view === 'gallery' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('gallery')}
            >
              {t('gallery')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSlideshow(true)}
              disabled={galleryData.length === 0}
            >
              {t('slideshow')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* no-op for now */
              }}
            >
              {t('download')}
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center lg:mt-0 lg:ml-auto">
          <div className="inline-flex items-center">
            <div className="mr-2 flex w-full items-center lg:mr-8">
              <Input
                className="w-full md:w-56"
                value={nameFilter}
                onChange={(e) => {
                  setNameFilter(e.target.value)
                  setPage(1)
                }}
                placeholder={t('filterByName')}
              />
            </div>
            <div className="mr-2 flex w-full items-center lg:mr-8">
              <span className="text-muted-foreground mr-2 text-sm">{t('age')}</span>
              <div className="flex w-full items-center gap-2 md:w-auto">
                <input
                  type="range"
                  min={0}
                  max={120}
                  step={1}
                  value={ageMax ?? 120}
                  className="w-full md:w-48"
                  onChange={(e) => {
                    const v = e.target.valueAsNumber
                    const clamped = Math.max(0, Math.min(120, v))
                    setAgeMax(clamped)
                    setPage(1)
                  }}
                  aria-label={t('maxAgeAria')}
                />
              </div>
            </div>
            <div className="flex w-full items-center">
              <span className="text-muted-foreground mr-2 text-sm">{t('category')}</span>
              <select
                className="bg-background h-9 w-full rounded-md border px-2 text-sm md:w-[180px]"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">{t('all')}</option>
                <option value="civilian">{t('civilian')}</option>
                <option value="medical staff">{t('medicalStaff')}</option>
                <option value="journalist">{t('journalist')}</option>
                <option value="other">{t('other')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground my-2 text-sm">
        {t('loadedCount', {
          count: filteredData.length.toLocaleString(),
          total: total.toLocaleString(),
        })}
      </div>

      {view === 'list' ? (
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => toggleSort('id')}
                aria-sort={
                  sortKey === 'id' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                {t('id')} {sortKey === 'id' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('name')}
                aria-sort={
                  sortKey === 'name' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                {t('name')} {sortKey === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('enName')}
                aria-sort={
                  sortKey === 'enName' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                {t('enName')} {sortKey === 'enName' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('age')}
                aria-sort={
                  sortKey === 'age' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                {t('ageHeader')} {sortKey === 'age' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('dob')}
                aria-sort={
                  sortKey === 'dob' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                {t('dob')} {sortKey === 'dob' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('sex')}
                aria-sort={
                  sortKey === 'sex' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                {t('sex')} {sortKey === 'sex' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('source')}
                aria-sort={
                  sortKey === 'source' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                {t('source')} {sortKey === 'source' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('dod')}
                aria-sort={
                  sortKey === 'dod' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1 font-semibold">
                  {t('dod')} {sortKey === 'dod' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  <span
                    className="text-muted-foreground cursor-default"
                    aria-label={t('communitySubmission')}
                    onMouseEnter={showTooltip(t('communitySubmission'))}
                    onMouseMove={moveTooltip}
                    onMouseLeave={hideTooltip}
                  >
                    ⓘ
                  </span>
                </span>
              </TableHead>
              <TableHead>
                <span className="inline-flex items-center gap-1 font-semibold">
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
                </span>
              </TableHead>
              <TableHead
                onClick={() => toggleSort('category')}
                aria-sort={
                  sortKey === 'category' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1 font-semibold">
                  {t('categoryHeader')}{' '}
                  {sortKey === 'category' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  <span
                    className="text-muted-foreground cursor-default"
                    aria-label={t('communitySubmission')}
                    onMouseEnter={showTooltip(t('communitySubmission'))}
                    onMouseMove={moveTooltip}
                    onMouseLeave={hideTooltip}
                  >
                    ⓘ
                  </span>
                </span>
              </TableHead>
              <TableHead>
                <span className="inline-flex items-center gap-1 font-semibold">
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
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center">
                  {tCommon('loading')}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center">
                  {tCommon('noResults')}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => handlePersonClick(p)}
                  onMouseEnter={showTooltip(t('submitChangesTooltip'))}
                  onMouseMove={moveTooltip}
                  onMouseLeave={hideTooltip}
                >
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.enName}</TableCell>
                  <TableCell>{p.age ?? ''}</TableCell>
                  <TableCell>{formatDateOnly(p.dob)}</TableCell>
                  <TableCell className="uppercase">{p.sex ?? ''}</TableCell>
                  <TableCell className="max-w-[20ch] truncate" title={p.source ?? undefined}>
                    {p.source ?? ''}
                  </TableCell>
                  <TableCell>{dodForId(p.id)}</TableCell>
                  <TableCell>
                    {(() => {
                      const g = geoForId(p.id)
                      return `${g.lat.toFixed(4)}, ${g.lon.toFixed(4)}`
                    })()}
                  </TableCell>
                  <TableCell className="capitalize">{categoryForId(p.id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {hasImageForId(p.id) ? (
                        <Image
                          src={squareImageUrlForId()}
                          alt={p.name || p.enName || p.id}
                          width={32}
                          height={32}
                          className="size-8 rounded-md object-cover"
                        />
                      ) : (
                        <Button asChild variant="outline" size="sm">
                          <Link href="/admin">{tCommon('upload')}</Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      ) : (
        <div>
          {loading ? (
            <div className="py-10 text-center">{tCommon('loading')}</div>
          ) : galleryData.length === 0 ? (
            <div className="py-10 text-center">{tCommon('noImagesFound')}</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {galleryData.map((p) => (
                <div key={p.id} className="overflow-hidden rounded-md border">
                  <Image
                    src={squareImageUrlForId()}
                    alt={p.name || p.enName || p.id}
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-2">
                    <div className="truncate font-medium" title={p.name}>
                      {p.name}
                    </div>
                    <div className="text-muted-foreground truncate text-xs" title={p.enName}>
                      {p.enName}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {p.age ?? ''} {p.sex ? `• ${String(p.sex).toUpperCase()}` : ''} •{' '}
                      {categoryForId(p.id)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Date of birth {formatDateOnly(p.dob)} • Date of death {dodForId(p.id)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          {tCommon('pageOf', { page, totalPages })}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-muted-foreground text-sm">{tCommon('rows')}</label>
            <select
              className="bg-background h-9 rounded-md border px-2 text-sm"
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10))
                setPage(1)
              }}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page <= 1}>
            {'<<'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            {'<'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            {'>'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
          >
            {'>>'}
          </Button>
        </div>
      </div>

      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null)
        }}
      >
        <DialogContent className="rounded-2xl p-8 shadow-xl sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1200px]">
          <DialogTitle className="sr-only">{tDialog('suggestChanges')}</DialogTitle>

          {editing && (
            <EditForm
              person={editing}
              imageUrl={hasImageForId(editing.id) ? squareImageUrlForId() : null}
              defaultDod={dodForId(editing.id)}
              defaultGeo={geoForId(editing.id)}
              defaultCategory={categoryForId(editing.id)}
              dict={dict}
              onClose={() => setEditing(null)}
              onSaved={() => {
                setEditing(null)
                fetchData()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {showSlideshow && galleryData.length > 0 && (
        <Slideshow
          data={galleryData}
          squareImageUrlForId={squareImageUrlForId}
          onClose={() => setShowSlideshow(false)}
        />
      )}
      {tooltip.visible && (
        <div
          className="pointer-events-none fixed z-50 rounded bg-black/80 px-2 py-1 text-xs text-white"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          role="tooltip"
        >
          {tooltip.text}
        </div>
      )}
    </main>
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
          You have unsaved changes
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-muted-foreground text-sm">
            Date of death
            {isDodDirty && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                edited
              </span>
            )}
          </label>
          <Input
            type="date"
            className={`h-11 ${isDodDirty ? 'ring-1 ring-amber-400' : ''}`}
            value={dod}
            onChange={(e) => setDod(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-muted-foreground text-sm">
            Category
            {isCategoryDirty && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                edited
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
            Location of death
            {isGeoDirty && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                edited
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
          <div className="text-muted-foreground text-xs">
            Drag/zoom the map, click to place the marker.
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-muted-foreground text-sm">
            Image
            {isImageDirty && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                edited
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
                  <span className="text-muted-foreground text-xs">No image</span>
                </div>
              )}
            </div>
            <Input type="file" accept="image/*" onChange={onPickFile} className="h-11" />
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={saving} className="h-11 px-6">
          {tDialog('cancel')}
        </Button>
        <Button onClick={save} disabled={saving} className="h-11 px-6">
          {saving ? tDialog('submitting') : tDialog('submit')}
        </Button>
      </div>
    </div>
  )
}
