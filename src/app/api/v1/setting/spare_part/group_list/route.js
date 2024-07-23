import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

let cache = {
    timestamp: 0,
    data: [],
};

const cache_duration = 1440 * 60 * 1000; // min

export async function POST(req) {

    try {
        // ----------------------------------------------------------------------------------- check api key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
        // ----------------------------------------------------------------------------------- check cache time
        const now = Date.now();
        if (now - cache.timestamp < cache_duration && cache.data.length > 0) {
            return NextResponse.json(cache.data);
        }
        // ----------------------------------------------------------------------------------- query

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT
            ID,
            ENG_NAME
        FROM
            F17_05_SPRP_GROUP
        `
        )

        if (query1.rows.length === 0) {
            return NextResponse.json({ message: 'ไม่พบข้อมูลในระบบ' }, { status: 400 })
        }

        const result = query1.rows.map(row => ({
            GROUP_ID: row[0],
            GROUP: row[1],
        }))

        // ----------------------------------------------------------------------------------- update cache data
        cache = {
            timestamp: Date.now(),
            data: result,
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}