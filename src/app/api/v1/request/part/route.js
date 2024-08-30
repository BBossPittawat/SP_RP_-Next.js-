import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {

    let baseUrl
    //---------------------------------------------------------------------------------- Check API key
    const apiKey = req.headers.get('apikey')
    if (apiKey !== process.env.API_KEY) {
      return new Response('Invalid API Key', { status: 401 })
    }

    // --------------------------------------------------------------------------------- Check body
    const data = await req.json()
    if (!data.id) {
      return NextResponse.json({ message: 'invalid body' }, { status: 400 })
    }

    //---------------------------------------------------------------------------------- Query database
    const conn1 = await MT200conn()
    const query1 = await conn1.execute(
      `
      SELECT
          T1.ROWID,
          T1.IMG,
          T1.PART_NO,
          T1.SPEC,
          T1.PRICE,
          T1.CURR,
          T1.UNIT,
          T2.PD,
          T3.MC_NAME,
          T1.LOCATION,
        --T1.STOCK,
        --Q.TOTAL_QTY,
        --T1.STOCK - Q.TOTAL_QTY AS STOCK,
          T1.STOCK - COALESCE(Q.TOTAL_QTY, 0) AS STOCK,
          T2.DPM,
          T1.ID,
          T1.REMARK,
          TO_CHAR(T5.ORDERDTE, 'DD-MON-YY') AS ORDERDTE,
          TO_CHAR(T5.PDDT, 'DD-MON-YY') AS PDDT,
          T5.PDQTY,
          T5.VNDNAME,
          T1.OP,
          T1.OQ
      FROM 
          F17_05_SPRP_PART_LIST T1
      JOIN 
          F17_00_COMMON_PD T2 ON T1.PD_ID = T2.ID
      JOIN 
          F17_05_SPRP_MC T3 ON T1.MC_ID = T3.ID
      LEFT JOIN (
          SELECT PART_ID, SUM(QTY) AS TOTAL_QTY
          FROM F17_05_SPRP_REQ_HIS
          WHERE 
            ADMIN_JDM_STATUS IS NULL
          OR 
            ADMIN_JDM_STATUS = 1
          GROUP BY PART_ID
      ) Q ON Q.PART_ID = T1.ID
      JOIN
          F17_00_COMMON_CCC T4 ON T4.ID = T2.CCC_ID
      LEFT JOIN 
          MATERIALBACKLOG@MTLE T5 ON T4.CCC_NAME = T5.CCC AND T1.PART_NO = T5.PARTNO
      WHERE 
        T1.ID = :id
      `
      , {
        id: data.id
      }
    )

    if (query1.rows.length === 0) {
      return new Response('ไม่พบข้อมูลในระบบ', { status: 400 })
    }

    if (process.env.NODE_ENV === 'production') {
      baseUrl = 'http://mt200svr:8078'
    }
    else {
      baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`
    }

    const result = query1.rows.map(row => ({
      ROWID: row[0],
      ID: row[12],
      PART_NO: row[2],
      SPEC: row[3],
      SHOW_PRICE: new Intl.NumberFormat('en-US').format(row[4]),
      PRICE: row[4],
      CURR: row[5],
      UNIT: row[6],
      PD: row[7],
      MC_NAME: row[8],
      LOCATION: row[9],
      SHOW_STOCK: new Intl.NumberFormat('en-US').format(row[10]),
      STOCK: row[10],
      RAW_STOCK: row[10],
      IMG_URL: row[1] ? `${baseUrl}/api/v1/items/sidebar/image?partNo=${row[12]}` : null,
      DEPT: row[11],
      REMARK: row[13],
      BL_ORDERDTE: row[14],
      BL_PDDT: row[15] || "-",
      BL_PDQTY: new Intl.NumberFormat('en-US').format(row[16]),
      BL_VNDNAME: row[17],
      OP: row[18],
      OQ: row[19],
    }))

    return NextResponse.json(result)

  } catch (error) {
    console.error(error)
    return new Response('Internal server error', { status: 500 })
  }
}