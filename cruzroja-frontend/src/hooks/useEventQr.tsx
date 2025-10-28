"use client"
import { useState } from "react";
import toast from "react-hot-toast";
import { startEventService, endEventService } from "@/services/serviceGetEvent";

type Action = "start" | "end";

export function useEventQr(eventId: string, qrBase?: string, onAfter?: () => Promise<void> | void) {
    const [qrOpen, setQrOpen] = useState(false);
    const [qrAction, setQrAction] = useState<Action>("start");
    const [qrValue, setQrValue] = useState("");

    function open(action: Action) {
        setQrAction(action);
        const val = qrBase
            ? `${qrBase.replace(/\/$/, "")}?e=${eventId}&a=${action}`
            : `cr-attend://?e=${eventId}&a=${action}`;
        setQrValue(val);
        setQrOpen(true);
    }
    async function accept() {
        const op = qrAction === "start" ? await startEventService(eventId) : await endEventService(eventId);
        const labels =
            qrAction === "start"
                ? { loading: "Iniciando evento...", success: "Iniciado correctamente", error: "No se pudo iniciar" }
                : { loading: "Finalizando evento...", success: "Finalizado correctamente", error: "No se pudo finalizar" };

        const promise = op.then((res: { success: boolean; message?: string }) => {
            if (!res.success) return Promise.reject(res);
            return res;
        });
        await toast.promise(promise, {
            loading: labels.loading,
            success: (res: { message?: string }) => <b>{res.message ?? labels.success}</b>,
            error:   (res: { message?: string }) => <b>{res.message ?? labels.error}</b>,
        });

        await promise;
        setQrOpen(false);
        await onAfter?.();
    }
    return {
        qrOpen, setQrOpen,
        qrAction,
        qrValue,
        openStart: () => open("start"),
        openEnd:   () => open("end"),
        accept,
    };
}
