import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const cache_duration = 1440 * 60 * 1000 // 24 hours (1440 minutes)
const cache_file_path = path.resolve('./cache/v1_setting_spare_part_group_list.txt')

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

export async function POST(req) {
    try {
        // Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY)
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 })

        // Check cached time   
        let now = Date.now()
        let cached = await readCache()

        if (now - cached.timestamp < cache_duration && cached.data.length > 0) {
            return NextResponse.json(cached.data)
        }

        // Get Data  
        let conn1 = await MT200conn()
        let query1 = await conn1.execute(`
         SELECT ID ,ENG_NAME 
         FROM F17_05_SPRP_GROUP`)

        if (query1.rows.length === 0) {
            return NextResponse.json({ message: 'ไม่พบข้อมูลในระบบ' }, { status: 400 })
        }

        let result = query1.rows.map(row => ({
            GROUP_ID: row[0], GROUP: row[1]
        }))

        // update Cache Data  
        writeCache(now, result)

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}