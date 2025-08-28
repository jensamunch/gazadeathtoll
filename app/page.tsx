'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  }, [page, limit, nameFilter, ageMax, categoryFilter])

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
    const categories = ['civilian', 'medical staff', 'journalist', 'child']
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 37 + id.charCodeAt(i)) | 0
    const idx = Math.abs(hash) % categories.length
    return categories[idx]
  }, [])

  const filteredData = useMemo(() => data, [data])

  const galleryData = useMemo(() => filteredData, [filteredData])

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
          </div>
        </div>
        <div className="lg:ml-auto mt-2 lg:mt-0 flex items-center">
          <div className="inline-flex items-center">
            <div className="flex w-full items-center mr-2 lg:mr-8">
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
            <div className="flex w-full items-center mr-2 lg:mr-8">
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
                <option value="child">child</option>
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>English name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Date of birth</TableHead>
              <TableHead className="text-red-600" title="mock data">Date of death</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead className="text-red-600" title="mock data">Category</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-red-600" title="mock data">Image</TableHead>
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
              filteredData.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setEditing(p)}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.enName}</TableCell>
                  <TableCell>{p.age ?? ''}</TableCell>
                  <TableCell>{formatDateOnly(p.dob)}</TableCell>
                  <TableCell>{dodForId(p.id)}</TableCell>
                  <TableCell className="uppercase">{p.sex ?? ''}</TableCell>
                  <TableCell className="capitalize">{categoryForId(p.id)}</TableCell>
                  <TableCell className="max-w-[20ch] truncate" title={p.source ?? undefined}>
                    {p.source ?? ''}
                  </TableCell>
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
        <DialogContent className="sm:max-w-[900px] md:max-w-[1100px] lg:max-w-[1200px] p-8 rounded-2xl shadow-xl">

          {editing && (
            <EditForm
              person={editing}
              imageUrl={hasImageForId(editing.id) ? squareImageUrlForId() : null}
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

function EditForm({
  person,
  imageUrl,
  onClose,
  onSaved,
}: {
  person: Person
  imageUrl?: string | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<Person>(person)
  const [saving, setSaving] = useState(false)

  const updateField = <K extends keyof Person>(key: K, value: Person[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/rows', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const j = await res.json()
      if (!res.ok || !j.ok) throw new Error(j.error || 'Failed to save')
      onSaved()
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-start gap-6">
        <div className="w-36">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={person.name || person.enName || person.id}
              width={144}
              height={144}
              className="aspect-square w-36 rounded-xl border object-cover shadow-sm"
            />
          ) : (
            <div className="bg-muted/60 flex aspect-square w-36 items-center justify-center rounded-xl border">
              <Button asChild variant="outline" size="sm">
                <a href="/admin">Upload</a>
              </Button>
            </div>
          )}
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm">Name</label>
            <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm">English name</label>
            <Input value={form.enName} onChange={(e) => updateField('enName', e.target.value)} className="h-11" />
          </div>
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm">Age</label>
            <Input
              type="number"
              value={form.age ?? ''}
              onChange={(e) =>
                updateField('age', e.target.value ? parseInt(e.target.value, 10) : null)
              }
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm">Date of birth</label>
            <Input
              value={form.dob ? String(form.dob).slice(0, 10) : ''}
              onChange={(e) =>
                updateField('dob', e.target.value ? new Date(e.target.value).toISOString() : null)
              }
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm">Sex</label>
            <select
              className="bg-background h-11 w-full rounded-md border px-3 text-sm"
              value={form.sex ?? ''}
              onChange={(e) => updateField('sex', (e.target.value as 'm' | 'f') || null)}
            >
              <option value="">Unknown</option>
              <option value="m">m</option>
              <option value="f">f</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm">Source</label>
            <Input value={form.source ?? ''} onChange={(e) => updateField('source', e.target.value)} className="h-11" />
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={saving} className="h-11 px-6">
          Cancel
        </Button>
        <Button onClick={save} disabled={saving} className="h-11 px-6">
          {saving ? 'Proposing...' : 'Propose edit'}
        </Button>
      </div>
    </div>
  )
}
