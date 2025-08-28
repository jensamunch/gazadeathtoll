import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { parse } from 'csv-parse/sync'

export const runtime = 'nodejs'

// Define types for our data
type PersonRecord = {
  id: string
  name: string
  en_name: string
  age: string
  dob: string
  sex: string
  source: string
}

type PersonData = {
  id: string
  name: string
  enName: string
  age: number | null
  dob: Date | null
  sex: 'm' | 'f' | null
  source: string | null
}

export async function POST(request: Request) {
  try {
    // Public endpoint: no authentication required

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

    const text = await file.text()
    const records = parse(text, { columns: true, skip_empty_lines: true }) as PersonRecord[]

    // Try to detect if this matches the Person schema; if so, load typed
    const looksLikePerson = ['id', 'name', 'en_name', 'age', 'dob', 'sex', 'source'].every(
      (k) => k in (records[0] || {})
    )

    const hasPersonModel = 'person' in prisma

    if (looksLikePerson && hasPersonModel) {
      // Replace dataset using deleteMany (TRUNCATE can require elevated privileges)
      await prisma.person.deleteMany({})

      // Prepare typed rows
      const typed: PersonData[] = records.map((r) => {
        const age = r.age ? Number(r.age) : null
        const dob = r.dob ? new Date(r.dob) : null
        const sex = r.sex === 'm' || r.sex === 'f' ? (r.sex as 'm' | 'f') : null
        return {
          id: String(r.id),
          name: r.name,
          enName: r.en_name,
          age: Number.isFinite(age as number) ? age : null,
          dob: dob && !isNaN(dob.getTime()) ? dob : null,
          sex,
          source: r.source || null,
        }
      })

      // Insert in chunks to stay under query timeouts
      const batchSize = 1000
      for (let i = 0; i < typed.length; i += batchSize) {
        const batch = typed.slice(i, i + batchSize)
        await prisma.person.createMany({ data: batch, skipDuplicates: true })
      }

      const url = new URL('/upload/success', request.url)
      url.searchParams.set('ok', 'true')
      url.searchParams.set('table', 'Person')
      url.searchParams.set('count', String(records.length))
      return NextResponse.redirect(url, { status: 303 })
    }

    // Fallback to generic JSON rows
    await prisma.row.deleteMany({})
    await prisma.$transaction(records.map((r) => prisma.row.create({ data: { data: r } })))

    const url = new URL('/upload/success', request.url)
    url.searchParams.set('ok', 'true')
    url.searchParams.set('table', 'Row')
    url.searchParams.set('count', String(records.length))
    return NextResponse.redirect(url, { status: 303 })
  } catch (err: unknown) {
    console.error(err)
    const url = new URL('/upload/success', request.url)
    url.searchParams.set('ok', 'false')
    url.searchParams.set('error', err instanceof Error ? err.message : 'Upload failed')
    return NextResponse.redirect(url, { status: 303 })
  }
}
