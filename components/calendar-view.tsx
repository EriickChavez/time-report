"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useTimeEntryStore } from "@/store/TimeEntryStore";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

interface CalendarViewProps {
  onRegisterClick: () => void;
}

export function CalendarView({ onRegisterClick }: CalendarViewProps) {
  const { entries, deleteEntry, fetchEntries } = useTimeEntryStore();
  const [currentWeek, setCurrentWeek] = useState(moment());

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const weekStart = currentWeek.clone().startOf("week").add(1, "day");
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    weekStart.clone().add(i, "days")
  );

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      deleteEntry(id);
    }
  };

  const getEntriesForDate = (date: moment.Moment) => {
    return entries.filter((entry) => moment(entry.date).isSame(date, "day"));
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Calendario</h2>
        <Button onClick={onRegisterClick} size="lg">
          <Clock className="mr-2 h-5 w-5" />
          Nuevo Registro
        </Button>
      </div>

      {/* Week Navigation */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentWeek(currentWeek.clone().subtract(1, "week"))
            }
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <h3 className="text-lg font-semibold capitalize">
            {weekStart.format("MMMM YYYY")}
          </h3>

          <Button
            variant="outline"
            onClick={() => setCurrentWeek(currentWeek.clone().add(1, "week"))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-center pb-2 border-b-2 border-border"
            >
              <div className="text-sm font-medium text-muted-foreground capitalize">
                {day.format("dddd")}
              </div>
              <div className="text-2xl font-bold mt-1">{day.format("D")}</div>
            </div>
          ))}
        </div>

        {/* Entries Grid */}
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayEntries = getEntriesForDate(day);
            return (
              <div
                key={index}
                className="min-h-[200px] bg-secondary rounded-lg p-3 space-y-2"
              >
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-card rounded border border-border p-2 text-sm"
                  >
                    <div className="font-medium mb-1">
                      {entry.startTime} - {entry.endTime}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {entry.reporter}
                    </div>
                    <Badge
                      variant={
                        entry.status === "Finalizado" ? "default" : "secondary"
                      }
                    >
                      {entry.status}
                    </Badge>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Entries Table */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Todos los Registros</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">ID</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Fecha - Hora
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Quien Reporta
                </th>
                <th className="text-left py-3 px-4 font-semibold">Evidencia</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Observaciones
                </th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No hay registros. Haz clic en "Nuevo Registro" para agregar
                    uno.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border hover:bg-secondary/50"
                  >
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {entry.id.slice(0, 8)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="capitalize">
                        {moment(entry.date).format("dddd - D [de] MMMM YYYY")}
                      </span>
                      <br />
                      <span className="text-muted-foreground">
                        {entry.startTime} - {entry.endTime}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{entry.reporter}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {entry.evidence
                        ? entry.evidence.substring(0, 50) + "..."
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {entry.observations
                        ? entry.observations.substring(0, 50) + "..."
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          entry.status === "Finalizado"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {entry.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
