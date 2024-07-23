import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const partNo = url.searchParams.get('partNo')

    if (!partNo) {
      return NextResponse.json({ message: 'Missing partNo parameter' }, { status: 400 })
    }

    const conn = await MT200conn()
    const query = await conn.execute(
      `
      SELECT IMG
      FROM F17_05_SPRP_PART_LIST
      WHERE ROWID = :partNo
      `,
      { partNo }
    )

    if (query.rows.length === 0 || !query.rows[0][0]) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 })
    }

    const imageBuffer = query.rows[0][0]

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}