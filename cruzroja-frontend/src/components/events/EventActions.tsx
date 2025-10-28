// components/events/EventActions.tsx
"use client";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import toast from "react-hot-toast";

export function EventActions({
                                 isLeader,
                                 isInscrit,
                                 flags, // { isOngoing, ... }
                                 showSuscribe,
                                 onSubscribe,
                                 onCancel,
                                 onViewEnrolled,
                                 openStartQr,
                                 openEndQr,
                             }: {
    isLeader: boolean;
    isInscrit: boolean;
    flags: { isOngoing: boolean };
    showSuscribe: boolean;
    onSubscribe: () => void;
    onCancel: () => Promise<void> | void;
    onViewEnrolled: () => void;
    openStartQr: () => void;
    openEndQr: () => void;
}) {
    const { isOngoing } = flags;

    function handleSubscribeClick() {
        if (isOngoing) {
            toast.error("Este evento está en curso. No es posible inscribirse.");
            return;
        }
        onSubscribe();
    }

    return (
        <div className="p-4 pt-0 flex flex-col gap-2">
            {showSuscribe && (
                <>
                    {isLeader ? (
                        isOngoing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Button
                                    onClick={openStartQr}
                                    className="w-full rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                                    title="Mostrar QR de registro (inicio)"
                                >
                                    <QrCode className="w-4 h-4" />
                                    Ver QR de registro
                                </Button>
                                <Button
                                    onClick={openEndQr}
                                    className="w-full rounded-xl font-medium text-white bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2"
                                    title="Finalizar evento"
                                >
                                    <QrCode className="w-4 h-4" />
                                    Finalizar evento (QR)
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={openStartQr}
                                className="w-full rounded-xl font-medium text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
                                title="Iniciar evento"
                            >
                                <QrCode className="w-4 h-4" />
                                Iniciar evento (QR)
                            </Button>
                        )
                    ) : isInscrit ? (
                        isOngoing ? (
                            <Button
                                className="w-full rounded-xl font-medium bg-gray-300 text-gray-600 cursor-not-allowed"
                                title="No puedes cancelar mientras el evento está en curso"
                                disabled
                            >
                                No disponible durante el evento
                            </Button>
                        ) : (
                            <Button
                                onClick={onCancel}
                                className="w-full rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white"
                                title="Cancelar inscripción"
                            >
                                Cancelar inscripción
                            </Button>
                        )
                    ) : (
                        <Button
                            onClick={handleSubscribeClick}
                            className={`w-full rounded-xl font-medium text-white ${
                                isOngoing ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            title={isOngoing ? "Evento en curso" : "Inscribirme"}
                            disabled={isOngoing}
                        >
                            {isOngoing ? "En curso" : "Inscribirme"}
                        </Button>
                    )}
                </>
            )}

            <Button
                onClick={onViewEnrolled}
                variant="outline"
                className="w-full rounded-xl border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
            >
                Ver inscritos
            </Button>
        </div>
    );
}
