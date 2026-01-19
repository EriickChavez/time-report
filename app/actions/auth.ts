'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, createSession, getSession } from '@/lib/auth'
import { setSessionCookie, deleteSessionCookie } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Profile } from '@prisma/client'
import { LOGIN_URL, SIGNUP_URL } from '@/services/services'
import api from '@/services/api'

export type AuthResult = {
    success: boolean
    error?: string
    user?: Omit<Profile, 'password'>
}

/**
 * Sign up a new user
 */
export async function signup(
    email: string,
    password: string,
    full_name?: string
): Promise<AuthResult> {
    try {
        // Validate input
        if (!email || !password) {
            return { success: false, error: 'Email y contraseña son requeridos' }
        }

        if (password.length < 6) {
            return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' }
        }

        const response = await api.post(SIGNUP_URL, { email, password, full_name })

        if (!response.success) {
            return { success: false, error: response.error }
        }

        const { user, token } = response.data;

        if (!user) {
            return { success: false, error: 'Credenciales inválidas' }
        }

        // Create session
        await setSessionCookie(token)

        return { success: true, user }
    } catch (error) {
        console.error('Signup error:', error)
        return { success: false, error: 'Error al crear la cuenta' }
    }
}

/**
 * Log in an existing user
 */
export async function login(email: string, password: string): Promise<AuthResult> {
    console.log("LOGIN", email, password)
    try {
        // Validate input
        if (!email || !password) {
            return { success: false, error: 'Email y contraseña son requeridos' }
        }

        const response = await api.post(LOGIN_URL, { email, password })
        console.log("[RESPONSE]", response)

        if (!response.success) {
            return { success: false, error: response.error }
        }

        const { user, token } = response.data;

        if (!user) {
            return { success: false, error: 'Credenciales inválidas' }
        }

        // Create session
        await setSessionCookie(token)
        // 2. Guardar los datos visuales en localStorage (Para la UI)
        console.log("[USER TO SAVE]", typeof window !== 'undefined', user)
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }

        return { success: true, user }
    } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: 'Error al iniciar sesión' }
    }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
    await deleteSessionCookie()
    redirect('/login')
}

/**
 * Get the currently authenticated user
 */
export async function getCurrentUser(): Promise<Omit<Profile, 'password'> | null> {
    try {
        const session = await getSession()
        console.log("[SESSION]", session)
        if (!session) {
            return null
        }

        let user = null;

        if (!user) {
            return null
        }

        return JSON.parse(user)
    } catch (error) {
        console.error('Get current user error:', error)
        return null
    }
}
