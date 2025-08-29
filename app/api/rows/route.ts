import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import type { Row, Prisma, Sex, Person } from '@prisma/client'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    console.log('API: Starting to fetch data...')
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '1000')
    const offset = (page - 1) * limit

    // Get filter parameters
    const ageFilter = searchParams.get('age')
    const sexFilter = searchParams.get('sex')
    const nameFilter = searchParams.get('name')
    const category = searchParams.get('category')

    console.log('API: Raw filter parameters:', { ageFilter, sexFilter, nameFilter, category })

    // Build where clause for filtering
    const where: Prisma.PersonWhereInput = {}

    if (ageFilter) {
      console.log('Processing age filter:', ageFilter)
      if (ageFilter.includes('-')) {
        const [min, max] = ageFilter.split('-').map(Number)
        where.age = {
          gte: min,
          lte: max,
        }
      } else if (ageFilter.includes('>')) {
        const val = parseInt(ageFilter.replace('>', ''))
        where.age = { gt: val }
      } else if (ageFilter.includes('<')) {
        const val = parseInt(ageFilter.replace('<', ''))
        where.age = { lt: val }
      } else if (ageFilter.includes('>=')) {
        const val = parseInt(ageFilter.replace('>=', ''))
        where.age = { gte: val }
      } else if (ageFilter.includes('<=')) {
        const val = parseInt(ageFilter.replace('<=', ''))
        where.age = { lte: val }
      } else {
        const val = parseInt(ageFilter)
        if (!isNaN(val)) {
          where.age = val
        }
      }
    }

    if (sexFilter) {
      if (sexFilter === 'm' || sexFilter === 'f') {
        where.sex = sexFilter as Sex
      }
    }

    if (nameFilter) {
      where.OR = [
        { name: { contains: nameFilter, mode: 'insensitive' } },
        { enName: { contains: nameFilter, mode: 'insensitive' } },
      ]
    }

    console.log('API: Applying filters:', { ageFilter, sexFilter, nameFilter, category })
    console.log('API: Where clause:', where)
    // Category filter: apply deterministic mapping and paginate accurately
    if (category) {
      const categories = ['civilian', 'medical staff', 'journalist', 'child'] as const
      const categoryForId = (id: string) => {
        let hash = 0
        for (let i = 0; i < id.length; i++) hash = (hash * 37 + id.charCodeAt(i)) | 0
        const idx = Math.abs(hash) % categories.length
        return categories[idx]
      }

      const allIds = await prisma.person.findMany({
        where,
        select: { id: true },
        orderBy: { createdAt: 'desc' },
      })
      const filteredIds = allIds.map((p) => p.id).filter((id) => categoryForId(id) === category)
      const totalCount = filteredIds.length
      const pageIds = filteredIds.slice(offset, offset + limit)
      let persons: Person[] = []
      if (pageIds.length > 0) {
        const found = await prisma.person.findMany({ where: { id: { in: pageIds } } })
        const map = new Map(found.map((p) => [p.id, p]))
        persons = pageIds.map((id) => map.get(id)).filter((p): p is Person => Boolean(p))
      }
      console.log('API: Found persons:', persons.length)
      return NextResponse.json({
        data: persons,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / (limit || 1)),
        },
      })
    }

    const persons = await prisma.person.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    console.log('API: Found persons:', persons.length)

    if (persons.length > 0) {
      const totalCount = await prisma.person.count({ where })
      console.log('API: Returning persons data, total:', totalCount)
      return NextResponse.json({
        data: persons,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      })
    }

    console.log('API: No persons found, trying generic rows...')
    const rows = await prisma.row.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })
    console.log('API: Found generic rows:', rows.length)
    return NextResponse.json(rows.map((r: Row) => r.data))
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json([])
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { id: string } & Prisma.PersonUpdateInput
    const { id, ...data } = body || {}
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    const updated = await prisma.person.update({ where: { id }, data })
    return NextResponse.json({ ok: true, data: updated })
  } catch (err) {
    console.error('API PUT Error:', err)
    return NextResponse.json({ ok: false, error: 'Update failed' }, { status: 500 })
  }
}
