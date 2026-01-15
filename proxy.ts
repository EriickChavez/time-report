// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'secret-key' // Usa la misma que en tu signup/login
)

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionCookie = request.cookies.get('session')?.value

    let isAuthenticated = false
    if (sessionCookie) {
        try {
            // Validamos que el token sea real y no haya expirado
            await jwtVerify(sessionCookie, JWT_SECRET)
            isAuthenticated = true
        } catch (error) {
            isAuthenticated = false
        }
    }

    // Rutas que NO requieren protección (login y signup)
    const isAuthRoute = pathname === '/login' || pathname === '/signup'

    // Rutas públicas (estáticos, imágenes, etc.)
    const isPublicFile = pathname.startsWith('/_next') || pathname.includes('.')

    // CASO 1: No hay sesión y quiere entrar a una ruta protegida (como la Home)
    if (!isAuthenticated && !isAuthRoute && !isPublicFile) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // CASO 2: Hay sesión activa e intenta ir a Login o Signup
    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

// El matcher es vital para que Next.js sepa qué interceptar
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}