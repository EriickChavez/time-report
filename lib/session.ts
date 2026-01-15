import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

/**
 * Set the session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
    const cookieStore = await cookies()

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
    })
}

/**
 * Get the session cookie value
 */
export async function getSessionCookie(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

/**
 * Delete the session cookie
 */
export async function deleteSessionCookie(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
}
