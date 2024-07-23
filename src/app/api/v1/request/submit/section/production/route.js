import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

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
        if (!data.req_type_id ||
            !data.mn_code_id ||
            !data.qty ||
            !data.remark ||
            !data.part_id ||
            !data.emp_code ||
            !data.budget_id ||
            !data.acc ||
            !data.ccc
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- insert data

        // console.log(data.budget_id)

        const conn1 = await MT200conn()
        await conn1.execute(
            `
        INSERT INTO F17_05_SPRP_REQ_HIS (
            PART_ID,
            MN_CODE_ID,
            QTY,
            REMARK,
            DTE_REQ,
            REQ_TYPE_ID,
            REQ_PIC,
            BUDGET_ID,
            ACC,
            CCC
        ) VALUES (
            :part_id,
            :mn_code_id,
            :qty,
            :remark,
            SYSTIMESTAMP,
            :req_type_id,
            :emp_code,
            :budget_id,
            :acc,
            :ccc
        )
        `,
            [
                data.part_id,
                data.mn_code_id,
                data.qty,
                data.remark,
                data.req_type_id,
                data.emp_code,
                data.budget_id,
                data.acc,
                data.ccc
            ]
        )

        await conn1.commit()

        return NextResponse.json({ message: 'Data insert successfully' })

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}