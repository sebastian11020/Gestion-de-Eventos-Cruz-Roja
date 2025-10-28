"use client";
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ScanLine, X, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";

const COOLDOWN_MS = 30000;

function extractParamsFromScan(text: string): {
  e?: string;
  a?: "start" | "end";
  n?: string;
} {
  try {
    const u = new URL(text, window.location.origin);
    const sp = u.searchParams;
    const e1 = sp.get("e") || undefined;
    const a1 = (sp.get("a") as "start" | "end" | null) || undefined;
    const n1 = sp.get("n") || undefined;
    if (e1 && a1) return { e: e1, a: a1, n: n1 };
    const m = u.pathname.match(/\/events\/([^/]+)\/attendance\/?$/i);
    const action = (sp.get("action") as "start" | "end" | null) || undefined;
    if (m && action) {
      return { e: m[1], a: action };
    }
  } catch {
    const qIndex = text.indexOf("?");
    if (qIndex >= 0) {
      const sp = new URLSearchParams(text.slice(qIndex + 1));
      const e = sp.get("e") || undefined;
      const a = (sp.get("a") as "start" | "end" | null) || undefined;
      const n = sp.get("n") || undefined;
      if (e && a) return { e, a, n };
    }
  }
  return {};
}

export function ReadQrDialog({
  open,
  onClose,
  apiBase,
}: {
  open: boolean;
  onClose: () => void;
  apiBase: string;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const lastScanAtRef = useRef<number>(0);
    const lastTextRef = useRef<string>("");
    const isProcessingRef = useRef<boolean>(false);
  useEffect(() => {
    if (!open || !boxRef.current) return;
    const config = {
      fps: 8,
      qrbox: { width: 260, height: 260 },
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
    };

    const scanner = new Html5QrcodeScanner(
      boxRef.current.id,
      config as any,
      false,
    );
    scannerRef.current = scanner;

      scanner.render(
          async (text) => {
              const now = Date.now();
              if (isProcessingRef.current) return;
              if (now - lastScanAtRef.current < COOLDOWN_MS) return;
              if (text === lastTextRef.current && now - lastScanAtRef.current < 5000) return;
              isProcessingRef.current = true;
              lastScanAtRef.current = now;
              lastTextRef.current = text;

              try {
                  const { e, a, n } = extractParamsFromScan(text);

                  if (!e || !a || !["start", "end"].includes(a)) {
                      toast.error("QR inválido");
                      return;
                  }

                  const sb = supabase();
                  const { data: { session } } = await sb.auth.getSession();

                  if (!session?.access_token || !session.user?.id) {
                      toast.error("Inicia sesión para registrar asistencia");
                      return;
                  }

                  const body: any = { id_event: e, action: a, user_id: session.user.id };
                  if (n) body.nonce = n;

                  const res = await fetch(
                      `${apiBase.replace(/\/$/, "")}/event-attendance/attendance`,
                      {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${session.access_token}`,
                          },
                          body: JSON.stringify(body),
                      },
                  );

                  const data = await res.json().catch(() => ({}));
                  if (!res.ok || data?.success === false) {
                      toast.error(data?.message ?? "No se pudo registrar la asistencia");
                      return;
                  }

                  if ("vibrate" in navigator) {
                      try { navigator.vibrate?.(60); } catch {}
                  }
                  toast.success(data?.message ?? "Asistencia registrada");
                  await scanner.clear();
                  onClose();
              } catch (err) {
                  console.error(err);
                  toast.error("Error leyendo el QR");
              } finally {
                  setTimeout(() => { isProcessingRef.current = false; }, COOLDOWN_MS);
              }
          },
          () => {},
      );


    return () => {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, [open, apiBase, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[3px] animate-[fadeIn_180ms_ease-out]"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl border border-gray-200 animate-[scaleIn_200ms_ease-out]">
        {/* Header */}
        <div className="flex items-start gap-3 p-4">
          <div className="shrink-0 rounded-xl bg-indigo-50 p-2 text-indigo-600">
            <ScanLine className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">
              Leer código QR
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Enfoca el QR para registrar tu asistencia de manera segura.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Scanner frame */}
        <div className="px-4 pb-2">
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-b from-gray-50 to-white p-3 shadow-sm">
            <div
              id="qr-reader"
              ref={boxRef}
              className="rounded-xl overflow-hidden min-h-[280px]"
            />
          </div>

          {/* Tips y nota de privacidad */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[13px] text-gray-600">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              Tu sesión garantiza que el registro quede asociado a tu cuenta.
            </div>
            <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
              <li>
                Permite el acceso a la cámara si el navegador lo solicita.
              </li>
              <li>
                Activa la linterna desde el control del visor si es necesario.
              </li>
              <li>Mantén el código centrado dentro del recuadro.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 pt-1 flex justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl"
            type="button"
          >
            Cerrar
          </Button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <style jsx global>{`
        #qr-reader__dashboard_section_csr span,
        #qr-reader__dashboard span#qr-reader__scan_region span {
          font-size: 12px !important;
          color: #475569 !important;
        }
        #qr-reader__dashboard button {
          border-radius: 10px !important;
        }
      `}</style>
    </div>
  );
}
