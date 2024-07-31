import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

let cache = {
    timestamp: 0,
    data: [],
};

const cache_duration = 60 * 60 * 1000; // 60 min

export async function GET(req) {
    try {
        //---------------------------------------------------------------------------------- Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return new Response('Invalid API Key', { status: 401 })
        }

        // ----------------------------------------------------------------------------------- check cache time
        const now = Date.now();
        if (now - cache.timestamp < cache_duration && cache.data.length > 0) {
            return NextResponse.json(cache.data);
        }

        //---------------------------------------------------------------------------------- Query database
        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT ID,MN_CODE,ACC,MEAN_TH
        FROM F17_05_SPRP_MN_CODE
        `
            ,
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const result = query1.rows.map(row => ({
            ID: row[0],
            MN_CODE: row[1],
            ACC: row[2],
            MEAN_TH: row[3],
        }))

        // ----------------------------------------------------------------------------------- update cache data
        cache = {
            timestamp: Date.now(),
            data: result,
        };


        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}