// components/layout/Modal.tsx
"use client";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const modalUI = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <button
        aria-label="Cerrar"
        className="
          absolute inset-0 bg-black/40 backdrop-blur-[1px]
          animate-[overlayShow_150ms_ease-out]
          motion-reduce:animate-none
        "
      />

      {/* Contenedor del modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="
    relative
    w-auto
    min-w-[70vw]
    max-w-[95vw]
    sm:min-w-[60vw] md:min-w-[65vw]
    lg:max-w-5xl xl:max-w-6xl
    max-h-[90vh]
    overflow-hidden
    rounded-2xl bg-white
    shadow-[0_15px_45px_rgba(0,0,0,0.2)]
    border border-gray-200
    flex flex-col
    animate-[modalShow_160ms_cubic-bezier(0.16,1,0.3,1)]
    motion-reduce:animate-none
  "
      >
        {/* Header sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-white/90 backdrop-blur-[1px] border-b border-gray-200 rounded-t-2xl">
          <h3 id={titleId} className="text-base font-semibold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="
              rounded-full p-2 text-gray-500
              hover:bg-gray-100 active:bg-gray-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300
              transition
            "
            aria-label="Cerrar"
            autoFocus
          >
            ✕
          </button>
        </div>

        {/* Body que crece hasta el límite y luego scrollea */}
        <div className="p-5 overflow-y-auto">
          <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalUI, document.body);
}
