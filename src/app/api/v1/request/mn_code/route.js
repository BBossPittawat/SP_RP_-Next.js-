import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const cache_duration = 60 * 60 * 1000 // 60 min
const cache_file_path = path.resolve('./cache/v1_request_mn_code.txt')

// Read cache data from file
async function readCache() {
    try {
        const data = await fs.readFile(cache_file_path, 'utf-8')
        return JSON.parse(data)
    } catch {
        return { timestamp: 0, data: [] }
    }
}

// Write cache data to file
async function writeCache(timestamp, result) {
    const cacheData = { timestamp, data: result }
    await fs.writeFile(cache_file_path, JSON.stringify(cacheData))
}

export async function GET(req) {
    try {
        // Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY)
            return new Response('Invalid API Key', { status: 401 })

        // Check cached time   
        let now = Date.now()
        let cached = await readCache()

        if (now - cached.timestamp < cache_duration && cached.data.length > 0) {
            return NextResponse.json(cached.data)
        }

        // Get Data  
        let conn1 = await MT200conn()
        let query1 = await conn1.execute(`
         SELECT ID,MN_CODE ,ACC ,MEAN_TH 
         FROM F17_05_SPRP_MN_CODE`)

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        let result = query1.rows.map(row => ({
            ID: row[0], MN_CODE: row[1], ACC: row[2], MEAN_TH: row[3]
        }))

        // update Cache Data  
        writeCache(now, result)

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}