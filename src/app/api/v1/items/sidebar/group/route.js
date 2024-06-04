import { NextResponse } from 'next/server'
import { MT200conn } from '@/../../utils/mt200DB'

export async function GET(req) {

    try {
        // ----------------------------------------------------------------------------------- check api key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
        return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
        // ----------------------------------------------------------------------------------- query

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(
        `
        SELECT ID,ENG_NAME,THAI_NAME
        FROM F17_05_SPRP_GROUP
        `
        )

        if (query1.rows.length === 0) {
            return NextResponse.json({message: 'ไม่พบข้อมูลในระบบ'},{ status: 400 })
        }

        const result = query1.rows.map(row => ({
            id: row[0],
            eng_name: row[1],
            thai_name: row[2]
        }))

         return NextResponse.json({result});

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}