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
        if (!data.department
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- GET data

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT 
            T1.EMP_CD,
            T1.EMPNAME_ENG,
            T1.DPM_ID,
            T2.DEPARTMENT
        FROM
            F17_05_SPRP_ADMIN T1
        JOIN
            F17_00_COMMON_DEPARTMENT T2 ON T1.DPM_ID = T2.ID
        WHERE
            T2.DEPARTMENT = :department

        `
            , {
                department: data.department
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            EMP_CD: row[0],
            EMPNAME_ENG: row[1],
            DEP_ID: row[2],
            DEPARTMENT: row[3]
        }))

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}