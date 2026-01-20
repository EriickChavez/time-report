"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { useFieldStore, type FieldConfig } from "@/store/useFieldStore";

export function ConfigurationView() {
  const { fields, addField, updateField, deleteField, initializeFields } =
    useFieldStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newField, setNewField] = useState({
    label: "",
    type: "text" as FieldConfig["type"],
    required: false,
    allowFiles: false,
    options: [] as string[],
    enabled: true,
  });
  const [optionsInput, setOptionsInput] = useState("");

  useEffect(() => {
    initializeFields();
  }, []);

  const handleAddField = () => {
    if (!newField.label.trim()) {
      alert("Por favor, ingresa una etiqueta para el campo");
      return;
    }

    const fieldToAdd = {
      ...newField,
      options:
        newField.type === "select" && optionsInput
          ? optionsInput
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean)
          : undefined,
    };

    addField(fieldToAdd);
    setNewField({
      label: "",
      type: "text",
      required: false,
      allowFiles: false,
      options: [],
      enabled: true,
    });
    setOptionsInput("");
    setShowAddDialog(false);
  };

  const handleDeleteField = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este campo?")) {
      deleteField(id);
    }
  };

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER RESPONSIVO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Configuración</h2>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Campo
          </Button>
        </div>

        {/* DIÁLOGO AGREGAR CAMPO (Card adaptada) */}
        {showAddDialog && (
          <Card className="p-4 md:p-6 mb-6 border-2 border-primary">
            <h3 className="text-xl font-semibold mb-6">Agregar nuevo campo</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="label"
                    className="text-sm md:text-md mb-2 font-semibold"
                  >
                    Label
                  </Label>
                  <Input
                    id="label"
                    placeholder="Nombre del campo"
                    value={newField.label}
                    onChange={(e) =>
                      setNewField({ ...newField, label: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label
                    htmlFor="type"
                    className="text-sm md:text-md mb-2 font-semibold"
                  >
                    Tipo
                  </Label>
                  <Select
                    value={newField.type}
                    onValueChange={(value: any) =>
                      setNewField({ ...newField, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="date">Datepicker</SelectItem>
                      <SelectItem value="time">Hora</SelectItem>
                      <SelectItem value="time-range">Rango de Hora</SelectItem>
                      <SelectItem value="textarea">Texto Largo</SelectItem>
                      <SelectItem value="select">Selector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newField.type === "select" && (
                  <div>
                    <Label
                      htmlFor="options"
                      className="text-sm md:text-md mb-2 font-semibold"
                    >
                      Opciones (separadas por comas)
                    </Label>
                    <Input
                      id="options"
                      placeholder="Opción 1, Opción 2"
                      value={optionsInput}
                      onChange={(e) => setOptionsInput(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-6 bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer">Adjunta Archivos</Label>
                  <Switch
                    checked={newField.allowFiles}
                    onCheckedChange={(checked) =>
                      setNewField({ ...newField, allowFiles: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer">Obligatorio</Label>
                  <Switch
                    checked={newField.required}
                    onCheckedChange={(checked) =>
                      setNewField({ ...newField, required: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                onClick={handleAddField}
                className="flex-1 order-2 sm:order-1"
              >
                Guardar Campo
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1 order-1 sm:order-2"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* LISTA DE CAMPOS (REDISEÑO RESPONSIVO) */}
        <div className="space-y-4">
          {fields.length === 0 && (
            <p className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
              No hay campos configurados
            </p>
          )}

          {sortedFields.map((field) => (
            <Card key={field.id} className="p-4 transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center w-full sm:w-auto">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move mr-2" />
                  <div className="flex-1">
                    <p className="font-bold text-lg sm:text-base">
                      {field.label}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {field.type.replace("-", " ")}
                    </p>
                  </div>
                  {/* Botón borrar visible arriba en móvil */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden text-destructive"
                    onClick={() => handleDeleteField(field.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* GRID DE SWITCHES: 1 col en móvil, 3 en desktop */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <div className="flex items-center justify-between sm:justify-center gap-3 bg-muted/20 sm:bg-transparent p-2 sm:p-0 rounded-md">
                    <Label className="text-xs font-medium sm:hidden italic">
                      Adjuntar:
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline text-[10px] text-muted-foreground uppercase font-bold">
                        Files
                      </span>
                      <Switch
                        checked={field.allowFiles}
                        onCheckedChange={(checked) =>
                          updateField(field.id, { allowFiles: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-center gap-3 bg-muted/20 sm:bg-transparent p-2 sm:p-0 rounded-md">
                    <Label className="text-xs font-medium sm:hidden italic">
                      Requerido:
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline text-[10px] text-muted-foreground uppercase font-bold">
                        Req
                      </span>
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) =>
                          updateField(field.id, { required: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-center gap-3 bg-muted/20 sm:bg-transparent p-2 sm:p-0 rounded-md">
                    <Label className="text-xs font-medium sm:hidden italic">
                      Estado:
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline text-[10px] text-muted-foreground uppercase font-bold">
                        Active
                      </span>
                      <Switch
                        checked={field.enabled}
                        onCheckedChange={(checked) =>
                          updateField(field.id, { enabled: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Botón borrar en desktop */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex"
                  onClick={() => handleDeleteField(field.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
