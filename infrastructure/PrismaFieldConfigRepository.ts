import { prisma } from "@/lib/prisma"

export interface FieldConfig {
    id: string
    userId: string
    fieldId: string
    label: string
    type: string
    required: boolean
    enabled: boolean
    allowFiles: boolean
    options: string[]
    order: number
}

export class PrismaFieldConfigRepository {
    async getConfigs(userId: string): Promise<FieldConfig[]> {
        const configs = await prisma.fieldConfig.findMany({
            where: { userId },
            orderBy: { order: "asc" },
        })

        return configs.map(this.mapToEntity)
    }

    async saveConfigs(userId: string, configs: Omit<FieldConfig, "id">[]): Promise<void> {
        // Simple strategy: delete all and re-insert or update
        await prisma.$transaction([
            prisma.fieldConfig.deleteMany({ where: { userId } }),
            prisma.fieldConfig.createMany({
                data: configs.map(c => ({
                    ...c,
                    userId,
                    options: c.options as any
                }))
            })
        ])
    }

    private mapToEntity(db: any): FieldConfig {
        return {
            id: db.id,
            userId: db.userId,
            fieldId: db.fieldId,
            label: db.label,
            type: db.type,
            required: db.required,
            enabled: db.enabled,
            allowFiles: db.allowFiles,
            options: (db.options as string[]) || [],
            order: db.order
        }
    }
}
