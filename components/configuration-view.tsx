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
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Configuración</h2>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Campo
          </Button>
        </div>

        {/* Add Field Dialog */}
        {showAddDialog && (
          <Card className="p-6 mb-6 border-2 border-primary">
            <h3 className="text-xl font-semibold mb-4">Agregar campo</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="label">Label</Label>
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
                <Label htmlFor="type">Tipo</Label>
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
                  <Label htmlFor="options">
                    Opciones (separadas por comas)
                  </Label>
                  <Input
                    id="options"
                    placeholder="Opción 1, Opción 2, Opción 3"
                    value={optionsInput}
                    onChange={(e) => setOptionsInput(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Adjunta Archivos:</Label>
                <Switch
                  checked={newField.allowFiles}
                  onCheckedChange={(checked) =>
                    setNewField({ ...newField, allowFiles: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Obligatorio</Label>
                <Switch
                  checked={newField.required}
                  onCheckedChange={(checked) =>
                    setNewField({ ...newField, required: checked })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddField} className="flex-1">
                  Guardar Campo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Fields List */}
        <div className="space-y-3">
          {sortedFields.map((field) => (
            <Card key={field.id} className="p-4">
              <div className="flex items-center gap-4">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />

                <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="font-semibold">{field.label}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {field.type.replace("-", " ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Adjunta Archivos:</Label>
                    <Switch
                      checked={field.allowFiles}
                      onCheckedChange={(checked) =>
                        updateField(field.id, { allowFiles: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Obligatorio:</Label>
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) =>
                        updateField(field.id, { required: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Activo:</Label>
                    <Switch
                      checked={field.enabled}
                      onCheckedChange={(checked) =>
                        updateField(field.id, { enabled: checked })
                      }
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
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
