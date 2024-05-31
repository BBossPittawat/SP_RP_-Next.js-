import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

export async function POST(req) {


    try {
        // ----------------------------------------------------------------------------------- check api key
        const apiKey = req.headers.get('apikey')
        if (apiKey !== process.env.API_KEY) {
        return NextResponse.json({ message: 'Invalid API Key' }, { status: 401 });
        }
        // -----------------------------------------------------------------------------------

        const token = cookies().set('token', '')

        return NextResponse.json( { status : "success" })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}