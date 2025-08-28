'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Slideshow from './_components/Slideshow'

type Person = {
  id: string
  name: string
  enName: string
  age?: number
  dob?: string
  sex?: 'm' | 'f'
  source?: string
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
  }, [page, limit, nameFilter, ageMax])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalPages = useMemo(() => (total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1), [total, limit])

  // Pseudo-random but stable image assignment per row id
  const hasImageForId = useCallback((id: string): boolean => {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) | 0
    }
    return (hash & 1) === 0
  }, [])

  // Deterministic square image URL for gallery using picsum seed
  const seedImageNames = useMemo(
    () => [
      'slice_final_1_1.png',
      'slice_final_1_2.png',
      'slice_final_1_3.png',
      'slice_final_2_1.png',
      'slice_final_2_2.png',
      'slice_final_2_3.png',
      'slice_final_3_1.png',
      'slice_final_3_2.png',
      'slice_final_3_3.png',
    ],
    []
  )

  const squareImageUrlForId = useCallback((id: string, _size: number = 600): string => {
    // Map id to deterministic index
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
    const idx = Math.abs(hash) % seedImageNames.length
    const name = seedImageNames[idx]
    return `/api/seed/${name}`
  }, [seedImageNames])

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

  const galleryData = useMemo(() => data.filter((p) => hasImageForId(p.id)), [data, hasImageForId])

  if (!mounted) {
    return (
      <main className="p-6">
        <div className="py-24 flex items-center justify-center">Loading...</div>
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-2">
        <Card className="py-3 gap-3">
          <CardHeader className="py-2">
            <CardTitle>Display</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1">
                  <Button variant={view === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setView('list')}>List</Button>
                  <Button variant={view === 'gallery' ? 'default' : 'outline'} size="sm" onClick={() => setView('gallery')}>Gallery</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowSlideshow(true)} disabled={galleryData.length === 0}>Slideshow</Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Rows</label>
                <select className="h-9 rounded-md border bg-background px-2 text-sm" value={limit} onChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(1) }}>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 py-3 gap-3">
          <CardHeader className="py-2">
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Input className="w-56" value={nameFilter} onChange={(e) => { setNameFilter(e.target.value); setPage(1) }} placeholder="Filter by name" />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Age</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={120}
                    step={1}
                    value={ageMax ?? 120}
                    onChange={(e) => {
                      const v = e.target.valueAsNumber
                      const clamped = Math.max(0, Math.min(120, v))
                      setAgeMax(clamped)
                      setPage(1)
                    }}
                    aria-label="Maximum age"
                  />
                  <span className="text-muted-foreground text-xs">0 - {(ageMax ?? 120).toString()}</span>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="my-2 text-sm text-muted-foreground">
        Loaded {data.length.toLocaleString()} | Total matching {total.toLocaleString()}
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
              <TableHead>Date of death</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center">Loading...</TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center">No results</TableCell>
              </TableRow>
            ) : (
              data.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setEditing(p)}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.enName}</TableCell>
                  <TableCell>{p.age ?? ''}</TableCell>
                  <TableCell>{formatDateOnly(p.dob)}</TableCell>
                  <TableCell>{dodForId(p.id)}</TableCell>
                  <TableCell className="uppercase">{p.sex ?? ''}</TableCell>
                  <TableCell className="capitalize">{categoryForId(p.id)}</TableCell>
                  <TableCell className="truncate max-w-[20ch]" title={p.source}>{p.source}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {hasImageForId(p.id) ? (
                        <img
                          src={squareImageUrlForId(p.id, 80)}
                          alt={p.name || p.enName || p.id}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {galleryData.map((p) => (
                <div key={p.id} className="rounded-md border overflow-hidden">
                  <img
                    src={squareImageUrlForId(p.id, 600)}
                    alt={p.name || p.enName || p.id}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-2">
                    <div className="font-medium truncate" title={p.name}>{p.name}</div>
                    <div className="text-muted-foreground text-xs truncate" title={p.enName}>{p.enName}</div>
                    <div className="text-muted-foreground text-xs">{p.age ?? ''} {p.sex ? `• ${String(p.sex).toUpperCase()}` : ''} • {categoryForId(p.id)}</div>
                    <div className="text-muted-foreground text-xs">Date of birth {formatDateOnly(p.dob)} • Date of death {dodForId(p.id)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page <= 1}>{'<<'}</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>{'<'}</Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>{'>'}</Button>
          <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page >= totalPages}>{'>>'}</Button>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) setEditing(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose edit</DialogTitle>
          </DialogHeader>
          {editing && (
            <EditForm
              person={editing}
              imageUrl={hasImageForId(editing.id) ? squareImageUrlForId(editing.id, 600) : null}
              onClose={() => setEditing(null)}
              onSaved={() => { setEditing(null); fetchData() }}
            />
          )}
        </DialogContent>
      </Dialog>

      {showSlideshow && galleryData.length > 0 && (
        <Slideshow
          data={galleryData}
          squareImageUrlForId={squareImageUrlForId}
          dodForId={dodForId}
          categoryForId={categoryForId}
          formatDateOnly={formatDateOnly}
          onClose={() => setShowSlideshow(false)}
        />
      )}
    </main>
  )
}

function EditForm({ person, imageUrl, onClose, onSaved }: { person: Person; imageUrl?: string | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Person>(person)
  const [saving, setSaving] = useState(false)

  const updateField = (key: keyof Person, value: any) => setForm((f) => ({ ...f, [key]: value }))

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/rows', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const j = await res.json()
      if (!res.ok || !j.ok) throw new Error(j.error || 'Failed to save')
      onSaved()
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-start gap-4">
        <div className="w-28">
          {imageUrl ? (
            <img src={imageUrl} alt={person.name || person.enName || person.id} className="w-28 aspect-square rounded-md object-cover" />
          ) : (
            <div className="w-28 aspect-square flex items-center justify-center bg-muted rounded-md">
              <Button asChild variant="outline" size="sm"><a href="/admin">Upload</a></Button>
            </div>
          )}
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Name</label>
            <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">English name</label>
            <Input value={form.enName} onChange={(e) => updateField('enName', e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Age</label>
            <Input type="number" value={form.age ?? ''} onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value, 10) : null)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Date of birth</label>
            <Input value={form.dob ? String(form.dob).slice(0, 10) : ''} onChange={(e) => updateField('dob', e.target.value ? new Date(e.target.value).toISOString() : null)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Sex</label>
            <select className="h-9 rounded-md border bg-background px-2 text-sm w-full" value={form.sex ?? ''} onChange={(e) => updateField('sex', e.target.value || null)}>
              <option value="">Unknown</option>
              <option value="m">m</option>
              <option value="f">f</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Source</label>
            <Input value={form.source ?? ''} onChange={(e) => updateField('source', e.target.value)} />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={save} disabled={saving}>{saving ? 'Proposing...' : 'Propose edit'}</Button>
      </div>
    </div>
  )
}
