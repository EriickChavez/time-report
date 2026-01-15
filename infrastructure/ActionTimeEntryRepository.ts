import { TimeEntry } from "@/types/time-entry"
import { TimeEntryRepository } from "@/interfaces/TimeEntryRepository"
import {
    getMysqlTimeEntries,
    addMysqlTimeEntry,
    deleteMysqlTimeEntry,
    updateMysqlTimeEntry
} from "@/app/actions/mysql-time-entries"

export class ActionTimeEntryRepository implements TimeEntryRepository {
    async getEntries(userId: string): Promise<TimeEntry[]> {
        return await getMysqlTimeEntries(userId)
    }

    async addEntry(entry: Omit<TimeEntry, "id" | "created_at" | "updated_at">): Promise<TimeEntry | null> {
        return await addMysqlTimeEntry(entry)
    }

    async deleteEntry(id: string, userId: string): Promise<boolean> {
        return await deleteMysqlTimeEntry(id, userId)
    }

    async updateEntry(id: string, userId: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null> {
        return await updateMysqlTimeEntry(id, userId, updates)
    }
}
