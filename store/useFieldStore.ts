import { createFieldConfig, getAllFieldConfigs } from "@/app/actions/fields-config"
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
    addField: (field: Omit<FieldConfig, "id" | "order">) => Promise<void>
    updateField: (id: string, updates: Partial<FieldConfig>) => void
    deleteField: (id: string) => void
    reorderFields: (fields: FieldConfig[]) => void
    getEnabledFields: () => FieldConfig[];
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

            addField: async (field) => {
                const currentFields = get().fields
                const newField: FieldConfig = {
                    ...field,
                    id: `field-${Date.now()}`,
                    order: currentFields.length,
                    enabled: true,
                }
                const result = await createFieldConfig({
                    id: newField.id,
                    order: newField.order,
                    label: newField.label,
                    type: newField.type,
                    required: newField.required,
                    allowFiles: newField.allowFiles,
                    options: JSON.stringify(newField.options),
                    enabled: newField.enabled,
                    userId: "37844ec2-4cc0-46f6-a031-02a8b3c9aa9e",
                    fieldId: newField.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                console.log("[RESULT]---->", { result });
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
                console.log("getEnabledFields -------------------");
                Promise.resolve(getAllFieldConfigs()).then((result) => {
                    console.log("[RESULT]", { result });
                }).catch((error) => {
                    console.error("[ERROR]", error);
                })
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
