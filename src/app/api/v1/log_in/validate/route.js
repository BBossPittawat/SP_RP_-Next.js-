import { NextResponse } from 'next/server'
import { mteDBconn } from '@/../utils/mteDB'
import { MT200conn } from '@/../utils/mt200DB'
import { SignJWT , importJWK } from 'jose'
import { cookies } from 'next/headers'

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
    // console.log(data)
    if (!data.username || 
      !data.password || 
      !data.department ||
      data.username.length > 6 || 
      data.password.length > 15 )
      {
      // console.error(data)
      return NextResponse.json({message: 'กรุณากรอกข้อมูลให้ครบถ้วน'},{ status: 400 })
    }
    // ----------------------------------------------------------------------------------- find user data
    const username = data.username
    const password = data.password

    const conn1 = await mteDBconn()
    const query1 = await conn1.execute(
    `
    SELECT EMPCODE,
    SUBSTR(EMPNAME_ENG, 1, INSTR(EMPNAME_ENG || ' ', ' ') - 1) AS FIRSTNAME,
    SECTION
    FROM EMPLOYEE_DATA
    WHERE EMPCODE = :username
    AND PERSONAL_ID = :password
    AND DATE_RESIGN = '0'
    `,
    [username,password]
    )

    if (query1.rows.length === 0) {
      return NextResponse.json({message: 'ไม่พบข้อมูลในระบบ'},{ status: 400 })
    }
    const emp_code = query1.rows[0][0]
    const name = query1.rows[0][1]
    const section = query1.rows[0][2]

    // ----------------------------------------------------------------------------------- check user status
    const conn2 = await MT200conn()
    const query2 = await conn2.execute(
    `
    SELECT EMP_CD
    FROM F17_05_SPRP_ADMIN
    WHERE EMP_CD = :emp_result
    `,
    [emp_code]
    )

    let JsonUserDetail = {
      "emp_code": emp_code,
      "department" : data.department,
      "section" : section,
      "name" : name,
      "status": "USER"
    }

    if (query2.rows.length > 0) {
      JsonUserDetail.status = "ADMIN"
    }

    // ----------------------------------------------------------------------------------- set token
    const secretJWK = {
      kty: 'oct',
      k: process.env.JOSE_SECRET
    }

    const secrectKey = await importJWK(secretJWK,'HS256')
    const token = await new SignJWT(JsonUserDetail)
                  .setProtectedHeader({ alg: 'HS256' })
                  .setIssuedAt()
                  .setExpirationTime('8h')
                  .sign(secrectKey)

    cookies().set('token',token)
    // ----------------------------------------------------------------------------------- navigate to next page

    return NextResponse.json( { status : "success" })

    } catch(error){
      console.error(error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }

}


// const emp_result = query1.rows[0][0]
    
//     return NextResponse.json( { emp_result })