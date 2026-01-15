'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/app/actions/auth'
import { Profile } from '@prisma/client'

type User = Omit<Profile, 'password'>

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    return { user, loading }
}
