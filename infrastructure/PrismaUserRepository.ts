import { prisma } from "@/lib/prisma"

export interface UserProfile {
    id: string
    email: string
    fullName?: string
    avatarUrl?: string
}

export class PrismaUserRepository {
    async getProfile(id: string): Promise<UserProfile | null> {
        const profile = await prisma.profile.findUnique({
            where: { id }
        })
        return profile ? this.mapToEntity(profile) : null
    }

    async upsertProfile(profile: UserProfile): Promise<UserProfile> {
        const dbProfile = await prisma.profile.upsert({
            where: { id: profile.id },
            update: {
                fullName: profile.fullName ?? null,
                avatarUrl: profile.avatarUrl ?? null,
            },
            create: {
                id: profile.id,
                email: profile.email,
                fullName: profile.fullName ?? null,
                avatarUrl: profile.avatarUrl ?? null,
            }
        })
        return this.mapToEntity(dbProfile)
    }

    private mapToEntity(db: any): UserProfile {
        return {
            id: db.id,
            email: db.email,
            fullName: db.fullName ?? undefined,
            avatarUrl: db.avatarUrl ?? undefined,
        }
    }
}
