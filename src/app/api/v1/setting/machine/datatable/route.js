import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

export async function POST(req) {
    try {
        //---------------------------------------------------------------------------------- Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return new Response('Invalid API Key', { status: 401 })
        }

        // --------------------------------------------------------------------------------- Check body
        const data = await req.json()
        if (!data.pd_id
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- GET data

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT
            T1.MC_NAME,
            T2.BUDGET_NO,
            T2.PERIOD,
            T1.ID
        FROM
            F17_05_SPRP_MC T1
        LEFT JOIN
            F17_00_COMMON_EXP_BUDGET T2 ON T1.BUDGET_ID = T2.ID
        WHERE
            T1.PD_ID = :pd_id
        ORDER BY
            T1.MC_NAME
        `
            , {
                pd_id: data.pd_id,
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            MC_NAME: row[0],
            BUDGET_NO: row[1],
            PERIOD: row[2],
            ID: row[3],
        }))

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}