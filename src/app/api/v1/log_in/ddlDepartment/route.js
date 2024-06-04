import { MT200conn } from '@/../../utils/mt200DB'
import { NextResponse } from 'next/server'

let cache = {
    timestamp: 0,
    data: [],
};

const cache_duration = 60 * 60 * 1000; // 60 min

export async function GET(req) {

    try {
        // ----------------------------------------------------------------------------------- check api key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }

        // ----------------------------------------------------------------------------------- check cache time
        const now = Date.now();
        if (now - cache.timestamp < cache_duration && cache.data.length > 0) {
            return NextResponse.json({ data: { departments: cache.data } });
        }

        // ----------------------------------------------------------------------------------- find data
        const conn1 = await MT200conn()
        const query1 = await conn1.execute(
        `
        SELECT DEPARTMENT
        FROM F17_00_COMMON_DEPARTMENT
        `
        )

        if (query1.rows.length === 0) {
            return NextResponse.json({message: 'ไม่พบข้อมูลในระบบ'},{ status: 400 })
        }

        const departments = query1.rows.map(row => row[0])
        // ----------------------------------------------------------------------------------- update cache data
        cache = {
            timestamp: Date.now(),
            data: departments,
         };
  
         return NextResponse.json({data:{departments}});

    } catch (error) {
        // console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }

}