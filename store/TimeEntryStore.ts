import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getLocalStorageItem } from "@/lib/storage";
import { createTimeEntry, getTimeEntriesByUser, deleteTimeEntry } from "@/app/actions/time-entries";

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
}

export const useTimeEntryStore = create<TimeEntryStore>()(
    persist(
        (set) => ({
            entries: [],
            initializeEntries: async () => {
                const userJson = getLocalStorageItem("user");
                if (!userJson) return;
                const user = JSON.parse(userJson);
                const result = await getTimeEntriesByUser(user.id);
                // Ajuste para manejar si la API devuelve directamente el array o un objeto con .entries
                if (result.success) set({ entries: Array.isArray(result.data) ? result.data : (result.data.entries || []) });
            },
            addEntry: async (entryData) => {
                const userJson = getLocalStorageItem("user");
                if (!userJson) return;
                const user = JSON.parse(userJson);

                // PAYLOAD EXACTO PARA TU BACKEND
                // Coincide con: const { userId, date, startTime, ... } = req.body;
                const backendPayload = {
                    userId: user.id,          // Cambiado de user_id a userId
                    date: entryData.date,      // YYYY-MM-DD
                    startTime: entryData.startTime, // Cambiado de start_time a startTime
                    endTime: entryData.endTime,     // Cambiado de end_time a endTime
                    reporter: entryData.reporter,
                    status: entryData.status,
                    fieldData: entryData.fieldData, // Cambiado de field_data a fieldData
                    files: entryData.files || []
                };

                try {
                    const result = await createTimeEntry(backendPayload);

                    if (result && result.success) {
                        // Importante: Tu backend devuelve { id, userId, date, status } en result.data
                        // Combinamos con entryData para no perder la información visual en el store
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
                    throw error; // Re-lanzar para que el componente muestre el alert
                }
            },
            deleteEntry: async (id) => {
                const result = await deleteTimeEntry(id);
                if (result.success) set((state) => ({ entries: state.entries.filter(e => e.id !== id) }));
            }
        }),
        { name: "time-entries-storage" }
    )
);