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
        if (!data.department || !data.ccc
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- GET data

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT
            T1.ID,
            T2.CCC_NAME,
            T1.BUDGET_NO,
            T1.PERIOD,
            T1.DESCRIPTION
        FROM
            F17_00_COMMON_EXP_BUDGET T1
        JOIN
            F17_00_COMMON_CCC T2 ON T2.ID = T1.CCC_ID
        JOIN
            F17_00_COMMON_BUDGET_GROUP T3 ON T3.ID = T1.GROUP_ID
        JOIN
            F17_00_COMMON_DEPARTMENT T4 ON T4.ID = T2.DEP_ID
        WHERE
            T4.DEPARTMENT = :department
        AND
            T2.CCC_NAME = :ccc
        `
            , {
                department: data.department,
                ccc: data.ccc,
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            ID: row[0],
            CCC_NAME: row[1],
            BUDGET_NO: row[2],
            PERIOD: row[3],
            DESCRIPTION: row[4]
        }))

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}