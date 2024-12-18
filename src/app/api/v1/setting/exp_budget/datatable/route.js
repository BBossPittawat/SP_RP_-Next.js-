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
        if (!data.department || !data.period
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
            T1.DESCRIPTION,
            T1.PRICE,
            T1.CURR,
            T3.GP_NAME,
            T2.ID,
            T3.ID
        FROM
            F17_00_COMMON_EXP_BUDGET T1
        JOIN
            F17_00_COMMON_CCC T2 ON T2.ID = T1.CCC_ID
        LEFT JOIN
            F17_00_COMMON_BUDGET_GROUP T3 ON T3.ID = T1.GROUP_ID
        JOIN
            F17_00_COMMON_DEPARTMENT T4 ON T4.ID = T2.DEP_ID
        WHERE
            T4.DEPARTMENT = :department
        AND
            T1.PERIOD = :period
        ORDER BY
            T1.DTE_UPDATE
        `
            , {
                department: data.department,
                period: data.period
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            ID: row[0],
            PERIOD: row[3],
            CCC_NAME: row[1],
            BUDGET_NO: row[2],
            DESCRIPTION: row[4],
            PRICE: row[5],
            CURR: row[6],
            GP_NAME: row[7],
            CCC_ID: row[8],
            GP_ID: row[9]
        }))

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}