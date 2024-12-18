import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

export async function POST(req) {

    // let pd_mc_result, group_result

    try {
        // Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return new Response('Invalid API Key', { status: 401 })
        }

        // Check body
        const formData = await req.formData()
        const data = Object.fromEntries(formData.entries())

        // console.log(data)

        if (!data.id) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        // Construct dynamic SQL query
        let query = 'UPDATE F17_05_SPRP_PART_LIST SET '
        const fields = []
        const params = { id: data.id }

        if (data.img && data.img !== 'undefined') {
            fields.push('IMG = :img')
            params.img = Buffer.from(await formData.get('img').arrayBuffer())
        }
        if (data.product && data.product !== 'null') {
            fields.push('PD_ID = :pd_id')
            params.pd_id = data.product
        }
        if (data.machine && data.machine !== 'null') {
            fields.push('MC_ID = :mc_name_id')
            params.mc_name_id = data.machine
        }
        if (data.group && data.group !== 'null') {
            fields.push('GROUP_ID = :group_id')
            params.group_id = data.group
        }
        if (data.location && data.location !== 'null') {
            fields.push('LOCATION = :location')
            params.location = data.location
        }
        if (data.remark && data.remark !== 'null') {
            fields.push('REMARK = :remark')
            params.remark = data.remark
        }

        // If no fields to update, return early
        if (fields.length === 0) {
            return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 })
        }

        query += fields.join(', ') + ' WHERE ID = :id'

        const conn1 = await MT200conn()
        await conn1.execute(query, params)
        await conn1.commit()

        return NextResponse.json({ message: 'Data updated successfully' })

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}