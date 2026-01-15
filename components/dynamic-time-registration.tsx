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
import { getFieldConfigs, type FieldConfig } from "@/lib/field-config";
import { useTimeEntryStore } from "@/store/TimeEntryStore";
import { Upload, X } from "lucide-react";

interface DynamicTimeRegistrationProps {
  onSuccess: () => void;
}

export function DynamicTimeRegistration({
  onSuccess,
}: DynamicTimeRegistrationProps) {
  const { addEntry } = useTimeEntryStore();
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});

  useEffect(() => {
    const configs = getFieldConfigs().filter((f) => f.enabled);
    setFields(configs);

    // Initialize form data
    const initialData: Record<string, any> = {};
    configs.forEach((field) => {
      if (field.type === "date") {
        initialData[field.id] = new Date().toISOString().split("T")[0];
      } else if (field.type === "time") {
        initialData[field.id] = "09:00";
      } else if (field.type === "time-range") {
        initialData[`${field.id}-start`] = "09:00";
        initialData[`${field.id}-end`] = "17:00";
      } else if (field.type === "select" && field.options) {
        initialData[field.id] = field.options[0];
      } else {
        initialData[field.id] = "";
      }
    });
    setFormData(initialData);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    for (const field of fields) {
      if (field.required && !formData[field.id]?.toString().trim()) {
        alert(`Por favor, completa el campo: ${field.label}`);
        return;
      }
    }

    // Convert to time entry format
    const entry: any = {};
    fields.forEach((field) => {
      if (field.type === "time-range") {
        entry.startTime = formData[`${field.id}-start`];
        entry.endTime = formData[`${field.id}-end`];
      } else {
        entry[field.id] = formData[field.id];
      }

      if (field.allowFiles) {
        entry[`${field.id}Files`] = files[field.id]?.length || 0;
      }
    });

    await addEntry(entry);

    // Reset form
    const resetData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type === "date") {
        resetData[field.id] = new Date().toISOString().split("T")[0];
      } else if (field.type === "time") {
        resetData[field.id] = "09:00";
      } else if (field.type === "time-range") {
        resetData[`${field.id}-start`] = "09:00";
        resetData[`${field.id}-end`] = "17:00";
      } else if (field.type === "select" && field.options) {
        resetData[field.id] = field.options[0];
      } else {
        resetData[field.id] = "";
      }
    });
    setFormData(resetData);
    setFiles({});

    onSuccess();
  };

  const handleFileUpload =
    (fieldId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      setFiles({
        ...files,
        [fieldId]: [...(files[fieldId] || []), ...newFiles],
      });
    };

  const removeFile = (fieldId: string, index: number) => {
    setFiles({
      ...files,
      [fieldId]: (files[fieldId] || []).filter((_, i) => i !== index),
    });
  };

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            type="text"
            value={formData[field.id] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.value })
            }
            required={field.required}
            className="text-base"
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={formData[field.id] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.value })
            }
            required={field.required}
            className="text-base"
          />
        );

      case "time":
        return (
          <Input
            type="time"
            value={formData[field.id] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.value })
            }
            required={field.required}
            className="text-base"
          />
        );

      case "time-range":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-2 block">Hora Inicio</Label>
              <Input
                type="time"
                value={formData[`${field.id}-start`] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`${field.id}-start`]: e.target.value,
                  })
                }
                required={field.required}
                className="text-base"
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Hora Fin</Label>
              <Input
                type="time"
                value={formData[`${field.id}-end`] || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`${field.id}-end`]: e.target.value,
                  })
                }
                required={field.required}
                className="text-base"
              />
            </div>
          </div>
        );

      case "textarea":
        return (
          <Textarea
            value={formData[field.id] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field.id]: e.target.value })
            }
            required={field.required}
            className="min-h-[120px] text-base"
          />
        );

      case "select":
        return (
          <Select
            value={formData[field.id] || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, [field.id]: value })
            }
          >
            <SelectTrigger className="text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
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
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          Registrar tiempo
        </h2>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <div key={field.id}>
                  <Label className="text-base font-semibold mb-2 block">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>

                  {renderField(field)}

                  {/* File Upload */}
                  {field.allowFiles && (
                    <div className="mt-4">
                      {(files[field.id] || []).map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-50 p-3 rounded mb-2"
                        >
                          <span className="text-sm text-slate-700">
                            {file.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(field.id, index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <label htmlFor={`file-${field.id}`} className="block">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-slate-400 transition-colors">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            Adjuntar Archivo(s)
                          </span>
                        </div>
                        <input
                          id={`file-${field.id}`}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload(field.id)}
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" size="lg" className="flex-1">
                Guardar Registro
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onSuccess}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
