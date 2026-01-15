import { TimeEntry } from "@/types/time-entry"
import { TimeEntryRepository } from "@/interfaces/TimeEntryRepository"
import { prisma } from "@/lib/prisma"

export class PrismaTimeEntryRepository implements TimeEntryRepository {
    async getEntries(userId: string): Promise<TimeEntry[]> {
        const entries = await prisma.timeEntry.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })

        return entries.map((entry) => this.mapToEntity(entry))
    }

    async addEntry(entry: Omit<TimeEntry, "id" | "created_at" | "updated_at">): Promise<TimeEntry | null> {
        const newEntry = await prisma.timeEntry.create({
            data: {
                userId: entry.userId,
                date: entry.date,
                startTime: entry.startTime,
                endTime: entry.endTime,
                reporter: entry.reporter,
                evidence: entry.evidence,
                observations: entry.observations,
                status: entry.status,
                evidenceFiles: entry.evidenceFiles as any,
                observationFiles: entry.observationFiles as any,
                project: entry.project,
                task: entry.task,
                description: entry.description,
                duration: entry.duration,
                fieldData: entry.customFields as any,
            }
        })

        return this.mapToEntity(newEntry)
    }

    async deleteEntry(id: string, userId: string): Promise<boolean> {
        try {
            await prisma.timeEntry.delete({
                where: { id, userId }
            })
            return true
        } catch (error) {
            console.error("Error deleting entry from MySQL:", error)
            return false
        }
    }

    async updateEntry(id: string, userId: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null> {
        const updatedEntry = await prisma.timeEntry.update({
            where: { id, userId },
            data: {
                date: updates.date,
                startTime: updates.startTime,
                endTime: updates.endTime,
                reporter: updates.reporter,
                evidence: updates.evidence,
                observations: updates.observations,
                status: updates.status,
                evidenceFiles: updates.evidenceFiles as any,
                observationFiles: updates.observationFiles as any,
                project: updates.project,
                task: updates.task,
                description: updates.description,
                duration: updates.duration,
                fieldData: updates.customFields as any,
            }
        })

        return this.mapToEntity(updatedEntry)
    }

    private mapToEntity(dbEntry: any): TimeEntry {
        return {
            id: dbEntry.id,
            userId: dbEntry.userId,
            created_at: dbEntry.createdAt.toISOString(),
            updated_at: dbEntry.updatedAt.toISOString(),
            date: dbEntry.date,
            startTime: dbEntry.startTime || "",
            endTime: dbEntry.endTime || "",
            reporter: dbEntry.reporter || "",
            evidence: dbEntry.evidence || "",
            observations: dbEntry.observations || "",
            status: dbEntry.status,
            evidenceFiles: (dbEntry.evidenceFiles as string[]) || [],
            observationFiles: (dbEntry.observationFiles as string[]) || [],
            project: dbEntry.project || undefined,
            task: dbEntry.task || undefined,
            description: dbEntry.description || undefined,
            duration: dbEntry.duration || undefined,
            customFields: (dbEntry.fieldData as Record<string, any>) || undefined,
        }
    }
}
