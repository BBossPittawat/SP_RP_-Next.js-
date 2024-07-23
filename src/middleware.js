import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(req) {
    try {
        const url = req.nextUrl.clone();
        const pathname = url.pathname;

        if (pathname === '/sp-rp/monitor') {
            return NextResponse.next();
        }

        const token = req.cookies.get('token');
        const tokenValue = token ? token.value : '';

        if (pathname === '/sp-rp') {
            if (tokenValue !== '') {
                return NextResponse.redirect(new URL('/sp-rp/items', req.url));
            }
        } else {
            if (tokenValue === '') {
                return NextResponse.redirect(new URL('/sp-rp', req.url))
            }
        }
    } catch (error) {
        cookies().set('token', '', { path: '/' });
        return NextResponse.redirect(new URL('/sp-rp', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/sp-rp/:path*',
}