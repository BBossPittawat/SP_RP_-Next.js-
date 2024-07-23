import { NextResponse } from 'next/server'
import { SignJWT, importJWK, jwtVerify } from 'jose'
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'

export async function GET(req) {

    try {
        // ----------------------------------------------------------------------------------- check api key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
            return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
        // ----------------------------------------------------------------------------------- get cookies
        const token = cookies().get('token')?.value

        if (!token) {
            throw new Error('Nothing token')
        }
        // ----------------------------------------------------------------------------------- decode
        const secretJWK = {
            kty: 'oct',
            k: process.env.JOSE_SECRET
        }

        const secrectKey = await importJWK(secretJWK, 'HS256')
        const { payload } = await jwtVerify(token, secrectKey)

        return NextResponse.json({ payload })

    } catch (error) {
        console.error(error)
        cookies().set('token', '')
        return NextResponse.redirect(new URL('/sp-rp', req.url));

    } finally {
        // const token = cookies().get('token')?.value
        // if (!token) {
        //     return NextResponse.redirect(new URL('/sp-rp', req.url))
        // }
    }
}