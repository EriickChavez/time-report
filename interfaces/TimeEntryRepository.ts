
import { TimeEntry } from "@/types/time-entry"

export interface TimeEntryRepository {
    getEntries(): Promise<TimeEntry[]>
    addEntry(entry: Omit<TimeEntry, "id" | "created_at" | "updated_at">): Promise<TimeEntry | null>
    deleteEntry(id: string): Promise<boolean>
    updateEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null>
}
