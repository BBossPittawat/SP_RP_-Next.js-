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

        // console.log(data)

        if (!data.id ||
            !data.period ||
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
        UPDATE F17_00_COMMON_EXP_BUDGET
        SET
            PERIOD = :period,
            CCC_ID = :ccc_id,
            BUDGET_NO = :budget_no,
            DESCRIPTION = :description,
            PRICE = :price,
            CURR = :curr
        WHERE ID = :id
        `
            , {
                id: data.id,
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