import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import { mteDBconn } from '@/../utils/mteDB'

export const dynamic = 'force-dynamic'

export async function POST(req) {

    let final_result = []

    try {
        //---------------------------------------------------------------------------------- Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return new Response('Invalid API Key', { status: 401 })
        }

        // --------------------------------------------------------------------------------- Check body
        const data = await req.json()
        if (!data.department) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        // ---------------------------------------------------------------------------------- Query database
        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
            SELECT
                T1.ID,
                T1.DTE_REQ,
                T1.REQ_PIC,
                T1.QTY,
                T1.ACC,
                T2.PART_NO,
                T2.SPEC,
                T2.LOCATION,
                T2.UNIT,
                T3.CCC_NAME,
                T9.PD_GROUP,
                T5.MC_NAME,
                T6.MN_CODE,
                T7.NAME_TYPE,
                T1.CCC,
                T8.PERIOD,
                T8.BUDGET_NO,
                T4.PD,
                T1.REMARK,
                T9.PD AS PD_FROM
            FROM
                F17_05_SPRP_REQ_HIS T1
            JOIN 
                F17_05_SPRP_PART_LIST T2 ON T1.PART_ID = T2.ID
            JOIN 
                F17_00_COMMON_CCC T3 ON T2.CCC_ID = T3.ID
            LEFT JOIN 
                F17_00_COMMON_PD T4 ON T1.PD_ID = T4.ID
            LEFT JOIN 
                F17_05_SPRP_MC T5 ON T5.ID = T1.MC_ID
            JOIN 
                F17_05_SPRP_MN_CODE T6 ON T6.ID = T1.MN_CODE_ID
            JOIN 
                F17_05_SPRP_REQ_TYPE T7 ON T7.ID = T1.REQ_TYPE_ID
            LEFT JOIN  
                F17_00_COMMON_EXP_BUDGET T8 ON T8.ID = T1.BUDGET_ID
            LEFT JOIN 
                F17_00_COMMON_PD T9 ON T2.PD_ID = T9.ID
            WHERE 
                T9.DPM = :department
            AND 
                T1.ADMIN_JDM_STATUS IS NULL
            `,
            {
                department: data.department
            }
        )

        if (query1.rows.length === 0) {
            return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
        }

        // ---------------------------------------------------------------------------------- get emp name

        const conn2 = await mteDBconn()

        const query2Results = await Promise.all(query1.rows.map(async row => {
            const emp_code = row[2]

            const query2 = await conn2.execute(`
                SELECT 
                    SUBSTR(EMPNAME_ENG, 1, INSTR(EMPNAME_ENG || ' ', ' ') - 1) AS FIRSTNAME
                FROM EMPLOYEE_DATA
                WHERE EMPCODE = :emp_code`,
                { emp_code: String(emp_code) }
            )

            const emp_name = query2.rows.length > 0 ? query2.rows[0][0] : null

            return {
                ID: row[0],
                DTE_REQ: row[1],
                REQ_PIC: row[2],
                QTY: row[3],
                ACC: row[4],
                PART_NO: row[5],
                SPEC: row[6],
                LOCATION: row[7],
                UNIT: row[8],
                CCC_NAME: row[9],
                PD_GROUP: row[10],
                MC_NAME: row[11],
                MN_CODE: row[12],
                NAME_TYPE: row[13],
                CCC_ISSU_TO: row[14],
                EMP_NAME: emp_name,
                BUDGET_PERIOD: row[15],
                BUDGET_NO: row[16],
                PRODUCT: row[17],
                REMARK: row[18],
                PD_FROM: row[19],
            }
        }))

        final_result = query2Results

        return NextResponse.json(final_result)

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}