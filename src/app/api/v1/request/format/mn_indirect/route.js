import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

export async function POST(req, res) {
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
            T3.CCC_NAME,
            T4.BUDGET_NO,
            T4.ID
        FROM 
            F17_05_SPRP_REQ_TYPE T1
        JOIN 
            F17_00_COMMON_DEPARTMENT T2 ON T1.DEP_ID = T2.ID
        JOIN 
            F17_00_COMMON_CCC T3 ON T3.ID = T1.CCC_ID
        JOIN 
            F17_00_COMMON_EXP_BUDGET T4 ON T4.ID = T1.BUDGET_ID
        WHERE 
            T2.DEPARTMENT = :department
        AND 
            T1.NAME_TYPE = 'MN_INDIRECT'
        `
            , {
                department: data.department
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            CCC: row[0],
            BUDGET_NO: row[1],
            BUDGET_ID: row[2],
        }))

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}