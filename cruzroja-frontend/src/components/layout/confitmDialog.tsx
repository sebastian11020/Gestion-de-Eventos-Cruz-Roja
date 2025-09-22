"use client";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
    open: boolean;
    title?: string;
    message?: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    closeOnOverlayClick?: boolean;
};

export function ConfirmDialog({
                                  open,
                                  title = "¿Eliminar?",
                                  message = (
                                      <>
                                          ¿Estás seguro de que quieres eliminar esto? <br />
                                          <span className="text-gray-500">Esta acción no se puede deshacer.</span>
                                      </>
                                  ),
                                  onConfirm,
                                  onCancel,
                                  confirmText = "Eliminar",
                                  cancelText = "Cancelar",
                                  closeOnOverlayClick = true,
                              }: ConfirmDialogProps) {
    const titleId = useId();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onCancel]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[1200] flex items-center justify-center">
            {/* Overlay */}
            <div
                role="presentation"
                onClick={closeOnOverlayClick ? onCancel : undefined}
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            />
            {/* Caja pequeña */}
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative w-[92vw] max-w-sm sm:max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mx-auto mb-3 inline-flex rounded-full bg-red-50 p-2 text-red-600">
                    <AlertTriangle className="size-5" />
                </div>
                <h3 id={titleId} className="mb-1 text-base font-semibold text-gray-900">
                    {title}
                </h3>
                <div className="text-sm text-gray-700">{message}</div>

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        autoFocus
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 active:bg-red-800"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
