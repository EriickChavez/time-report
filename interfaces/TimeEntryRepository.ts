
import { TimeEntry } from "@/types/time-entry"

export interface TimeEntryRepository {
    getEntries(userId: string): Promise<TimeEntry[]>
    addEntry(entry: Omit<TimeEntry, "id" | "created_at" | "updated_at">): Promise<TimeEntry | null>
    deleteEntry(id: string, userId: string): Promise<boolean>
    updateEntry(id: string, userId: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null>
}
