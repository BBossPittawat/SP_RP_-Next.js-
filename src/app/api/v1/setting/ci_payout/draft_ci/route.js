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
        if (!data.ccc ||
            !data.ccc_issue_to ||
            !data.tran_date ||
            !data.part_no ||
            !data.qty ||
            !data.unit ||
            !data.ac_title ||
            !data.comment
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- insert data

        const conn1 = await MT200conn()
        await conn1.execute(
            `
        INSERT INTO F17_05_SPRP_REQ_DRAFT_CI (
            CCC,
            CCC_ISSU_TO,
            TRAN_DATE,
            PART_NO,
            QTY,
            UNIT,
            AC_TITLE,
            CM
        ) VALUES (
            :ccc,
            :ccc_issue_to,
            :tran_date,
            :part_no,
            :qty,
            :unit,
            :ac_title,
            :cm
        )
        `
            , {
                ccc: data.ccc,
                ccc_issue_to: data.ccc_issue_to,
                tran_date: data.tran_date,
                part_no: data.part_no,
                qty: data.qty,
                unit: data.unit,
                ac_title: data.ac_title,
                cm: data.comment
            }
        )

        await conn1.commit()

        return NextResponse.json({ message: 'Data insert successfully' })

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}