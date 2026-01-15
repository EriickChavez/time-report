
export interface TimeEntry {
    id: string
    userId: string
    created_at?: string
    updated_at?: string
    date: string
    startTime: string
    endTime: string
    reporter: string
    evidence: string
    observations: string
    status: string
    evidenceFiles: string[]
    observationFiles: string[]
    project?: string
    task?: string
    description?: string
    duration?: number
    customFields?: Record<string, any>
}
