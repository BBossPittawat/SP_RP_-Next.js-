import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

// let cache = {
//     timestamp: 0,
//     data: [],
// };

// const cache_duration = 60 * 60 * 1000; // 60 min

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
            data.department.length > 10) {

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
            T1.PD,
            T2.CCC_NAME
        FROM F17_00_COMMON_PD T1
        JOIN F17_00_COMMON_CCC T2 ON T1.CCC_ID = T2.ID
        WHERE DPM = :department
        ORDER BY PD
        `,
            [data.department]
        )

        if (query1.rows.length === 0) {
            return NextResponse.json({ message: 'ไม่พบข้อมูลในระบบ' }, { status: 400 })
        }

        const result = query1.rows.map(row => ({
            id: row[0],
            product: row[1],
            ccc: row[2],
        }))

        // ----------------------------------------------------------------------------------- update cache data
        // cache = {
        //     timestamp: Date.now(),
        //     data: result,
        // };

        return NextResponse.json(result);

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}