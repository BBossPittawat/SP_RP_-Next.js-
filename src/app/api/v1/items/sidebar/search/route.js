import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

export async function POST(req) {

    try {
        // ----------------------------------------------------------------------------------- check api key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
        // ----------------------------------------------------------------------------------- check body
        const data = await req.json()

        if (!data.department ||
            !data.product ||
            !data.machine ||
            !Array.isArray(data.group)) {
            return NextResponse.json({ message: 'กรุณาเลือกข้อมูลให้ครบถ้วน' }, { status: 400 })
        }

        // ----------------------------------------------------------------------------------- query

        const groupList = data.group.join(',')

        const conn1 = await MT200conn()
        const query1 = await conn1.execute(`
        SELECT
             T1.ROWID,
             T1.PART_NO,
             T1.SPEC,
             T1.STOCK - COALESCE(Q.TOTAL_QTY, 0) AS STOCK,
             T1.IMG
        FROM F17_05_SPRP_PART_LIST T1
        JOIN F17_00_COMMON_CCC T2 ON T2.ID = T1.CCC_ID
        JOIN F17_00_COMMON_DEPARTMENT T3 ON T3.ID = T2.DEP_ID
        JOIN F17_05_SPRP_GROUP T6 ON T6.ID = T1.GROUP_ID
        LEFT JOIN (
          SELECT PART_ID, SUM(QTY) AS TOTAL_QTY
          FROM F17_05_SPRP_REQ_HIS
          WHERE ADMIN_JDM_STATUS IS NULL
          GROUP BY PART_ID
        ) Q ON Q.PART_ID = T1.ID
        WHERE T3.DEPARTMENT = :department
        AND T1.PD_ID = :product
        AND T1.MC_ID = :machine
        AND T6.ID IN (${groupList})
        ORDER BY T1.PART_NO
        `,
            {
                department: data.department,
                product: data.product,
                machine: data.machine,
            }
        )

        if (query1.rows.length === 0) {
            return NextResponse.json({ message: 'ไม่พบข้อมูลในระบบ' }, { status: 400 })
        }

        const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`

        const result = query1.rows.map(row => ({
            ROWID: row[0],
            PART_NO: row[1],
            SPEC: row[2],
            STOCK: row[3],
            IMG_URL: row[4] ? `${baseUrl}/api/v1/items/sidebar/image?partNo=${row[0]}` : null,
        }))

        return NextResponse.json(result)

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}