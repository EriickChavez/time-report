import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/app/actions/auth'
import { Profile } from '@prisma/client'
import { getLocalStorageItem } from '../storage'

type User = Omit<Profile, 'password'>

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true)
                await getCurrentUser()
                const data = getLocalStorageItem("user")
                console.log("[USER FETCHED]", data)
                setUser(data ? JSON.parse(data) : null)
            } catch (error) {
                console.error("Error fetching user:", error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    return { user, loading }
}