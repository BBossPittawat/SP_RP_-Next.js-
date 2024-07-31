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
        // ----------------------------------------------------------------------------------- check body
        const data = await req.json()

        if (!data.department ||
            data.department.length > 10 ||
            !data.product) {

            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        // ----------------------------------------------------------------------------------- check cache time
        // const now = Date.now();
        // if (now - cache.timestamp < cache_duration && cache.data.length > 0) {
        //     return NextResponse.json( cache.data );
        // }

        // ----------------------------------------------------------------------------------- query

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(
            `
        SELECT 
            T1.ID,
            T1.MC_NAME,
            T3.BUDGET_NO,
            T3.ID
        FROM 
            F17_05_SPRP_MC T1
        JOIN    
            F17_00_COMMON_PD T2 ON T1.PD_ID = T2.ID
        JOIN 
            F17_00_COMMON_EXP_BUDGET T3 ON T1.BUDGET_ID = T3.ID
        WHERE 
            T2.DPM = :department
        AND 
            T2.ID = :product
        ORDER BY 
            T1.MC_NAME
        `,
            [data.department, data.product]
        )

        if (query1.rows.length === 0) {
            return NextResponse.json({ message: 'ไม่พบข้อมูลในระบบ' }, { status: 400 })
        }

        const result = query1.rows.map(row => ({
            id: row[0],
            machine: row[1],
            budget: row[2],
            budget_id: row[3],
        }))

        // ----------------------------------------------------------------------------------- update cache data
        // cache = {
        //     timestamp: Date.now(),
        //     data: result,
        //  };

        return NextResponse.json(result);

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}