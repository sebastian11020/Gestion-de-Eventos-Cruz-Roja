"use client";

import { CalendarDays, MapPin, Users, Trash2, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {skillQuota} from "@/types/usertType";


type EventCardProps = {
    title: string;
    description: string;
    date: string;
    location: string;
    capacity: string;
    leader: {
        id: string;
        name: string;
    };
    streetAddress: string;
    showSuscribe: boolean;
    onSubscribe: () => void;
    onViewEnrolled: () => void;
    onDelete?: () => void;
    skillQuotas: skillQuota[];
};

export function EventCard({
                              title,
                              description,
                              date,
                              location,
                              capacity,
                              leader,
                              streetAddress,
                              showSuscribe,
                              onSubscribe,
                              onViewEnrolled,
                              onDelete,
                              skillQuotas = [], // 👈 por defecto vacío
                          }: EventCardProps) {
    // Normaliza cantidades (string/number) a number seguro para mostrar
    const parseQty = (q: number | string) => {
        const n = typeof q === "string" ? parseInt(q, 10) : q;
        return Number.isFinite(n) ? n : 0;
    };

    const hasQuotas = Array.isArray(skillQuotas) && skillQuotas.length > 0;

    return (
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col border border-gray-100">
            {/* Botón eliminar */}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="absolute top-3 right-3 rounded-full p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                    title="Eliminar evento"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}

            {/* Cabecera */}
            <div className="p-4 pb-0">
                <h3 className="text-lg font-semibold text-gray-800 leading-tight pr-6">
                    {title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{description}</p>
            </div>

            {/* Contenido */}
            <div className="flex flex-col p-4 gap-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <UserCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{leader.name}</span>
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-blue-500" />
                        <span>{date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>
              {location} – <span className="text-gray-700">{streetAddress}</span>
            </span>
                    </div>

                    {/* Capacidad total */}
                    {capacity && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-600" />
                            <span className="text-gray-700">
                Cupo total: <span className="font-medium">{capacity}</span>
              </span>
                        </div>
                    )}

                    {/* Desglose por habilidad */}
                    {hasQuotas && (
                        <div className="mt-1">
              <span className="block text-xs text-gray-500 mb-1">
                Cupos por habilidad:
              </span>
                            <div className="flex flex-wrap gap-2">
                                {skillQuotas.map((sq) => (
                                    <span
                                        key={sq.id}
                                        className="px-2 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700"
                                        title={`${sq.name}: ${parseQty(sq.quantity)} cupos`}
                                    >
                    {sq.name}{" "}
                                        <span className="font-semibold">
                      {parseQty(sq.quantity)}
                    </span>
                  </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {!hasQuotas && (
                        <span className="block text-xs text-gray-500 mb-1">No se requieren habilidasdes especiales</span>
                    )
                    }
                </div>
            </div>

            {/* Botones de acción */}
            <div className="p-4 pt-0 flex flex-col gap-2">
                {showSuscribe && (
                    <Button
                        onClick={onSubscribe}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                    >
                        Inscribirme
                    </Button>
                )}

                <Button
                    onClick={onViewEnrolled}
                    variant="outline"
                    className="w-full rounded-xl border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
                >
                    Ver inscritos
                </Button>
            </div>
        </div>
    );
}
