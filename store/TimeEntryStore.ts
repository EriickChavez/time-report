import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getLocalStorageItem } from "@/lib/storage";
import { createTimeEntry, getTimeEntriesByUser, deleteTimeEntry } from "@/app/actions/time-entries";
import moment from "moment";

export interface TimeEntry {
    id: string;
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    reporter: string;
    status: string;
    fieldData: Record<string, any>;
    files: string[];
}

interface TimeEntryStore {
    entries: TimeEntry[];
    initializeEntries: () => Promise<void>;
    addEntry: (entry: Omit<TimeEntry, "id" | "userId">) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
    getEntriesByDateRange: (start: string, end: string) => TimeEntry[];
}

export const useTimeEntryStore = create<TimeEntryStore>()(
    persist(
        (set, get) => ({
            entries: [],
            initializeEntries: async () => {
                const userJson = getLocalStorageItem("user");
                if (!userJson) return;
                const user = JSON.parse(userJson);
                const result = await getTimeEntriesByUser(user.id);
                if (result.success) set({ entries: Array.isArray(result.data) ? result.data : (result.data.entries || []) });
            },
            addEntry: async (entryData) => {
                const userJson = getLocalStorageItem("user");
                if (!userJson) return;
                const user = JSON.parse(userJson);

                const backendPayload = {
                    userId: user.id,
                    date: entryData.date,
                    startTime: entryData.startTime,
                    endTime: entryData.endTime,
                    reporter: entryData.reporter,
                    status: entryData.status,
                    fieldData: entryData.fieldData,
                    files: entryData.files || []
                };

                try {
                    const result = await createTimeEntry(backendPayload);

                    if (result && result.success) {
                        const newEntry = {
                            ...result.data,
                            startTime: entryData.startTime,
                            endTime: entryData.endTime,
                            reporter: entryData.reporter,
                            fieldData: entryData.fieldData,
                            files: entryData.files || []
                        };

                        set((state) => ({
                            entries: [newEntry, ...state.entries]
                        }));
                    } else {
                        throw new Error(result?.message || "Error al guardar");
                    }
                } catch (error: any) {
                    console.error("Error en addEntry Store:", error);
                    throw error;
                }
            },
            deleteEntry: async (id) => {
                const result = await deleteTimeEntry(id);
                if (result.success) set((state) => ({ entries: state.entries.filter(e => e.id !== id) }));
            },
            getEntriesByDateRange: (start: string, end: string) => {
                return get().entries.filter((entry) => {
                    const entryDate = moment(entry.date);
                    return entryDate.isSameOrAfter(start, 'day') && entryDate.isSameOrAfter(end, 'day');
                });
            },
        }),
        { name: "time-entries-storage" }
    )
);