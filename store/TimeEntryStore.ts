
import { create } from "zustand"
import { TimeEntry } from "@/types/time-entry"
import { TimeEntryRepository } from "@/interfaces/TimeEntryRepository"
import { PrismaTimeEntryRepository } from "@/infrastructure/PrismaTimeEntryRepository"
import moment from "moment"

interface TimeEntryStore {
    entries: TimeEntry[]
    userId: string | null
    repository: TimeEntryRepository
    setUserId: (userId: string | null) => void
    setRepository: (repository: TimeEntryRepository) => void
    fetchEntries: () => Promise<void>
    addEntry: (entry: Omit<TimeEntry, "id" | "userId" | "created_at" | "updated_at">) => Promise<void>
    deleteEntry: (id: string) => Promise<void>
    updateEntry: (id: string, updates: Partial<TimeEntry>) => Promise<void>
    getEntriesByDateRange: (startDate: string, endDate: string) => TimeEntry[]
    getEntriesByDate: (date: string) => TimeEntry[]
}

export const useTimeEntryStore = create<TimeEntryStore>((set, get) => ({
    entries: [],
    userId: null,
    repository: new PrismaTimeEntryRepository(), // Prisma implementation

    setUserId: (userId) => {
        set({ userId })
        if (userId) get().fetchEntries()
    },

    setRepository: (repository: TimeEntryRepository) => {
        set({ repository })
        if (get().userId) get().fetchEntries()
    },

    fetchEntries: async () => {
        const { userId, repository } = get()
        if (!userId) return

        const entries = await repository.getEntries(userId)
        set({ entries })
    },

    addEntry: async (entry) => {
        const { userId, repository } = get()
        if (!userId) return

        const newEntry = await repository.addEntry({ ...entry, userId })
        if (newEntry) {
            set((state) => ({
                entries: [newEntry, ...state.entries],
            }))
        }
    },

    deleteEntry: async (id) => {
        const { userId, repository } = get()
        if (!userId) return

        const success = await repository.deleteEntry(id, userId)
        if (success) {
            set((state) => ({
                entries: state.entries.filter((entry) => entry.id !== id),
            }))
        }
    },

    updateEntry: async (id, updates) => {
        const { userId, repository } = get()
        if (!userId) return

        const updatedEntry = await repository.updateEntry(id, userId, updates)
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
