import { MT200conn } from '@/../utils/mt200DB'
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const cache_duration = 60 * 60 * 1000 // 60 min
const cache_file_path = path.resolve('./cache/v1_log_in_ddlDepartment.txt')

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
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 })

        // Check cached time   
        const now = Date.now()
        const cached = await readCache()

        if (now - cached.timestamp < cache_duration && cached.data.length > 0)
            return NextResponse.json({ data: { departments: cached.data } })

        // Get Data  
        let conn1 = await MT200conn()
        let query1 = await conn1.execute(`
           SELECT DEPARTMENT FROM F17_00_COMMON_DEPARTMENT`)

        if (query1.rows.length === 0) {
            return NextResponse.json({ message: 'ไม่พบข้อมูลในระบบ' }, { status: 400 })
        }

        let departments = query1.rows.map(row => row[0])

        // update Cache Data  
        writeCache(now, departments)

        return NextResponse.json({ data: { departments } })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}