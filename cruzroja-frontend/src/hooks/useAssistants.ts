"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { assistantEvent } from "@/types/usertType";
import { getAssistEvent, removeAssistEvent } from "@/services/serviceGetPerson";

export function useAssistants() {
    const [assistants, setAssistants] = useState<assistantEvent[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentEventId, setCurrentEventId] = useState<string | null>(null);

    async function openForEvent(eventId: string) {
        try {
            setLoading(true);
            setCurrentEventId(eventId);
            const response = await getAssistEvent(eventId);
            setAssistants(response);
            setOpen(true);
        } catch (e) {
            console.error(e);
            toast.error("No se pudieron cargar los asistentes");
        } finally {
            setLoading(false);
        }
    }

    async function remove(document: string) {
        if (!currentEventId) return;
        const res = await removeAssistEvent(currentEventId, document);
        if (!res?.success) throw new Error(res?.message ?? "Error");
        setAssistants((prev) => prev.filter((a) => a.document !== document));
    }

    return {
        assistants,
        open,
        loading,
        setOpen,
        openForEvent,
        remove,
    };
}
