import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import { mteDBconn } from '@/../utils/mteDB'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    // ---------------------------------------------------------------------------------  Check API key
    const apiKey = req.headers.get('apikey')
    if (apiKey !== process.env.API_KEY) {
      return new Response('Invalid API Key', { status: 401 })
    }

    // ---------------------------------------------------------------------------------  CCC query
    const conn1 = await MT200conn()
    const query1 = await conn1.execute(
      `
        SELECT ID,
        CCC_NAME,
        DEP_ID
        FROM F17_00_COMMON_CCC
        `
      , [])

    if (query1.rows.length === 0) {
      return new Response('no ccc data found', { status: 400 })
    }

    // ---------------------------------------------------------------------------------  MTLE query
    const ccc_result = ['6650', '86KC', '86TK'] // temporary test
    // console.log(ccc_result)
    // const ccc_result = query1.rows.map(row => row[1])
    const cccList = ccc_result.map(ccc => `'${ccc}'`).join(',')
    const conn2 = await mteDBconn()
    const query2 = await conn2.execute(
      `
        SELECT DISTINCT T1.CCC AS CCC,
        T1.PART_NO AS PART_NO,
        T1.SPECIFY AS SPEC,
        T1.STOCK_QTY AS STOCK,
        T1.ORD_POINT_QTY AS OP,
        T1.ECO_ORDER_QTY AS OQ,
        ROUND(T1.PUR_UNIT_PRICE_LOC, 2) AS LAST_PRICE,
        T1.HANDLING_CD AS UNIT,
        T1.LAST_ORD_CUR_CD AS CUR,
        T1.PURCHASE_LT AS LT,
        T1.MOQ AS MOQ,
        T1.LAST_VEN_CD AS VENDER_CODE,
        T2.SUPPLIER_NO AS VERDER_NAME,
        T2.QUOTE_UNI_DATE AS EXPIRE_DATE
        FROM MATERIAL_ITEM_MASTER T1
        JOIN MATERIAL_QUOTATION T2 ON T1.PART_NO = T2.PARTNO
        WHERE T1.CCC IN (${cccList})
          AND T1.STOCK_QTY <> 0
          AND T1.ACC_TITLE_CD = '64422'
          AND TO_DATE(T2.QUOTE_UNI_DATE, 'DD-MON-YY') = (
            SELECT MAX(TO_DATE(QUOTE_UNI_DATE, 'DD-MON-YY'))
            FROM MATERIAL_QUOTATION
            WHERE PARTNO = T1.PART_NO)
      `
    )

    if (query2.rows.length === 0) {
      return new Response('no MTLE data found', { status: 400 })
    }

    const mt200_format_mng = query2.rows.map(row => {
      const cccRow = query1.rows.find(ccc => ccc[1] === row[0])
      return {
        CCC_ID: Number(cccRow[0]),
        PART_NO: row[1],
        SPEC: row[2],
        PRICE: Number(row[6]).toFixed(2),
        CURR: row[8],
        UNIT: row[7],
        STOCK: Number(row[3])
      }
    })

    // ---------------------------------------------------------------------------------  MT200 STOCK query
    const conn3 = await MT200conn()
    const query3 = await conn3.execute(
      `
        SELECT  T1.CCC_ID,
                T1.PART_NO,
                T1.PRICE,
                T1.STOCK
        FROM F17_05_SPRP_PART_LIST T1
        LEFT JOIN F17_05_SPRP_DISCON_PART T2 ON T1.ID = T2.PART_LIST_ID
        WHERE T2.PART_LIST_ID IS NULL
        `
      , [])

    if (query3.rows.length === 0) {
      return new Response('no STOCK data found', { status: 400 })
    }

    const mt200_stock = query3.rows.map(row => {
      return {
        CCC_ID: row[0],
        PART_NO: row[1],
        PRICE: row[2],
        STOCK: Number(row[3])
      }
    })

    // console.log(mt200_stock)

    // ---------------------------------------------------------------------------------  compare data
    const conn4 = await MT200conn()

    for (const item of mt200_format_mng) {

      const stockItem = mt200_stock.find(stock => stock.CCC_ID === item.CCC_ID && stock.PART_NO === item.PART_NO)

      if (!stockItem) {
        // --------------------------------------------------------------------  Insert data that nothing in mt200db
        await conn4.execute(
          `
            INSERT INTO F17_05_SPRP_PART_LIST (
              CCC_ID, PART_NO, SPEC, PRICE, CURR, UNIT, STOCK
            ) VALUES (
              :CCC_ID, :PART_NO, :SPEC, :PRICE, :CURR, :UNIT, :STOCK
            )
            `,
          [
            item.CCC_ID,
            item.PART_NO,
            item.SPEC,
            item.PRICE,
            item.CURR,
            item.UNIT,
            item.STOCK
          ]
        )
      }
      else if (stockItem.STOCK !== item.STOCK) {
        // --------------------------------------------------------------------  update stock data [refer spirit]
        await conn4.execute(
          `
            UPDATE F17_05_SPRP_PART_LIST
            SET STOCK=:STOCK 
            WHERE CCC_ID=:CCC_ID 
            AND PART_NO=:PART_NO
            `,
          [item.STOCK.toFixed(2),
          item.CCC_ID.toFixed(2),
          item.PART_NO]
        )
        // console.log("Stock mismatch detected")
      }
    }

    await conn4.commit()
    return NextResponse.json({ message: 'Data update successfully' })

  } catch (error) {
    console.error(error)
    return new Response('Internal server error', { status: 500 })
  }
}