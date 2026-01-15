
import { TimeEntry } from "@/types/time-entry"
import { TimeEntryRepository } from "@/interfaces/TimeEntryRepository"
import { createClient } from "@/lib/supabase"

export class SupabaseTimeEntryRepository implements TimeEntryRepository {
    async getEntries(): Promise<TimeEntry[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from("time_entries")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching entries:", error)
            return []
        }

        return (data as TimeEntry[]) || []
    }

    async addEntry(entry: Omit<TimeEntry, "id" | "created_at" | "updated_at">): Promise<TimeEntry | null> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from("time_entries")
            .insert([entry])
            .select()
            .single()

        if (error) {
            console.error("Error adding entry:", error)
            return null
        }

        return data as TimeEntry
    }

    async deleteEntry(id: string): Promise<boolean> {
        const supabase = createClient()
        const { error } = await supabase.from("time_entries").delete().eq("id", id)

        if (error) {
            console.error("Error deleting entry:", error)
            return false
        }

        return true
    }

    async updateEntry(id: string, updates: Partial<TimeEntry>): Promise<TimeEntry | null> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from("time_entries")
            .update(updates)
            .eq("id", id)
            .select()
            .single()

        if (error) {
            console.error("Error updating entry:", error)
            return null
        }

        return data as TimeEntry
    }
}
