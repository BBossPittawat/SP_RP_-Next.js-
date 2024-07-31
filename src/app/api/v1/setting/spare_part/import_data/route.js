import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(req) {
    try {
        // -------------------------------------------------------------------------------------- Check API key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return new Response('Invalid API Key', { status: 401 })
        }

        // -------------------------------------------------------------------------------------- Check body
        const data = await req.json()
        if (!data.id || !data.ccc || !data.product || !data.machine || !data.group || !data.location || !data.remark) {
            return NextResponse.json({ message: 'invalid body' }, { status: 400 })
        }

        // console.log(data)

        // -------------------------------------------------------------------------------------- Define paths
        const sourceDir = `\\\\Mt200svr\\DX-DATA\\SP-RP\\IMG\\${data.ccc}`
        const destinationDir = path.join(sourceDir, data.location)

        try {
            const files = await fs.readdir(sourceDir)
            const fileName = files.find(file => file.startsWith(data.location) &&
                (
                    file.endsWith('.JPG') ||
                    file.endsWith('.PNG') ||
                    file.endsWith('.jpg') ||
                    file.endsWith('.png')
                ))

            if (!fileName) {
                console.error('File not found')
                return NextResponse.json({ message: 'File not found' }, { status: 404 })
            }

            const imgBuffer = await fs.readFile(path.join(sourceDir, fileName))
            // console.log(fileName)

            let query = 'UPDATE F17_05_SPRP_PART_LIST SET '
            const fields = []
            const params = { id: data.id }

            fields.push('IMG = :img')
            params.img = imgBuffer

            if (data.product == '0' || !data.product) {
                fields.push('PD_ID = NULL')
            } else {
                fields.push(`PD_ID = (
                    SELECT ID 
                    FROM F17_00_COMMON_PD 
                    WHERE PD = :pd_id_1 )`);
                params.pd_id_1 = data.product !== '0' ? data.product : null;
            }

            if (data.product == '0' || data.machine == '0' || !data.product || !data.machine) {
                fields.push('MC_ID = NULL')
            } else {
                fields.push(`MC_ID = (
                    SELECT T1.ID 
                    FROM F17_05_SPRP_MC T1
                    JOIN F17_00_COMMON_PD T2 ON T2.ID = T1.PD_ID
                    WHERE T2.PD = :pd_id_2
                    AND T1.MC_NAME = :machine_name )`);
                params.pd_id_2 = data.product;
                params.machine_name = data.machine;
            }

            if (data.group == '0' || !data.group) {
                fields.push('GROUP_ID = NULL')
            } else {
                fields.push(`GROUP_ID = (
                    SELECT ID 
                    FROM F17_05_SPRP_GROUP 
                    WHERE ENG_NAME = :group_name )`);
                params.group_name = data.group;
            }

            if (data.location == '0' || !data.location) {
                fields.push('LOCATION = NULL')
            } else {
                fields.push('LOCATION= :location')
                params.location = data.location
            }

            if (data.remark == '0' || !data.remark) {
                fields.push('REMARK = NULL')
            } else {
                fields.push('REMARK= :remark')
                params.remark = data.remark
            }

            fields.push('DTE_UPDATE = SYSTIMESTAMP')

            query += fields.join(', ') + ' WHERE ID = :id'

            if (fields.length === 0) {
                return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 })
            }

            const conn1 = await MT200conn()
            await conn1.execute(query, params)
            await conn1.commit()

            return NextResponse.json({ message: 'Data updated successfully' })

        } catch (err) {
            console.error('Error reading directory:', err)
            return NextResponse.json({ message: 'Error reading directory' }, { status: 500 })
        }

    } catch (error) {
        console.error(error)
        return new Response('Internal server error', { status: 500 })
    }
}