"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react";
import { useTimeEntryStore } from "@/store/TimeEntryStore";
import { useFieldStore } from "@/store/useFieldStore";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

interface CalendarViewProps {
  onRegisterClick: () => void;
}

export function CalendarView({ onRegisterClick }: CalendarViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { entries, deleteEntry, initializeEntries } = useTimeEntryStore();
  const { fields, initializeFields } = useFieldStore();
  const [currentWeek, setCurrentWeek] = useState(moment());

  useEffect(() => {
    const loadData = async () => {
      // Cargamos tanto los registros como la configuración de campos de forma paralela
      await Promise.all([initializeEntries(), initializeFields()]);
      setIsMounted(true);
    };
    loadData();
  }, [initializeEntries, initializeFields]);

  if (!isMounted) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const weekStart = currentWeek.clone().startOf("week").add(1, "day");
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    weekStart.clone().add(i, "days"),
  );

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      await deleteEntry(id);
    }
  };

  const getEntriesForDate = (date: moment.Moment) => {
    if (!Array.isArray(entries)) return [];
    const searchDate = date.format("YYYY-MM-DD");
    return entries.filter(
      (entry: any) => moment(entry.date).format("YYYY-MM-DD") === searchDate,
    );
  };

  /**
   * Filtrado de columnas dinámicas:
   * Excluimos las que ya mostramos de forma fija (Fecha, Responsable, Estatus)
   */
  const extraFields = fields.filter((f) => {
    const label = f.label.toLowerCase();
    return ![
      "día",
      "fecha",
      "hora",
      "quien reporta",
      "responsable",
      "estatus",
      "status",
    ].includes(label);
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Calendario de Actividades
          </h2>
          <p className="text-muted-foreground text-sm">
            Visualización semanal y registro detallado.
          </p>
        </div>
        <Button onClick={onRegisterClick} size="lg" className="gap-2 shadow-md">
          <Clock className="h-5 w-5" />
          Nuevo Registro
        </Button>
      </div>

      {/* VISTA SEMANAL */}
      <Card className="p-6 shadow-sm border-border">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentWeek(currentWeek.clone().subtract(1, "week"))
            }
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-xl font-bold capitalize text-primary">
            {weekStart.format("MMMM YYYY")}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(currentWeek.clone().add(1, "week"))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayEntries = getEntriesForDate(day);
            const isToday = day.isSame(moment(), "day");

            return (
              <div key={`cal-${index}`} className="flex flex-col">
                <div
                  className={`text-center pb-3 mb-2 border-b-2 ${isToday ? "border-primary" : "border-transparent"}`}
                >
                  <span className="text-xs font-semibold text-muted-foreground capitalize">
                    {day.format("ddd")}
                  </span>
                  <div
                    className={`text-2xl font-black ${isToday ? "text-primary" : ""}`}
                  >
                    {day.format("D")}
                  </div>
                </div>
                <div className="min-h-[160px] bg-muted/20 rounded-xl p-2 space-y-2 border border-dashed border-muted-foreground/20">
                  {dayEntries.map((entry: any) => (
                    <div
                      key={entry.id}
                      className="bg-card p-2 rounded-lg border shadow-sm text-[11px] hover:ring-1 ring-primary/50 transition-all"
                    >
                      <div className="font-bold text-primary mb-1">
                        {entry.start_time?.slice(0, 5)} -{" "}
                        {entry.end_time?.slice(0, 5)}
                      </div>
                      <div className="truncate font-semibold">
                        {entry.reporter}
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-2 text-[9px] py-0 leading-none h-4"
                      >
                        {entry.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* TABLA DE HISTORIAL DETALLADO */}
      <Card className="shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/10">
          <h3 className="text-lg font-bold">Historial Detallado</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/5 text-muted-foreground">
                <th className="text-left py-4 px-6 font-semibold">
                  Fecha / Horario
                </th>
                <th className="text-left py-4 px-6 font-semibold">
                  Responsable
                </th>

                {/* COLUMNAS DINÁMICAS BASADAS EN CONFIGURACIÓN */}
                {extraFields.map((field) => (
                  <th
                    key={field.id}
                    className="text-left py-4 px-6 font-semibold capitalize"
                  >
                    {field.label}
                  </th>
                ))}

                <th className="text-left py-4 px-6 font-semibold">Estado</th>
                <th className="text-right py-4 px-6 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={extraFields.length + 4}
                    className="text-center py-16 text-muted-foreground"
                  >
                    No se encontraron registros.
                  </td>
                </tr>
              ) : (
                entries.map((entry: any) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold">
                        {moment(entry.date).format("DD/MM/YY")}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {entry.start_time?.slice(0, 5)} -{" "}
                        {entry.end_time?.slice(0, 5)}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {entry.reporter || "N/A"}
                    </td>

                    {/* RENDERIZADO DE DATOS DINÁMICOS USANDO field_data */}
                    {extraFields.map((field) => {
                      const value = entry.field_data
                        ? entry.field_data[field.id]
                        : null;
                      return (
                        <td
                          key={field.id}
                          className="py-4 px-6 text-muted-foreground truncate max-w-[200px]"
                        >
                          {value || <span className="opacity-30">-</span>}
                        </td>
                      );
                    })}

                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          entry.status === "Finalizado"
                            ? "default"
                            : "secondary"
                        }
                        className="font-semibold"
                      >
                        {entry.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
