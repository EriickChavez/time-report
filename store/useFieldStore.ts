import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface FieldConfig {
    id: string
    label: string
    type: "text" | "date" | "time" | "time-range" | "textarea" | "select"
    required: boolean
    allowFiles: boolean
    options?: string[]
    order: number
    enabled: boolean
}

interface FieldStore {
    fields: FieldConfig[]
    initializeFields: () => void
    addField: (field: Omit<FieldConfig, "id" | "order">) => void
    updateField: (id: string, updates: Partial<FieldConfig>) => void
    deleteField: (id: string) => void
    reorderFields: (fields: FieldConfig[]) => void
    getEnabledFields: () => FieldConfig[]
}

const DEFAULT_FIELDS: FieldConfig[] = [
    {
        id: "date",
        label: "Día",
        type: "date",
        required: true,
        allowFiles: false,
        order: 0,
        enabled: true,
    },
    {
        id: "time",
        label: "Hora",
        type: "time-range",
        required: true,
        allowFiles: false,
        order: 1,
        enabled: true,
    },
    {
        id: "reporter",
        label: "Quien Reporta",
        type: "text",
        required: true,
        allowFiles: false,
        order: 2,
        enabled: true,
    },
    {
        id: "evidence",
        label: "Evidencia",
        type: "textarea",
        required: false,
        allowFiles: true,
        order: 3,
        enabled: true,
    },
    {
        id: "observations",
        label: "Observaciones",
        type: "textarea",
        required: false,
        allowFiles: true,
        order: 4,
        enabled: true,
    },
    {
        id: "status",
        label: "Status",
        type: "select",
        required: true,
        allowFiles: false,
        options: ["En Progreso", "Finalizado", "Pendiente"],
        order: 5,
        enabled: true,
    },
]

export const useFieldStore = create<FieldStore>()(
    persist(
        (set, get) => ({
            fields: DEFAULT_FIELDS,

            initializeFields: () => {
                const currentFields = get().fields
                if (currentFields.length === 0) {
                    set({ fields: DEFAULT_FIELDS })
                }
            },

            addField: (field) => {
                const currentFields = get().fields
                const newField: FieldConfig = {
                    ...field,
                    id: `field-${Date.now()}`,
                    order: currentFields.length,
                    enabled: true,
                }
                set({ fields: [...currentFields, newField] })
            },

            updateField: (id, updates) => {
                set((state) => ({
                    fields: state.fields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
                }))
            },

            deleteField: (id) => {
                set((state) => ({
                    fields: state.fields.filter((field) => field.id !== id),
                }))
            },

            reorderFields: (fields) => {
                const reordered = fields.map((field, index) => ({ ...field, order: index }))
                set({ fields: reordered })
            },

            getEnabledFields: () => {
                return get()
                    .fields.filter((field) => field.enabled)
                    .sort((a, b) => a.order - b.order)
            },
        }),
        {
            name: "field-configuration",
        },
    ),
)
