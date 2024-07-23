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
            TO_CHAR(T1.DTE_REQ, 'DD-MON-YY HH24:MI') AS DTE_REQ,
            T2.LOCATION,
            T2.PART_NO,
            T1.QTY,
            T1.REQ_PIC,
            T1.REMARK,
            CASE 
                WHEN SYSTIMESTAMP - T1.DTE_REQ < NUMTODSINTERVAL(5, 'MINUTE') THEN 1
                ELSE 0
            END AS RECENTLY
        FROM 
            F17_05_SPRP_REQ_HIS T1
        JOIN 
            F17_05_SPRP_PART_LIST T2 ON T1.PART_ID = T2.ID
        JOIN
            F17_00_COMMON_PD T3 ON T3.ID = T2.PD_ID
        WHERE
            T1.ADMIN_JDM_STATUS IS NULL
        AND
            T3.DPM = :department
        ORDER BY
            T1.DTE_REQ DESC
         `
            , {
                department: data.department
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            REQ_DATE: row[0],
            LOC: row[1],
            PART_NO: row[2],
            QTY: row[3],
            REQ_PIC: row[4],
            REMARK: row[5],
            RECENTLY: row[6],
        }))

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}