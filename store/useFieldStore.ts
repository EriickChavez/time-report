import { createFieldConfig, deleteFieldConfig, getAllFieldConfigs } from "@/app/actions/fields-config"
import { getLocalStorageItem } from "@/lib/storage"
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
            fields: [],//DEFAULT_FIELDS,

            initializeFields: async () => {
                const currentFields = await getAllFieldConfigs();
                console.log("[CURRENT FIELDS]", currentFields);
                if (!currentFields.success) return;
                if (!!currentFields.fieldConfig && currentFields.fieldConfig.length > 0) {
                    set({ fields: currentFields.fieldConfig as FieldConfig[] })
                }
            },

            addField: async (field) => {
                const currentFields = get().fields;
                const userJson = getLocalStorageItem("user");

                if (!userJson) return;
                const user = JSON.parse(userJson);

                // 1. Generamos el ID aquí para enviarlo a la base de datos
                const generatedId = `field_${Date.now()}`;
                const now = new Date();

                const newField: FieldConfig = {
                    ...field,
                    id: generatedId,
                    order: currentFields.length,
                    enabled: true,
                };

                // 2. Pasamos el objeto con TODAS las propiedades requeridas por el tipo
                const result = await createFieldConfig({
                    id: generatedId,          // Requerido por el tipo
                    fieldId: generatedId,     // Requerido por el tipo
                    label: newField.label,
                    type: newField.type,
                    required: newField.required,
                    allowFiles: newField.allowFiles,
                    options: newField.options || [],
                    enabled: newField.enabled,
                    userId: user.id as string, // Aseguramos que sea string
                    order: newField.order,
                    createdAt: now,           // Requerido por el tipo
                    updatedAt: now,           // Requerido por el tipo
                });

                if (result.success) {
                    set({ fields: [...currentFields, newField] });
                }
            },

            updateField: (id, updates) => {
                set((state) => ({
                    fields: state.fields.map((field) => (field.id === id ? { ...field, ...updates } : field)),
                }))
            },

            deleteField: async (id) => {
                await deleteFieldConfig(id);
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
