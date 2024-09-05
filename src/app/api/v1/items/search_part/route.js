import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const cache_duration = 3600 * 1000 // 1 hour
const cache_file_path = path.resolve('./cache/v1_items_search_part.txt')

async function readCache() {
    try {
        const data = await fs.readFile(cache_file_path, 'utf-8')
        return JSON.parse(data)
    } catch {
        return {}
    }
}

async function writeCache(department, timestamp, result) {
    const cacheData = await readCache()
    cacheData[department] = { timestamp, data: result }
    await fs.writeFile(cache_file_path, JSON.stringify(cacheData))
}

export async function POST(req) {
    try {
        // check api key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY)
            return new Response('Invalid API Key', { status: 401 })

        //  check body
        const data = await req.json()
        if (!data.department)
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })

        // check cache time
        const now = Date.now()
        const cached = await readCache()

        if (cached[data.department] && now - cached[data.department].timestamp < cache_duration)
            return NextResponse.json(cached[data.department].data)

        // query data
        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
            SELECT 
                T1.ID, 
                T1.ROWID, 
                T2.CCC_NAME, 
                T1.PART_NO,
                T1.SPEC
            FROM 
                F17_05_SPRP_PART_LIST T1 
            JOIN 
                F17_00_COMMON_CCC T2 ON T1.CCC_ID=T2.ID 
            JOIN 
                F17_00_COMMON_DEPARTMENT T3 ON T2.DEP_ID=T3.ID 
            WHERE 
                T3.DEPARTMENT=:department 
            ORDER BY 
                T1.PART_NO`,
            { department: data.department }
        )

        if (query1.rows.length === 0)
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })

        const result = query1.rows.map(row => ({
            ID: row[0],
            ROWID: row[1],
            CCC: row[2],
            PART_NO: row[3],
            SPEC: row[4]
        }))

        // update Cache Data  
        writeCache(data.department, now, result)

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}

process.on('unhandledRejection', (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
})

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception thrown:", err);
})