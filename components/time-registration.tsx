"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useFieldStore } from "@/store/useFieldStore";
import { useTimeEntryStore, TimeEntry } from "@/store/TimeEntryStore";
import moment from "moment";

interface TimeRegistrationProps {
  onSuccess: () => void;
}

export function TimeRegistration({ onSuccess }: TimeRegistrationProps) {
  const { fields, initializeFields } = useFieldStore();
  const { addEntry } = useTimeEntryStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});

  useEffect(() => {
    initializeFields();
  }, [initializeFields]);

  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === "date")
        initialData[field.id] = moment().format("YYYY-MM-DD");
      else if (field.type === "time") initialData[field.id] = "09:00";
      else if (field.type === "time-range") {
        initialData[`${field.id}-start`] = "08:00";
        initialData[`${field.id}-end`] = "17:00";
      } else if (field.type === "select" && field.options)
        initialData[field.id] = field.options[0];
      else initialData[field.id] = "";
    });
    setFormData(initialData);
  }, [fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dateField = fields.find(
        (f) => f.type === "date" || f.label.toLowerCase() === "día",
      );
      const timeRangeField = fields.find((f) => f.type === "time-range");
      const reporterField = fields.find(
        (f) => f.label.toLowerCase() === "quien reporta",
      );
      const statusField = fields.find(
        (f) => f.label.toLowerCase() === "estatus",
      );

      const entry: Omit<TimeEntry, "id" | "userId"> = {
        date: dateField
          ? formData[dateField.id]
          : moment().format("YYYY-MM-DD"),
        startTime: timeRangeField
          ? formData[`${timeRangeField.id}-start`]
          : "08:00",
        endTime: timeRangeField
          ? formData[`${timeRangeField.id}-end`]
          : "17:00",
        reporter: reporterField ? formData[reporterField.id] : "Sin nombre",
        status: statusField ? formData[statusField.id] : "Progreso",
        fieldData: { ...formData },
        files: [],
      };

      await addEntry(entry);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el registro");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: any) => {
    const commonProps = {
      required: field.required,
      onChange: (e: any) =>
        setFormData({ ...formData, [field.id]: e.target.value }),
      value: formData[field.id] || "",
    };

    switch (field.type) {
      case "text":
      case "date":
      case "time":
        return <Input type={field.type} {...commonProps} />;
      case "textarea":
        return <Textarea {...commonProps} className="min-h-[100px]" />;
      case "time-range":
        return (
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              value={formData[`${field.id}-start`]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [`${field.id}-start`]: e.target.value,
                })
              }
            />
            <Input
              type="time"
              value={formData[`${field.id}-end`]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [`${field.id}-end`]: e.target.value,
                })
              }
            />
          </div>
        );
      case "select":
        return (
          <Select
            value={formData[field.id]}
            onValueChange={(val) =>
              setFormData({ ...formData, [field.id]: val })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt: string) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-primary">Nuevo Reporte</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label className="font-semibold">{field.label}</Label>
            {renderField(field)}
          </div>
        ))}
        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Guardar Registro"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
