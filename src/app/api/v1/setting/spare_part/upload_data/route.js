import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

export async function POST(req) {

    let pd_mc_result, group_result

    try {
        // Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return new Response('Invalid API Key', { status: 401 })
        }

        // Check body
        const formData = await req.formData()
        const data = Object.fromEntries(formData.entries())

        if (!data.id) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        // console.log(data)

        // -------------------------------------------------------------------------------- Get product & machine ID
        if (data.product && data.machine) {
            const conn1 = await MT200conn()
            const query1 = await conn1.execute(`
            SELECT
                T2.ID,
                T1.ID
            FROM
                F17_05_SPRP_MC T1
            JOIN
                F17_00_COMMON_PD T2 ON T2.ID = T1.PD_ID
            JOIN 
                F17_00_COMMON_DEPARTMENT T3 ON T3.ID = T1.DEP_ID
            WHERE
                T2.PD = :pd
            AND
                T1.MC_NAME = :mc_name
            `
                , {
                    pd: data.product,
                    mc_name: data.machine
                }
            )

            if (query1.rows.length === 0) {
                return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
            }

            pd_mc_result = query1.rows.map(row => ({
                PD_ID: row[0],
                MC_ID: row[1],
            }))

        }

        // -------------------------------------------------------------------------------- Get group ID
        if (data.group) {
            const conn1 = await MT200conn()
            const query1 = await conn1.execute(`
            SELECT
                ID
            FROM
                F17_05_SPRP_GROUP
            WHERE
                ENG_NAME = :eng_name
            `
                , {
                    eng_name: data.group,
                }
            )

            if (query1.rows.length === 0) {
                return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
            }

            group_result = query1.rows.map(row => ({
                GROUP_ID: row[0],
            }))

        }

        // console.log(pd_mc_result[0].PD_ID)

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
            params.pd_id = pd_mc_result[0].PD_ID
        }
        if (data.machine && data.machine !== 'null') {
            fields.push('MC_ID = :mc_name_id')
            params.mc_name_id = pd_mc_result[0].MC_ID
        }
        if (data.group && data.group !== 'null') {
            fields.push('GROUP_ID = :group_id')
            params.group_id = group_result[0].GROUP_ID
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