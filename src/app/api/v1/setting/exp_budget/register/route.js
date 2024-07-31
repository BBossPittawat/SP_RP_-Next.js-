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
        if (!data.period ||
            !data.ccc_id ||
            !data.budget_no ||
            !data.description ||
            !data.price ||
            !data.curr 
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- insert data

        const conn1 = await MT200conn()
        await conn1.execute(`
        INSERT INTO F17_00_COMMON_EXP_BUDGET (
            PERIOD,CCC_ID,BUDGET_NO,DESCRIPTION,PRICE,CURR,GROUP_ID,DTE_UPDATE
        ) VALUES (
            :period,
            :ccc_id,
            :budget_no,
            :description,
            :price,
            :curr,
            SYSTIMESTAMP
        )
        `
            , {
                period: data.period,
                ccc_id: data.ccc_id,
                budget_no: data.budget_no,
                description: data.description,
                price: data.price,
                curr: data.curr,

            }
        )

        await conn1.commit()

        return NextResponse.json({ message: 'Data insert successfully' })

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}