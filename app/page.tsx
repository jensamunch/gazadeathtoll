'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
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
import Slideshow from './_components/Slideshow'

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

// Labels inlined in JSX; no translation object.

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<Person[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'list' | 'gallery'>('list')
  const [editing, setEditing] = useState<Person | null>(null)
  const [showSlideshow, setShowSlideshow] = useState(false)

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
        <div className="flex items-center justify-center py-24">Loading...</div>
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
              List
            </Button>
            <Button
              variant={view === 'gallery' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('gallery')}
            >
              Gallery
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSlideshow(true)}
              disabled={galleryData.length === 0}
            >
              Slideshow
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* no-op for now */
              }}
            >
              Download
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
                placeholder="Filter by name"
              />
            </div>
            <div className="mr-2 flex w-full items-center lg:mr-8">
              <span className="text-muted-foreground text-sm">Age</span>
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
                  aria-label="Maximum age"
                />
              </div>
            </div>
            <div className="flex w-full items-center">
              <span className="text-muted-foreground text-sm">Category</span>
              <select
                className="bg-background h-9 w-full rounded-md border px-2 text-sm md:w-[180px]"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All</option>
                <option value="civilian">civilian</option>
                <option value="medical staff">medical staff</option>
                <option value="journalist">journalist</option>
                <option value="other">other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground my-2 text-sm">
        Loaded {filteredData.length.toLocaleString()} | Total matching {total.toLocaleString()}
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
                ID {sortKey === 'id' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('name')}
                aria-sort={
                  sortKey === 'name' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                Name {sortKey === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('enName')}
                aria-sort={
                  sortKey === 'enName' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                English name {sortKey === 'enName' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('age')}
                aria-sort={
                  sortKey === 'age' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                Age {sortKey === 'age' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('dob')}
                aria-sort={
                  sortKey === 'dob' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                Date of birth {sortKey === 'dob' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('sex')}
                aria-sort={
                  sortKey === 'sex' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                Gender {sortKey === 'sex' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                onClick={() => toggleSort('source')}
                aria-sort={
                  sortKey === 'source' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
                title="Sort"
              >
                Source {sortKey === 'source' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </TableHead>
              <TableHead
                title="Community generated information"
                onClick={() => toggleSort('dod')}
                aria-sort={
                  sortKey === 'dod' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1 font-semibold">
                  Date of death {sortKey === 'dod' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  <span
                    className="text-muted-foreground cursor-help"
                    title="Community generated information"
                    aria-label="Community generated information"
                  >
                    ⓘ
                  </span>
                </span>
              </TableHead>
              <TableHead title="Community generated information">
                <span className="inline-flex items-center gap-1 font-semibold">
                  Location of death
                  <span
                    className="text-muted-foreground cursor-help"
                    title="Community generated information"
                    aria-label="Community generated information"
                  >
                    ⓘ
                  </span>
                </span>
              </TableHead>
              <TableHead
                title="Community generated information"
                onClick={() => toggleSort('category')}
                aria-sort={
                  sortKey === 'category' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                className="cursor-pointer select-none"
              >
                <span className="inline-flex items-center gap-1 font-semibold">
                  Category {sortKey === 'category' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  <span
                    className="text-muted-foreground cursor-help"
                    title="Community generated information"
                    aria-label="Community generated information"
                  >
                    ⓘ
                  </span>
                </span>
              </TableHead>
              <TableHead title="Community generated information">
                <span className="inline-flex items-center gap-1 font-semibold">
                  Image
                  <span
                    className="text-muted-foreground cursor-help"
                    title="Community generated information"
                    aria-label="Community generated information"
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
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center">
                  No results
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((p) => (
                <TableRow
                  key={p.id}
                  className="tooltip cursor-pointer"
                  data-tip="Suggest changes"
                  onClick={() => setEditing(p)}
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
                          <a href="/admin">Upload</a>
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
            <div className="py-10 text-center">Loading...</div>
          ) : galleryData.length === 0 ? (
            <div className="py-10 text-center">No images found</div>
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
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-muted-foreground text-sm">Rows</label>
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
          <DialogTitle className="sr-only">Suggest changes</DialogTitle>

          {editing && (
            <EditForm
              person={editing}
              imageUrl={hasImageForId(editing.id) ? squareImageUrlForId() : null}
              defaultDod={dodForId(editing.id)}
              defaultGeo={geoForId(editing.id)}
              defaultCategory={categoryForId(editing.id)}
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
    </main>
  )
}
// Leaflet map (client-only) for selecting location
const LeafletMap = dynamic(
  () => import('./_components/leaflet/LeafletPicker').then((m) => m.LeafletPicker),
  { ssr: false }
)

function EditForm({
  person,
  imageUrl,
  defaultDod,
  defaultGeo,
  defaultCategory,
  onClose,
  onSaved,
}: {
  person: Person
  imageUrl?: string | null
  defaultDod: string
  defaultGeo: { lat: number; lon: number }
  defaultCategory: string
  onClose: () => void
  onSaved: () => void
}) {
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
          Cancel
        </Button>
        <Button onClick={save} disabled={saving} className="h-11 px-6">
          {saving ? 'Submitting…' : 'Suggest changes'}
        </Button>
      </div>
    </div>
  )
}
