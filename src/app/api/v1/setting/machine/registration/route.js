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
        if (!data.pd_id ||
            !data.mc_name ||
            !data.dep_id ||
            !data.budget_id
        ) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        //---------------------------------------------------------------------------------- insert data

        const conn1 = await MT200conn()
        await conn1.execute(`
        INSERT INTO F17_05_SPRP_MC (
            PD_ID,
            MC_NAME,
            DEP_ID,
            BUDGET_ID,
            DTE_UPDATE
        ) VALUES (
            :pd_id,
            :mc_name,
            :dep_id,
            :budget_id,
            SYSTIMESTAMP
        )
        `
            , {
                pd_id: data.pd_id,
                mc_name: data.mc_name,
                dep_id: data.dep_id,
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