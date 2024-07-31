import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

export async function POST(req) {

    try {
        // ----------------------------------------------------------------------------------- check api key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        // --------------------------------------------------------------------------------- Check body
        const data = await req.json()
        if (!data.department) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        // ----------------------------------------------------------------------------------- query

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT
            T1.PD,
            T2.MC_NAME
        FROM 
            F17_00_COMMON_PD T1
        JOIN 
            F17_05_SPRP_MC T2 ON T1.ID = T2.PD_ID
        WHERE 
            T1.DPM = :department
        ORDER BY 
            T1.PD,
            T2.MC_NAME
        `
            , {
                department: data.department
            }
        )

        if (query1.rows.length === 0) {
            return NextResponse.json({ message: 'ไม่พบข้อมูลในระบบ' }, { status: 400 })
        }

        const result = query1.rows.map(row => ({
            PRODUCT: row[0],
            MACHINE: row[1],
        }))

        return NextResponse.json(result);

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}