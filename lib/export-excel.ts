import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';

/**
 * Genera un Excel dinámico basado únicamente en la configuración de campos.
 * @param entries - Los registros de tiempo (vienen del backend con field_data).
 * @param fields - La configuración de campos (vienen del FieldStore).
 */
export const exportToExcel = (entries: any[], fields: any[], startDate: string, endDate: string) => {

    const worksheetData = entries.map(entry => {
        const row: any = {};

        // Recorremos CADA campo que configuraste en tu panel de ajustes
        fields.forEach(field => {
            const label = field.label; // Ejemplo: "Día", "Quien reporta", "Evidencia"
            const id = field.id;       // El ID único del campo (field_17688...)

            // Extraemos el valor desde field_data usando el ID de la configuración
            const value = entry.field_data?.[id];

            if (field.type === 'time-range') {
                // Si es un rango de tiempo, extraemos el inicio y fin guardados
                const start = entry.field_data?.[`${id}-start`] || '';
                const end = entry.field_data?.[`${id}-end`] || '';
                row[label] = `${start} - ${end}`;
            } else if (field.type === 'date') {
                // Si es fecha, le damos formato legible
                row[label] = value ? moment(value).format('DD/MM/YYYY') : '';
            } else {
                // Para texto, selectores y el resto, ponemos el valor tal cual
                row[label] = value || '';
            }
        });

        return row;
    });

    // Generamos la hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Detallado");

    // Ajuste de ancho automático para que las columnas no se vean amontonadas
    const colWidths = fields.map(() => ({ wch: 25 }));
    worksheet['!cols'] = colWidths;

    // Descarga del archivo
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(data, `Reporte_Dinamico_${startDate}_a_${endDate}.xlsx`);
};