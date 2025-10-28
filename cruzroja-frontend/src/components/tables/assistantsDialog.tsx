"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";
import { ConfirmDialog } from "@/components/cards/confitmDialog";
import { Loader2, Trash2, Search, UserRound, X } from "lucide-react";
import type { assistantEvent } from "@/types/usertType";
import toast from "react-hot-toast";

export default function AssistantsDialog({
                                             open,
                                             onClose,
                                             assistants,
                                             loading = false,
                                             onRemove,
                                             title = "Asistentes",
                                         }: {
    open: boolean;
    onClose: () => void;
    assistants: assistantEvent[];
    loading?: boolean;
    /** Callback que recibe el document del asistente a quitar */
    onRemove: (document: string) => Promise<void> | void;
    title?: string;
}) {
    const [query, setQuery] = useState("");
    const [confirming, setConfirming] = useState<assistantEvent | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return assistants;
        return assistants.filter((a) =>
            [a.name, a.licence, a.phone]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q)),
        );
    }, [assistants, query]);

    const total = assistants.length;
    const shown = filtered.length;

    async function handleConfirmRemove(doc: string) {
        try {
            setRemovingId(doc);
            await toast.promise(Promise.resolve(onRemove(doc)), {
                loading: "Quitando asistente...",
                success: <b>Asistente eliminado</b>,
                error: <b>No se pudo quitar</b>,
            });
            setConfirming(null);
        } finally {
            setRemovingId(null);
        }
    }

    function clearQuery() {
        setQuery("");
    }

    return (
        <Modal open={open} onClose={onClose} title={title}>
            {/* Header con buscador y contador */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50/60 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por nombre, licencia o teléfono"
                        className="w-full bg-transparent outline-none text-sm"
                        aria-label="Buscar asistentes"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={clearQuery}
                            className="rounded-full p-1 hover:bg-gray-200 text-gray-500"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs">
          <span className="inline-flex items-center gap-1 font-medium">
            <UserRound className="w-3.5 h-3.5" /> {shown}
          </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{total}</span>
                </div>
            </div>

            {/* Tabla (desktop) */}
            <div className="hidden sm:block max-h-[60vh] overflow-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b text-gray-600">
                    <tr>
                        <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                        <th className="text-left px-4 py-3 font-semibold">Licencia</th>
                        <th className="text-left px-4 py-3 font-semibold">Teléfono</th>
                        <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading && (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-600">
                                <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                                Cargando asistentes...
                            </td>
                        </tr>
                    )}

                    {!loading && filtered.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-12 text-center text-gray-600">
                                <div className="flex flex-col items-center gap-2">
                                    <UserRound className="w-8 h-8 text-gray-300" />
                                    <p className="text-sm">No hay asistentes que coincidan.</p>
                                </div>
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        filtered.map((a) => (
                            <tr
                                key={`${a.name}-${a.licence}-${a.phone}`}
                                className="hover:bg-gray-50/70 transition-colors"
                            >
                                <td className="px-4 py-3 font-medium text-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="grid place-items-center h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                                            {getInitials(a.name)}
                                        </div>
                                        <span>{a.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{a.licence}</td>
                                <td className="px-4 py-3">{a.phone}</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="gap-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                            onClick={() => setConfirming(a)}
                                            disabled={removingId !== null}
                                            title="Quitar del evento"
                                            aria-label={`Quitar a ${a.name}`}
                                        >
                                            {removingId === a.document ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Lista (móvil) */}
            <div className="sm:hidden space-y-3 max-h-[60vh] overflow-auto pr-1">
                {loading && (
                    <div className="flex items-center justify-center py-8 text-gray-600">
                        <Loader2 className="w-4 h-4 inline animate-spin mr-2" /> Cargando asistentes...
                    </div>
                )}
                {!loading && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-600 rounded-2xl border border-dashed">
                        <UserRound className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-sm">No hay asistentes que coincidan.</p>
                    </div>
                )}
                {!loading &&
                    filtered.map((a) => (
                        <div
                            key={`m-${a.name}-${a.licence}-${a.phone}`}
                            className="rounded-2xl border border-gray-200 p-3 shadow-sm bg-white"
                        >
                            <div className="flex items-center gap-3">
                                <div className="grid place-items-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                                    {getInitials(a.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">{a.name}</div>
                                    <div className="text-xs text-gray-600">Licencia: {a.licence}</div>
                                    <div className="text-xs text-gray-600">Tel: {a.phone}</div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="ml-auto gap-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => setConfirming(a)}
                                    disabled={removingId !== null}
                                    title="Quitar del evento"
                                    aria-label={`Quitar a ${a.name}`}
                                >
                                    {removingId === a.document ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Confirmación */}
            <ConfirmDialog
                open={!!confirming}
                title="Quitar asistente"
                onCancel={() => setConfirming(null)}
                onConfirm={() => confirming && handleConfirmRemove(confirming.document)}
                confirmText="Sí, quitar"
                cancelText="Cancelar"
            />

            {/* Pie */}
            <div className="mt-4 flex justify-end gap-2 ">
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-red-200 text-white bg-red-500 hover:bg-red-600 ">
                    Cerrar
                </Button>
            </div>
        </Modal>
    );
}

function getInitials(name?: string) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "?";
}
