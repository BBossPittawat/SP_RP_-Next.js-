import { NextResponse } from 'next/server'
import { MT200conn } from '@/../utils/mt200DB'
import { spiritDBconn } from '@/../utils/spiritDB'

export const dynamic = 'force-dynamic'

let mt200Pool
let spiritPool

// Function to get MT200 Oracle pool connection
async function getMT200Pool() {
  if (!mt200Pool) {
    mt200Pool = await MT200conn() // Initialize connection pool
  }
  return mt200Pool
}

// Function to get Spirit Oracle pool connection
async function getSpiritPool() {
  if (!spiritPool) {
    spiritPool = await spiritDBconn() // Initialize connection pool
  }
  return spiritPool
}

export async function POST(req) {
  let conn1, conn2, conn3, conn4
  try {
    // Check API key
    const apiKey = req.headers.get('apikey')
    if (apiKey !== process.env.API_KEY) {
      return new Response('Invalid API Key', { status: 401 })
    }

    // Execute CCC and MTLE queries in parallel
    [conn1, conn2] = await Promise.all([getMT200Pool(), getSpiritPool()])

    if (!conn1 || !conn2) {
      throw new Error('Database connections could not be established')
    }

    // CCC query
    const [query1, query2] = await Promise.all([
      conn1.execute(`
        SELECT ID, CCC_NAME, DEP_ID 
        FROM F17_00_COMMON_CCC
      `),
      conn2.execute(`
        SELECT DISTINCT 
          T1.CD00059 AS CCC,
          T1.CD05185 AS PART_NO,
          T1.DH00070 AS SPEC,
          T1.SU00355 AS STOCK,
          T1.SU00372 AS OP,
          T1.SU00363 AS OQ,
          ROUND(T1.TK00051, 2) AS LAST_PRICE,
          T1.CD00127 AS UNIT,
          T1.CD06355 AS CUR,
          T1.NI00010 AS LT, 
          T1.SU00357 AS MOQ,
          T1.CD00426 AS VENDER_CODE,
          T2.DH00067 AS VERDER_NAME,
          TO_CHAR(T2.HI31507, 'DD-Mon-YY', 'NLS_DATE_LANGUAGE = AMERICAN') AS EXPIRE_DATE
        FROM SCHM_C600_MTL.MV0008 T1
        LEFT JOIN SCHM_C600_MTL.MV4001WF T2 ON T1.CD05185 = T2.CD05185
        WHERE T1.CD00059 IN (${['6650', '86KC', '86TK'].map(ccc => `'${ccc}'`).join(',')})
        AND T1.CD06355 IS NOT NULL
        AND T1.CD00042A = '64422'
        AND (
            T2.CD05185 IS NULL OR
            T2.HI31507 = (
                SELECT MAX(HI31507)
                FROM SCHM_C600_MTL.MV4001WF
                WHERE CD05185 = T1.CD05185
            )
        )
      `)
    ])

    if (query1.rows.length === 0 || query2.rows.length === 0) {
      return new Response('no data found', { status: 400 })
    }

    // Format the data for mt200_format_mng
    const mt200_format_mng = query2.rows.map(row => {
      const cccRow = query1.rows.find(ccc => ccc[1] === row[0])
      return {
        CCC_ID: Number(cccRow[0]),
        PART_NO: row[1],
        SPEC: row[2],
        PRICE: Number(row[6]).toFixed(2),
        CURR: row[8],
        UNIT: row[7],
        STOCK: Number(row[3]),
        OP: row[4] || 0,
        OQ: row[5] || 0
      }
    })

    // Execute MT200 STOCK query
    conn3 = await getMT200Pool()
    const query3 = await conn3.execute(`
      SELECT  T1.CCC_ID,
              T1.PART_NO,
              T1.PRICE,
              T1.STOCK
      FROM F17_05_SPRP_PART_LIST T1
      LEFT JOIN F17_05_SPRP_DISCON_PART T2 ON T1.ID = T2.PART_LIST_ID
      WHERE T2.PART_LIST_ID IS NULL
    `)

    if (query3.rows.length === 0) {
      return new Response('no STOCK data found', { status: 400 })
    }

    const mt200_stock = query3.rows.map(row => ({
      CCC_ID: row[0],
      PART_NO: row[1],
      PRICE: row[2],
      STOCK: Number(row[3])
    }))

    // Compare and update data in batches using parameterized queries
    conn4 = await getMT200Pool()
    const updates = mt200_format_mng.map(item => {
      const stockItem = mt200_stock.find(stock => stock.CCC_ID === item.CCC_ID && stock.PART_NO === item.PART_NO)
      if (!stockItem) {
        // Insert new data
        const insertQuery = `
          INSERT INTO F17_05_SPRP_PART_LIST 
            (CCC_ID, PART_NO, SPEC, PRICE, CURR, UNIT, STOCK, OP, OQ)
          VALUES (:ccc_id, :part_no, :spec, :price, :curr, :unit, :stock, :op, :oq)
        `
        return conn4.execute(insertQuery, {
          ccc_id: item.CCC_ID,
          part_no: item.PART_NO,
          spec: item.SPEC,
          price: Number(item.PRICE),
          curr: 'THB',
          unit: item.UNIT,
          stock: Number(item.STOCK),
          op: Number(item.OP),
          oq: Number(item.OQ)
        })
      } else if (stockItem.STOCK !== item.STOCK) {
        // Update stock data
        const updateQuery = `
          UPDATE F17_05_SPRP_PART_LIST
          SET STOCK = :stock, OP = :op, OQ = :oq, PRICE = :price
          WHERE CCC_ID = :ccc_id AND PART_NO = :part_no
        `
        return conn4.execute(updateQuery, {
          stock: Number(item.STOCK).toFixed(2),
          op: Number(item.OP),
          oq: Number(item.OQ),
          price: Number(item.PRICE),
          ccc_id: item.CCC_ID,
          part_no: item.PART_NO
        })
      }
    })

    if (updates.length) {
      await Promise.all(updates)
    }

    await conn4.commit()

    // Final status update query
    await conn4.execute(`
      UPDATE F17_05_SPRP_REQ_HIS  
      SET ADMIN_JDM_STATUS = 3  
      WHERE ADMIN_JDM_STATUS = 1
    `)

    await conn4.commit()

    return NextResponse.json({ message: 'Data updated successfully' })

  } catch (error) {
    console.error(error)
    return new Response('Internal server error', { status: 500 })
  }
}
