"use server"

import { PrismaTimeEntryRepository } from "@/infrastructure/PrismaTimeEntryRepository"
import { TimeEntry } from "@/types/time-entry"
import { revalidatePath } from "next/cache"

const repository = new PrismaTimeEntryRepository()

export async function getMysqlTimeEntries(userId: string) {
    return await repository.getEntries(userId)
}

export async function addMysqlTimeEntry(entry: Omit<TimeEntry, "id" | "created_at" | "updated_at">) {
    const newEntry = await repository.addEntry(entry)
    revalidatePath("/")
    return newEntry
}

export async function deleteMysqlTimeEntry(id: string, userId: string) {
    const success = await repository.deleteEntry(id, userId)
    revalidatePath("/")
    return success
}

export async function updateMysqlTimeEntry(id: string, userId: string, updates: Partial<TimeEntry>) {
    const updatedEntry = await repository.updateEntry(id, userId, updates)
    revalidatePath("/")
    return updatedEntry
}
