
import { create } from "zustand"
import { TimeEntry } from "@/types/time-entry"
import { TimeEntryRepository } from "@/interfaces/TimeEntryRepository"
import { SupabaseTimeEntryRepository } from "@/infrastructure/SupabaseTimeEntryRepository"
import moment from "moment"

interface TimeEntryStore {
    entries: TimeEntry[]
    repository: TimeEntryRepository
    fetchEntries: () => Promise<void>
    addEntry: (entry: Omit<TimeEntry, "id" | "created_at" | "updated_at">) => Promise<void>
    deleteEntry: (id: string) => Promise<void>
    updateEntry: (id: string, updates: Partial<TimeEntry>) => Promise<void>
    getEntriesByDateRange: (startDate: string, endDate: string) => TimeEntry[]
    getEntriesByDate: (date: string) => TimeEntry[]
}

export const useTimeEntryStore = create<TimeEntryStore>((set, get) => ({
    entries: [],
    repository: new SupabaseTimeEntryRepository(), // Default implementation

    fetchEntries: async () => {
        const entries = await get().repository.getEntries()
        set({ entries })
    },

    addEntry: async (entry) => {
        const newEntry = await get().repository.addEntry(entry)
        if (newEntry) {
            set((state) => ({
                entries: [newEntry, ...state.entries],
            }))
        }
    },

    deleteEntry: async (id) => {
        const success = await get().repository.deleteEntry(id)
        if (success) {
            set((state) => ({
                entries: state.entries.filter((entry) => entry.id !== id),
            }))
        }
    },

    updateEntry: async (id, updates) => {
        const updatedEntry = await get().repository.updateEntry(id, updates)
        if (updatedEntry) {
            set((state) => ({
                entries: state.entries.map((entry) => (entry.id === id ? updatedEntry : entry)),
            }))
        }
    },

    getEntriesByDateRange: (startDate, endDate) => {
        const start = moment(startDate)
        const end = moment(endDate)
        return get().entries.filter((entry) => {
            const entryDate = moment(entry.date)
            return entryDate.isSameOrAfter(start, "day") && entryDate.isSameOrBefore(end, "day")
        })
    },

    getEntriesByDate: (date) => {
        return get().entries.filter((entry) => entry.date === date)
    },
}))
