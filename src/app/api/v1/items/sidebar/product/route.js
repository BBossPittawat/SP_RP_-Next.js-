import { NextResponse } from 'next/server'
import { MT200conn } from '@/../../utils/mt200DB'

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
        data.department.length > 10 )
        {
 
        return NextResponse.json({message: 'invalid body'},{ status: 400 })
        }
        // ----------------------------------------------------------------------------------- query

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(
        `
        SELECT ID,PD
        FROM F17_00_COMMON_PD
        WHERE DPM = :department
        `,
        [data.department]
        )

        if (query1.rows.length === 0) {
            return NextResponse.json({message: 'ไม่พบข้อมูลในระบบ'},{ status: 400 })
        }

        const result = query1.rows.map(row => ({
            id: row[0],
            product: row[1]
        }))

         return NextResponse.json({result});

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}