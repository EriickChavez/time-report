import type { TimeEntry } from "@/types/time-entry"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function exportToExcel(entries: TimeEntry[], startDate: string, endDate: string): void {
    // Create CSV content
    const headers = [
        "ID",
        "Fecha",
        "Hora Inicio",
        "Hora Fin",
        "Quien Reporta",
        "Evidencia",
        "Observaciones",
        "Status",
        "Archivos Evidencia",
        "Archivos Observaciones",
    ]

    const rows = entries.map((entry) => [
        entry.id,
        format(new Date(entry.date), "d/MM/yyyy", { locale: es }),
        entry.startTime,
        entry.endTime,
        entry.reporter,
        (entry.evidence ?? "").replace(/[\n\r]/g, " "),
        (entry.observations ?? "").replace(/[\n\r]/g, " "),
        entry.status,
        entry.evidenceFiles.toString(),
        entry.observationFiles.toString(),
    ])

    // Convert to CSV
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Create blob and download
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `reporte-tiempo-${startDate}-${endDate}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
