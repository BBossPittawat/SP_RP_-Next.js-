import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import { mteDBconn } from '@/../utils/mteDB'

export const dynamic = 'force-dynamic'

export async function POST(req) {
    try {
        //---------------------------------------------------------------------------------- Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return new Response('Invalid API Key', { status: 401 })
        }

        // --------------------------------------------------------------------------------- Check body
        const data = await req.json()
        if (!data.emp_code ||
            !data.department_id ||
            !data.department
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        const departmentPrefix = data.department.slice(0, 3)

        //---------------------------------------------------------------------------------- GET emp data

        const conn1 = await mteDBconn()
        const query1 = await conn1.execute(`
        SELECT 
            EMPCODE,
            EMPNAME_ENG
        FROM 
            EMPLOYEE_DATA
        WHERE 
            EMPCODE = :emp_code
        AND 
            DATE_RESIGN = '0'
        AND 
            SECTION LIKE :section_prefix || '%'
        `
            , {
                emp_code: data.emp_code,
                section_prefix: departmentPrefix
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        // return NextResponse.json(query1.rows[0][1])

        //---------------------------------------------------------------------------------- insert data

        const conn2 = await MT200conn()
        await conn2.execute(
            `
        INSERT INTO F17_05_SPRP_ADMIN (
            EMP_CD,EMPNAME_ENG,DPM_ID
        ) VALUES (
            :emp_code,
            :empname_eng,
            :dpm_id
        )
        `
            , {
                emp_code: query1.rows[0][0],
                empname_eng: query1.rows[0][1],
                dpm_id: data.department_id,
            }
        )

        await conn2.commit()

        return NextResponse.json({ message: 'Data insert successfully' })

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}