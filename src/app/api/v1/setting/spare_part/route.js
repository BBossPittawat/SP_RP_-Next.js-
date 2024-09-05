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
        if (!data.department || !data.ccc_id) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- Query database
        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT
            T1.ID,
            T6.DEPARTMENT,
            CASE WHEN T1.IMG IS NOT NULL THEN
                '1'
            ELSE
                NULL
            END AS IMG,
            T1.PART_NO,
            T1.SPEC,
            T1.PRICE,
            T1.CURR,
            T1.UNIT,
            T3.PD,
            T4.MC_NAME,
            T1.LOCATION,
            T1.STOCK,
            T1.REMARK,
            T2.CCC_NAME,
            T5.ENG_NAME
        FROM 
            F17_05_SPRP_PART_LIST T1
        LEFT JOIN
            F17_00_COMMON_CCC T2 ON T1.CCC_ID = T2.ID
        LEFT JOIN
            F17_00_COMMON_PD T3 ON T1.PD_ID = T3.ID
        LEFT JOIN 
            F17_05_SPRP_MC T4 ON T1.MC_ID = T4.ID
        LEFT JOIN 
            F17_05_SPRP_GROUP T5 ON T5.ID = T1.GROUP_ID
        LEFT JOIN
            F17_00_COMMON_DEPARTMENT T6 ON T2.DEP_ID = T6.ID
        WHERE
            T6.DEPARTMENT = :department
        AND
            T2.ID = :ccc
        ORDER BY
            T1.PART_NO,
            T3.PD,
            T4.MC_NAME,
            T5.ENG_NAME

         `
            , {
                department: data.department,
                ccc: data.ccc_id
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            ID: row[0],
            DPM: row[1],
            IMG: row[2],
            PART_NO: row[3],
            SPEC: row[4],
            PRICE: row[5],
            CURR: row[6],
            UNIT: row[7],
            PD: row[8],
            MC_NAME: row[9],
            LOCATION: row[10],
            STOCK: row[11],
            REMARK: row[12],
            CCC_NAME: row[13],
            GROUP: row[14],
        }))

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}