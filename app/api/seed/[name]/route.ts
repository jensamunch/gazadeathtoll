import { NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'

const VALID_NAME = /^slice_final_[1-3]_[1-3]\.png$/

export async function GET(
  _request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const name = params.name
    if (!VALID_NAME.test(name)) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'app', 'seed', name)
    const file = await fs.readFile(filePath)
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e) {
    return new NextResponse('Not Found', { status: 404 })
  }
}


