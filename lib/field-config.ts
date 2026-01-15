export interface FieldConfig {
    id: string
    label: string
    type: "text" | "date" | "time" | "time-range" | "textarea" | "select"
    required: boolean
    allowFiles: boolean
    options?: string[] // For select fields
    order: number
    enabled: boolean
}

const CONFIG_STORAGE_KEY = "field-configuration"

export const DEFAULT_FIELDS: FieldConfig[] = [
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

export function getFieldConfigs(): FieldConfig[] {
    if (typeof window === "undefined") return DEFAULT_FIELDS

    const stored = localStorage.getItem(CONFIG_STORAGE_KEY)
    return stored ? JSON.parse(stored) : DEFAULT_FIELDS
}

export function saveFieldConfigs(configs: FieldConfig[]): void {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs))
}

export function addFieldConfig(config: Omit<FieldConfig, "id" | "order">): void {
    const configs = getFieldConfigs()
    const newConfig: FieldConfig = {
        ...config,
        id: `field-${Date.now()}`,
        order: configs.length,
    }

    configs.push(newConfig)
    saveFieldConfigs(configs)
}

export function updateFieldConfig(id: string, updates: Partial<FieldConfig>): void {
    const configs = getFieldConfigs()
    const index = configs.findIndex((config) => config.id === id)

    if (index !== -1) {
        configs[index] = { ...configs[index], ...updates }
        saveFieldConfigs(configs)
    }
}

export function deleteFieldConfig(id: string): void {
    const configs = getFieldConfigs()
    const filtered = configs.filter((config) => config.id !== id)
    saveFieldConfigs(filtered)
}

export function reorderFieldConfigs(configs: FieldConfig[]): void {
    const reordered = configs.map((config, index) => ({ ...config, order: index }))
    saveFieldConfigs(reordered)
}
