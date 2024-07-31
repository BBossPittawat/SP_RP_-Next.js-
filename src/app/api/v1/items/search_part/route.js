import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

let cache = {}

const cache_duration = 3600 * 1000 // 3600 sec -> 1 hr.

export async function POST(req) {
    try {
        //---------------------------------------------------------------------------------- Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return new Response('Invalid API Key', { status: 401 })
        }

        // --------------------------------------------------------------------------------- Check body
        const data = await req.json()
        if (!data.department
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        // ----------------------------------------------------------------------------------- check cache time
        const now = Date.now();
        if (cache[data.department] && now - cache[data.department].timestamp < cache_duration) {
            return NextResponse.json(cache[data.department].data)
        }

        //---------------------------------------------------------------------------------- GET data

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT
             T1.ROWID,
             T2.CCC_NAME,
             T1.PART_NO
        FROM
            F17_05_SPRP_PART_LIST T1
        JOIN
            F17_00_COMMON_CCC T2 ON T1.CCC_ID = T2.ID
        JOIN
            F17_00_COMMON_DEPARTMENT T3 ON T2.DEP_ID = T3.ID
        WHERE
            T3.DEPARTMENT = :department
        ORDER BY
            T1.PART_NO
        `
            , {
                department: data.department,
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            ROWID: row[0],
            CCC: row[1],
            PART_NO: row[2],
        }))

        // ----------------------------------------------------------------------------------- update cache data
        cache[data.department] = {
            timestamp: now,
            data: result,
        }

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}