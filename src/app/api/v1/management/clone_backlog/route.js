import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import { mteDBconn } from '@/../utils/mteDB'
// import { spiritDBconn } from '@/../utils/spiritDB'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    // ---------------------------------------------------------------------------------  Check API key
    const apiKey = req.headers.get('apikey')
    if (apiKey !== process.env.API_KEY) {
      return new Response('Invalid API Key', { status: 401 })
    }

    // ---------------------------------------------------------------------------------  CCC query
    // const conn1 = await MT200conn()
    // const query1 = await conn1.execute(
    //   `
    //     SELECT ID,
    //     CCC_NAME,
    //     DEP_ID
    //     FROM F17_00_COMMON_CCC
    //     `
    //   , [])

    // if (query1.rows.length === 0) {
    //   return new Response('no ccc data found', { status: 400 })
    // }

    // ---------------------------------------------------------------------------------  MTLE backlog query
    const ccc_result = ['6650', '86KC', '86TK'] // temporary test
    // console.log(ccc_result)
    // const ccc_result = query1.rows.map(row => row[1])
    const cccList = ccc_result.map(ccc => `'${ccc}'`).join(',')
    const conn2 = await mteDBconn()
    const query2 = await conn2.execute(
      `
        SELECT DISTINCT
          T1.CCC,
          T1.PARTNO,
          TO_CHAR(T1.ORDERDTE, 'DD-MON-YY') AS ORDERDTE,
          TO_CHAR(T1.PDDT, 'DD-MON-YY') AS PDDT,
          T1.PDQTY,
          T1.VNDNAME
        FROM MATERIALBACKLOG T1
        WHERE T1.ACC = '64422'
        AND T1.CCC IN (${cccList})
      `
    )

    if (query2.rows.length === 0) {
      return new Response('no data found', { status: 400 })
    }

    const backlog_data = query2.rows.map(row => {
      return {
        CCC: row[0],
        PARTNO: row[1],
        ORDERDTE: row[2],
        PDDT: row[3],
        PDQTY: row[4],
        VNDNAME: row[5]
      }
    })

    // --------------------------------------------------------------------------------- Clean database
    const conn3 = await MT200conn()

    await conn3.execute(
      `
      UPDATE F17_05_SPRP_PART_LIST
      SET 
          BL_ORDERDTE = NULL,
          BL_PDDT = NULL,
          BL_PDQTY = NULL,
          BL_VNDNAME = NULL
      `
    )
    await conn3.commit()

    // --------------------------------------------------------------------------------- update backlog data
    for (let i = 0; i < backlog_data.length; i += 100) {
      let batch_data = backlog_data.slice(i, i + 100)

      let binds = batch_data.map(item => ({
        ccc: item.CCC,
        partno: item.PARTNO,
        orderdte: item.ORDERDTE,
        pddt: item.PDDT,
        pdqty: item.PDQTY,
        vndname: item.VNDNAME
      }))

      let sql = `
        UPDATE F17_05_SPRP_PART_LIST
        SET 
            BL_ORDERDTE = :orderdte,
            BL_PDDT = :pddt,
            BL_PDQTY = :pdqty,
            BL_VNDNAME = :vndname
        WHERE PART_NO = :partno
        AND CCC_ID = (SELECT ID FROM F17_00_COMMON_CCC WHERE CCC_NAME = :ccc)
      `

      await conn3.executeMany(sql, binds)
    }

    await conn3.commit()

    return NextResponse.json({ message: 'Data update successfully' })

  } catch (error) {
    console.error(error)
    return new Response('Internal server error', { status: 500 })
  }
}