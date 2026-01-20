"use client";

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { exportToExcel } from "@/lib/export-excel";
import { Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { useTimeEntryStore } from "@/store/TimeEntryStore";
import { useFieldStore } from "@/store/useFieldStore";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

export function ExportView() {
  const { entries, initializeEntries } = useTimeEntryStore();
  const { fields, initializeFields } = useFieldStore();

  const [dateRange, setDateRange] = useState({
    start: moment().startOf("month").format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  });

  // Aseguramos que los datos estén cargados al montar el componente
  useEffect(() => {
    initializeEntries();
    initializeFields();
  }, [initializeEntries, initializeFields]);

  // Filtramos los registros por el rango de fecha seleccionado
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryDate = moment(entry.date).format("YYYY-MM-DD");
      return entryDate >= dateRange.start && entryDate <= dateRange.end;
    });
  }, [entries, dateRange]);

  const handleExport = () => {
    if (filteredEntries.length === 0) return;

    // IMPORTANTE: Pasamos los 'fields' que vienen de la configuración
    exportToExcel(filteredEntries, fields, dateRange.start, dateRange.end);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Exportar Reportes</h2>
        <Card className="p-8 border-t-4 border-t-green-600 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-50 p-6 rounded-full text-green-600 mb-4">
              <FileSpreadsheet className="h-12 w-12" />
            </div>
            <p className="text-muted-foreground text-center">
              El Excel se generará con las columnas configuradas en la sección
              de Ajustes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <Label>Desde</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Hasta</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            onClick={handleExport}
            size="lg"
            className="w-full bg-green-700 hover:bg-green-800 h-14"
            disabled={filteredEntries.length === 0}
          >
            <Download className="mr-2 h-6 w-6" />
            Descargar Excel Personalizado
          </Button>

          {filteredEntries.length === 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
              <AlertCircle size={18} />
              <span className="text-sm">
                No hay datos en el rango seleccionado
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
