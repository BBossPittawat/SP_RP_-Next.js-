import { MT200conn } from '@/../../utils/mt200DB'
import { NextResponse } from 'next/server'

export async function GET(req) {

    try {
        // ----------------------------------------------------------------------------------- check api key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
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
        // ----------------------------------------------------------------------------------- format management
        const jsonResponse = {
          "data": {
             "departments": departments
          }
       }

       return NextResponse.json(jsonResponse)

    } catch (error) {
        // console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }

}