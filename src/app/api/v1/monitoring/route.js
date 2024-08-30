import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import { mteDBconn } from '@/../utils/mteDB'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const cache_duration = 5 * 1000 // 5 sec
const cache_file_path = path.resolve('./cache/v1_monitoring.txt')

// Read cache data from file
async function readCache() {
    try {
        const data = await fs.readFile(cache_file_path, 'utf-8')
        return JSON.parse(data)
    } catch {
        return {}
    }
}

// Write cache data to file
async function writeCache(department, timestamp, result) {
    const cacheData = await readCache()
    cacheData[department] = { timestamp, data: result }
    await fs.writeFile(cache_file_path, JSON.stringify(cacheData))
}

export async function POST(req) {

    let final_result = []

    try {
        // Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY)
            return new Response('Invalid API Key', { status: 401 })

        // Check body 
        const data = await req.json()
        if (!data.department)
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })

        // Check cached time   
        let now = Date.now()
        let cached = await readCache()

        if (cached[data.department] && now - cached[data.department].timestamp < cache_duration) {
            return NextResponse.json(cached[data.department].data)
        }

        // Get Data  
        let conn1 = await MT200conn()
        let query1 = await conn1.execute(`
         SELECT * FROM (
             SELECT 
                 TO_CHAR(T1.DTE_REQ,'DD-MON-YY HH24:MI') AS DTE_REQ,
                 T2.LOCATION,T2.PART_NO,T1.QTY,
                 T1.REQ_PIC,T1.REMARK,
                 CASE 
                     WHEN SYSTIMESTAMP - T1.DTE_REQ < NUMTODSINTERVAL(1,'MINUTE') THEN 1
                     ELSE 0 END AS RECENTLY
             FROM F17_05_SPRP_REQ_HIS T1 
             JOIN F17_05_SPRP_PART_LIST T2 ON T1.PART_ID=T2.ID 
             JOIN F17_00_COMMON_PD T3 ON T3.ID=T2.PD_ID 
             WHERE T1.ADMIN_JDM_STATUS IS NULL AND T3.DPM=:department ORDER BY T1.DTE_REQ DESC )
         WHERE ROWNUM <=10`, { department: data.department })

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        const conn2 = await mteDBconn()

        final_result = await Promise.all(query1.rows.map(async row => {
            const emp_code = row[4]
            const query2 = await conn2.execute(`
              SELECT SUBSTR(EMPNAME_ENG , 0 , INSTR(EMPNAME_ENG ||' ',' ') - 0 )AS FIRSTNAME FROM EMPLOYEE_DATA WHERE EMPCODE=:emp_code`,
                { emp_code: String(emp_code) })

            const emp_name = query2.rows.length > 0 ? query2.rows[0][0] : null

            return {
                REQ_DATE: row[0],
                LOC: row[1],
                PART_NO: row[2],
                QTY: row[3],
                REQ_PIC: row[4],
                REMARK: row[5],
                RECENTLY: row[6],
                EMP_NAME: emp_name
            }
        }))

        // update Cache Data  
        writeCache(data.department, now, final_result)

        return NextResponse.json(final_result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}