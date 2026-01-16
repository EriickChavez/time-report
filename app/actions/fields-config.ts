'use server'

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FieldConfig } from "@prisma/client";

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
        const newFieldConfig = await prisma.fieldConfig.create({
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
        const deletedFieldConfig = await prisma.fieldConfig.delete({
            where: { id },
        })
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