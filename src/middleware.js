import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(req) {

    const url = req.nextUrl.clone();
    const pathname = url.pathname;
    const token = req.cookies.get('token');

    const tokenValue = token ? token.value : '';

    // console.log(tokenValue);

    if (pathname === '/sp-rp') {
        if (tokenValue !== '') {
            return NextResponse.redirect(new URL('/sp-rp/items', req.url));
        }

    } else {
        if (tokenValue === '' ) {
            return NextResponse.redirect(new URL('/sp-rp', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/sp-rp/:path*',
};