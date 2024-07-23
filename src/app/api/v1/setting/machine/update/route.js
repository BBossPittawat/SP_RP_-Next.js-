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
        if (!data.row_id ||
            !data.mc_name ||
            !data.budget_id
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- insert data

        const conn1 = await MT200conn()
        await conn1.execute(`
        UPDATE F17_05_SPRP_MC
        SET 
            MC_NAME = :mc_name,
            BUDGET_ID = :budget_id,
            DTE_UPDATE = SYSTIMESTAMP
        WHERE ID = :row_id
        `
            , {
                row_id: data.row_id,
                mc_name: data.mc_name,
                budget_id: data.budget_id,
            }
        )

        await conn1.commit()

        return NextResponse.json({ message: 'Data insert successfully' })

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}