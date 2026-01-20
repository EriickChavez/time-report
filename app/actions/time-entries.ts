"use server"

import api from "@/services/api";
import { CREATE_TIME_ENTRY_URL, GET_TIME_ENTRIES_BY_USER_URL, POST_TIME_ENTRY_URL } from "@/services/services";
import { revalidatePath } from "next/cache"
const API_URL = "http://localhost:4000/api";


export async function getTimeEntriesByUser(userId: string) {
    try {
        // 2. Asegúrate de concatenar la URL base completa
        const response = await api.get(`${GET_TIME_ENTRIES_BY_USER_URL}?userId=${userId}`)
        console.log("[GET_TIME_ENTRIES_BY_USER_URL]", response)
        if (!response.success) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error("Error fetching entries:", error);
        return { success: false, message: "No se pudo conectar con el servidor" };
    }
}

/**
 * Crear un nuevo reporte de tiempo
 */
export async function createTimeEntry(entryData: any) {
    try {
        const response = await api.post(CREATE_TIME_ENTRY_URL, entryData);
        if (response.success) revalidatePath("/dashboard/time-reports");
        return response;
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error al crear registro" };
    }
}

/**
 * Eliminar un reporte
 */
export async function deleteTimeEntry(id: string) {
    try {
        const response = await fetch(`${API_URL}/time-entries/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/time-reports");
        }

        return result;
    } catch (error) {
        console.error("Error deleting entry:", error);
        return { success: false, message: "Error al eliminar el registro" };
    }
}

/**
 * Actualizar un reporte existente
 */
export async function updateTimeEntry(id: string, updates: any) {
    try {
        const response = await fetch(`${API_URL}/time-entries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });

        const result = await response.json();

        if (result.success) {
            revalidatePath("/dashboard/time-reports");
        }

        return result;
    } catch (error) {
        console.error("Error updating entry:", error);
        return { success: false, message: "Error al actualizar el registro" };
    }
}