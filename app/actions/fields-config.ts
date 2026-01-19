'use server'

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FieldConfig } from "@prisma/client";
import api from "@/services/api";
import { CREATE_FIELDS_CONFIG_URL, DELETE_FIELDS_CONFIG_URL } from "@/services/services";

export type FieldConfigResult = {
    success: boolean
    error?: string
    fieldConfig?: FieldConfig
}
export type AllFieldConfigResult = {
    success: boolean
    error?: string
    fieldConfig?: FieldConfig[]
}

export async function createFieldConfig(fieldConfig: FieldConfig): Promise<FieldConfigResult> {
    console.log("[CREATE]", { fieldConfig });
    try {
        const payload = {
            userId: fieldConfig.userId,
            configs: [{
                fieldId: fieldConfig.fieldId, // <--- CAMBIAR DE field_id A fieldId
                label: fieldConfig.label,
                type: fieldConfig.type,
                required: fieldConfig.required,
                allowFiles: fieldConfig.allowFiles, // <--- REVISA ESTE TAMBIÉN
                options: fieldConfig.options!,
                enabled: fieldConfig.enabled,
                order: fieldConfig.order,
                userId: fieldConfig.userId // <--- CAMBIAR DE user_id A userId si el controlador usa camelCase
            }]
        };

        const newFieldConfig = await api.post(CREATE_FIELDS_CONFIG_URL, payload)
        console.log("[RESULT]", { result: newFieldConfig });
        return { success: true, fieldConfig: newFieldConfig }
    } catch (error) {
        console.error('Error creating field config:', error)
        return { success: false, error: 'Error al crear la configuración del campo' }
    }
}

export async function updateFieldConfig(fieldConfig: FieldConfig): Promise<FieldConfigResult> {
    try {
        const updatedFieldConfig = await prisma.fieldConfig.update({
            where: { id: fieldConfig.id },
            data: {
                fieldId: fieldConfig.fieldId,
                label: fieldConfig.label,
                type: fieldConfig.type,
                required: fieldConfig.required,
                allowFiles: fieldConfig.allowFiles,
                options: fieldConfig.options!,
                enabled: fieldConfig.enabled,
                order: fieldConfig.order,
                createdAt: fieldConfig.createdAt,
                updatedAt: fieldConfig.updatedAt,
                userId: fieldConfig.userId
            },
        })
        return { success: true, fieldConfig: updatedFieldConfig }
    } catch (error) {
        console.error('Error updating field config:', error)
        return { success: false, error: 'Error al actualizar la configuración del campo' }
    }
}

export async function deleteFieldConfig(id: string): Promise<FieldConfigResult> {
    try {
        const deletedFieldConfig = await api.delete(DELETE_FIELDS_CONFIG_URL, id)
        return { success: true, fieldConfig: deletedFieldConfig }
    } catch (error) {
        console.error('Error deleting field config:', error)
        return { success: false, error: 'Error al eliminar la configuración del campo' }
    }
}

export async function getAllFieldConfigs(): Promise<AllFieldConfigResult> {
    try {
        const fieldConfigs = await prisma.fieldConfig.findMany()
        console.log("[FieldsConfig-->]", { fieldConfigs })
        return {
            success: true,
            fieldConfig: fieldConfigs
        }
    } catch (error) {
        console.error('Error getting field configs:', error)
        return { success: false, error: 'Error al obtener la configuración del campo' }
    }
}