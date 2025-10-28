"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";

export function QrDialog({
                             open,
                             onClose,
                             title,
                             value,
                             variant = "start",
                             onlyClose = false,
                             onAccept,
                         }: {
    open: boolean;
    onClose: () => void;
    title: string;
    value: string;
    variant?: "start" | "end";           // "end" = finalización
    onlyClose?: boolean;                 // si true, solo muestra botón "Ocultar/Cerrar"
    onAccept?: () => Promise<void> | void;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const isFinalize = variant === "end";

    const handleAccept = async () => {
        if (!onAccept) return onClose();
        try {
            setLoading(true);
            await onAccept();
            // en "start", cerramos aquí; en "end" también podrías cerrar aquí,
            // pero lo controla el padre tras completar para refrescar
            if (!isFinalize) onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-xl border border-gray-200 p-5 animate-[scaleIn_180ms_ease-out]">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {isFinalize
                                ? "Pide a cada participante que escanee este QR para registrar la salida."
                                : "Pide a la persona que escanee este código para registrar su asistencia en el evento."
                            }
                        </p>

                        {isFinalize && (
                            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900 text-sm">
                                <strong>Importante:</strong> asegúrate de que <u>todas las personas</u> hayan escaneado
                                la <b>finalización</b> antes de cerrar el evento. Después de finalizar,
                                <b> ya no podrán escanear</b> su salida.
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="h-8 w-8 p-0 rounded-full"
                        aria-label="Cerrar"
                        disabled={loading}
                    >
                        ✕
                    </Button>
                </div>

                <div className="mt-4 flex flex-col items-center gap-3">
                    <div className="rounded-2xl p-3 border bg-white shadow-sm">
                        <QRCodeCanvas value={value} size={220} ref={canvasRef as any} />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                    {onlyClose ? (
                        <Button
                            onClick={onClose}
                            className="rounded-xl w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800"
                            type="button"
                            disabled={loading}
                        >
                            Ocultar
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="rounded-xl w-full sm:w-auto"
                                type="button"
                                disabled={loading}
                            >
                                Ocultar
                            </Button>
                            <Button
                                onClick={handleAccept}
                                className={`rounded-xl w-full sm:w-auto ${isFinalize ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                                type="button"
                                disabled={loading}
                            >
                                {loading
                                    ? (isFinalize ? "Finalizando..." : "Procesando...")
                                    : (isFinalize ? "Finalizar evento" : "Aceptar")}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes scaleIn {
                    from { opacity: 0; transform: translateY(4px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
