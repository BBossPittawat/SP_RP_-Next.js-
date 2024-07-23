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
        if (!data.department) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- Query database
        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT
            T2.ID,
            T2.PD,
            T1.ID,
            T1.MC_NAME
        FROM
            F17_05_SPRP_MC T1
        JOIN
            F17_00_COMMON_PD T2 ON T2.ID = T1.PD_ID
        JOIN 
            F17_00_COMMON_DEPARTMENT T3 ON T3.ID = T1.DEP_ID
        WHERE
            T3.DEPARTMENT = :department
         `
            , {
                department: data.department
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            PD_ID: row[0],
            PD: row[1],
            MC_ID: row[2],
            MC_NAME: row[3],
        }))

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}