import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'secret-key'
)

// Routes that require authentication
const protectedRoutes = ['/']

// Routes that should redirect to home if already authenticated
const authRoutes = ['/login', '/signup']

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionCookie = request.cookies.get('session')?.value

    // Verify session
    let isAuthenticated = false
    if (sessionCookie) {
        try {
            await jwtVerify(sessionCookie, JWT_SECRET)
            isAuthenticated = true
        } catch (error) {
            // Invalid token
            isAuthenticated = false
        }
    }

    // Redirect to login if trying to access protected route without auth
    if (protectedRoutes.includes(pathname) && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect to home if trying to access auth routes while authenticated
    if (authRoutes.includes(pathname) && isAuthenticated) {
        const homeUrl = new URL('/', request.url)
        return NextResponse.redirect(homeUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/login', '/signup'],
}
