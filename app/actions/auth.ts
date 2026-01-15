'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, createSession, getSession } from '@/lib/auth'
import { setSessionCookie, deleteSessionCookie } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Profile } from '@prisma/client'

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
    fullName?: string
): Promise<AuthResult> {
    try {
        // Validate input
        if (!email || !password) {
            return { success: false, error: 'Email y contraseña son requeridos' }
        }

        if (password.length < 6) {
            return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' }
        }

        // Check if user already exists
        const existingUser = await prisma.profile.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { success: false, error: 'Este email ya está registrado' }
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user
        const user = await prisma.profile.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
            },
        })

        // Create session
        const token = await createSession(user.id)
        await setSessionCookie(token)

        // Return user without password
        const { password: _, ...userWithoutPassword } = user

        return { success: true, user: userWithoutPassword }
    } catch (error) {
        console.error('Signup error:', error)
        return { success: false, error: 'Error al crear la cuenta' }
    }
}

/**
 * Log in an existing user
 */
export async function login(email: string, password: string): Promise<AuthResult> {
    try {
        // Validate input
        if (!email || !password) {
            return { success: false, error: 'Email y contraseña son requeridos' }
        }

        // Find user
        const user = await prisma.profile.findUnique({
            where: { email },
        })

        if (!user) {
            return { success: false, error: 'Credenciales inválidas' }
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password)

        if (!isValidPassword) {
            return { success: false, error: 'Credenciales inválidas' }
        }

        // Create session
        const token = await createSession(user.id)
        await setSessionCookie(token)

        // Return user without password
        const { password: _, ...userWithoutPassword } = user

        return { success: true, user: userWithoutPassword }
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

        if (!session) {
            return null
        }

        const user = await prisma.profile.findUnique({
            where: { id: session.userId },
        })

        if (!user) {
            return null
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user

        return userWithoutPassword
    } catch (error) {
        console.error('Get current user error:', error)
        return null
    }
}
