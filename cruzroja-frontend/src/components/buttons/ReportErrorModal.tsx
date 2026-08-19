"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm, ValidationError } from "@formspree/react";
import {
    Bug,
    X,
    Send,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from "lucide-react";

type ReportErrorModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function ReportErrorModal({
                                             open,
                                             onClose,
                                         }: ReportErrorModalProps) {
    const [state, handleSubmit, reset] = useForm("mrpzrqlg");

    const [pageUrl, setPageUrl] = useState("");
    const [pageTitle, setPageTitle] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (open && typeof window !== "undefined") {
            setPageUrl(window.location.href);
            setPageTitle(document.title);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [open]);

    if (!mounted || !open) {
        return null;
    }

    function handleClose() {
        if (state.submitting) return;

        reset();
        onClose();
    }

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="report-error-title"
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 px-5 py-4 text-white">
                    <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-red-500/15 ring-1 ring-red-400/20">
              <Bug className="size-5 text-red-300" />
            </span>

                        <div>
                            <h2
                                id="report-error-title"
                                className="text-base font-bold"
                            >
                                Reportar un error
                            </h2>

                            <p className="text-xs text-blue-100/70">
                                Ayúdanos a mejorar la aplicación
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={state.submitting}
                        aria-label="Cerrar"
                        className="rounded-lg p-2 text-blue-100 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-5">
                    {state.succeeded ? (
                        <div className="flex flex-col items-center py-8 text-center">
                            <div className="mb-4 grid size-16 place-items-center rounded-full bg-green-100">
                                <CheckCircle2 className="size-9 text-green-600" />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900">
                                ¡Reporte enviado!
                            </h3>

                            <p className="mt-2 max-w-sm text-sm text-gray-500">
                                Gracias por ayudarnos a mejorar la aplicación.
                                Hemos recibido tu reporte correctamente.
                            </p>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="mt-6 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                            >
                                Cerrar
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="error-message"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    ¿Qué ocurrió?
                                </label>

                                <textarea
                                    id="error-message"
                                    name="message"
                                    required
                                    minLength={5}
                                    rows={5}
                                    placeholder="Describe el problema que encontraste..."
                                    className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                                />

                                <ValidationError
                                    prefix="Descripción"
                                    field="message"
                                    errors={state.errors}
                                    className="mt-1 text-xs text-red-600"
                                />
                            </div>

                            {/* Información automática */}
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Información del reporte
                                </p>

                                <div className="space-y-1.5 text-xs text-gray-600">
                                    <p>
                    <span className="font-semibold text-gray-700">
                      Página:
                    </span>{" "}
                                        <span className="break-all">{pageUrl}</span>
                                    </p>

                                    <p>
                    <span className="font-semibold text-gray-700">
                      Título:
                    </span>{" "}
                                        {pageTitle || "—"}
                                    </p>
                                </div>
                            </div>

                            <input
                                type="hidden"
                                name="page_url"
                                value={pageUrl}
                            />

                            <input
                                type="hidden"
                                name="page_title"
                                value={pageTitle}
                            />

                            <input
                                type="hidden"
                                name="reported_at"
                                value={
                                    typeof window !== "undefined"
                                        ? new Date().toLocaleString("es-CO")
                                        : ""
                                }
                            />

                            <input
                                type="hidden"
                                name="user_agent"
                                value={
                                    typeof window !== "undefined"
                                        ? navigator.userAgent
                                        : ""
                                }
                            />

                            {state.errors && (
                                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                                    <AlertCircle className="mt-0.5 size-4 shrink-0" />

                                    <div>
                                        <p className="font-semibold">
                                            No pudimos enviar el reporte
                                        </p>

                                        <p className="mt-0.5 text-xs text-red-600">
                                            Inténtalo nuevamente en unos segundos.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={state.submitting}
                                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={state.submitting}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {state.submitting ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-4" />
                                            Enviar reporte
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}