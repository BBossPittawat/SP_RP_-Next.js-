import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(req) {

    const url = req.nextUrl.clone();
    const pathname = url.pathname;
    
    try {
        const token = cookies().get('token').value

        if (!token && pathname !== '/sp-rp') {
            throw new Error('invalid token')
        }

        if (token && pathname === '/sp-rp') {
            return NextResponse.redirect(new URL('/sp-rp/items', req.url));
        }

        return NextResponse.next();

    } catch (error) {
        console.log("error", error);
        response.cookies.set('token', '');
        const response = NextResponse.redirect(new URL('/sp-rp', req.url));
        return response;        
    }
}

export const config = {
    matcher: '/sp-rp/:path*',
};