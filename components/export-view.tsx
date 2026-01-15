"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { exportToExcel } from "@/lib/export-excel";
import { Download, FileSpreadsheet } from "lucide-react";
import { useTimeEntryStore } from "@/store/TimeEntryStore";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

export function ExportView() {
  const { entries, getEntriesByDateRange } = useTimeEntryStore();
  const [dateRange, setDateRange] = useState({
    start: moment().startOf("month").format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  });

  const filteredEntries = getEntriesByDateRange(dateRange.start, dateRange.end);

  const handleExport = () => {
    if (filteredEntries.length === 0) {
      alert(
        "No hay registros para exportar en el rango de fechas seleccionado."
      );
      return;
    }

    exportToExcel(filteredEntries, dateRange.start, dateRange.end);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Exportar en Excel</h2>

        <Card className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-accent/20 p-6 rounded-full">
              <FileSpreadsheet className="h-16 w-16 text-accent" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Seleccionar Rango de Fechas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date" className="mb-2 block">
                    Fecha Inicio
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="mb-2 block">
                    Fecha Fin
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-6">
              <h4 className="font-semibold mb-2">Resumen</h4>
              <p className="text-muted-foreground mb-4">
                Se exportarán{" "}
                <strong className="text-foreground">
                  {filteredEntries.length}
                </strong>{" "}
                registros del{" "}
                <strong className="text-foreground capitalize">
                  {moment(dateRange.start).format("D [de] MMMM YYYY")}
                </strong>{" "}
                al{" "}
                <strong className="text-foreground capitalize">
                  {moment(dateRange.end).format("D [de] MMMM YYYY")}
                </strong>
              </p>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Total de registros: {filteredEntries.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  • Finalizados:{" "}
                  {
                    filteredEntries.filter((e) => e.status === "Finalizado")
                      .length
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  • En progreso:{" "}
                  {
                    filteredEntries.filter((e) => e.status === "En Progreso")
                      .length
                  }
                </p>
              </div>
            </div>

            <Button
              onClick={handleExport}
              size="lg"
              className="w-full"
              disabled={filteredEntries.length === 0}
            >
              <Download className="mr-2 h-5 w-5" />
              Descargar Excel
            </Button>

            {filteredEntries.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No hay registros en el rango de fechas seleccionado
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
