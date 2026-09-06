"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  ScanLine,
  X,
  ShieldCheck,
  Camera,
  Flashlight,
  FlashlightOff,
  RefreshCw,
} from "lucide-react";
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
    const a1 =
        (sp.get("a") as "start" | "end" | null) || undefined;
    const n1 = sp.get("n") || undefined;

    if (e1 && a1) {
      return {
        e: e1,
        a: a1,
        n: n1,
      };
    }

    const m = u.pathname.match(
        /\/events\/([^/]+)\/attendance\/?$/i,
    );

    const action =
        (sp.get("action") as "start" | "end" | null) ||
        undefined;

    if (m && action) {
      return {
        e: m[1],
        a: action,
      };
    }
  } catch {
    const qIndex = text.indexOf("?");

    if (qIndex >= 0) {
      const sp = new URLSearchParams(
          text.slice(qIndex + 1),
      );

      const e = sp.get("e") || undefined;

      const a =
          (sp.get("a") as "start" | "end" | null) ||
          undefined;

      const n = sp.get("n") || undefined;

      if (e && a) {
        return {
          e,
          a,
          n,
        };
      }
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
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const lastScanAtRef = useRef<number>(0);
  const lastTextRef = useRef<string>("");
  const isProcessingRef = useRef<boolean>(false);

  const [cameras, setCameras] = useState<
      { id: string; label: string }[]
  >([]);

  const [currentCameraIndex, setCurrentCameraIndex] =
      useState(0);

  const [isScanning, setIsScanning] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] =
      useState(false);

  const [isSwitchingCamera, setIsSwitchingCamera] =
      useState(false);

  /*
   * Detener scanner
   */
  const stopScanner = async () => {
    const scanner = scannerRef.current;

    if (!scanner) return;

    try {
      const state = scanner.getState();

      // 2 = SCANNING
      // 3 = PAUSED
      if (state === 2 || state === 3) {
        await scanner.stop();
      }

      scanner.clear();
    } catch (error) {
      console.error("Error deteniendo scanner:", error);
    } finally {
      scannerRef.current = null;
      setIsScanning(false);
      setIsTorchOn(false);
      setTorchSupported(false);
    }
  };

  /*
   * Iniciar scanner
   */
  const startScanner = async (
      cameraId: string,
      cameraIndex: number,
  ) => {
    try {
      setIsSwitchingCamera(true);

      const scanner = scannerRef.current;

      if (scanner) {
        try {
          const state = scanner.getState();

          if (state === 2 || state === 3) {
            await scanner.stop();
          }

          scanner.clear();
        } catch (error) {
          console.error(
              "Error limpiando scanner anterior:",
              error,
          );
        }
      }

      const newScanner = new Html5Qrcode("qr-reader");

      scannerRef.current = newScanner;

      await newScanner.start(
          cameraId,
          {
            fps: 8,

            qrbox: {
              width: 260,
              height: 260,
            },

            aspectRatio: 1,
          },

          async (text) => {
            const now = Date.now();

            if (isProcessingRef.current) return;

            if (
                now - lastScanAtRef.current <
                COOLDOWN_MS
            ) {
              return;
            }

            if (
                text === lastTextRef.current &&
                now - lastScanAtRef.current < 5000
            ) {
              return;
            }

            isProcessingRef.current = true;
            lastScanAtRef.current = now;
            lastTextRef.current = text;

            try {
              const { e, a, n } =
                  extractParamsFromScan(text);

              if (
                  !e ||
                  !a ||
                  !["start", "end"].includes(a)
              ) {
                toast.error("QR inválido");
                return;
              }
              const {
                data: { session },
              } = await supabase.auth.getSession();

              if (
                  !session?.access_token ||
                  !session.user?.id
              ) {
                toast.error(
                    "Inicia sesión para registrar asistencia",
                );
                return;
              }

              const body: {
                id_event: string;
                action: "start" | "end";
                user_id: string;
                nonce?: string;
              } = {
                id_event: e,
                action: a,
                user_id: session.user.id,
              };

              if (n) {
                body.nonce = n;
              }

              const res = await fetch(
                  `${apiBase.replace(
                      /\/$/,
                      "",
                  )}/event-attendance/attendance`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type":
                          "application/json",
                      Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify(body),
                  },
              );

              const data = await res
                  .json()
                  .catch(() => ({}));

              if (
                  !res.ok ||
                  data?.success === false
              ) {
                toast.error(
                    data?.message ??
                    "No se pudo registrar la asistencia",
                );
                return;
              }

              if ("vibrate" in navigator) {
                try {
                  navigator.vibrate?.(60);
                } catch {}
              }

              toast.success(
                  data?.message ??
                  "Asistencia registrada",
              );

              await stopScanner();
              onClose();
            } catch (error) {
              console.error(error);
              toast.error(
                  "Error leyendo el QR",
              );
            } finally {
              setTimeout(() => {
                isProcessingRef.current = false;
              }, COOLDOWN_MS);
            }
          },

          () => {
            // Errores normales de lectura.
            // No mostramos toast porque la cámara
            // está constantemente intentando leer.
          },
      );

      setCurrentCameraIndex(cameraIndex);
      setIsScanning(true);

      /*
       * Comprobar si la cámara soporta linterna.
       */
      try {
        const capabilities =
            newScanner
                .getRunningTrackCameraCapabilities();

        const torch =
            capabilities.torchFeature();

        setTorchSupported(
            torch.isSupported(),
        );
      } catch {
        setTorchSupported(false);
      }
    } catch (error) {
      console.error(
          "Error iniciando cámara:",
          error,
      );

      toast.error(
          "No se pudo acceder a la cámara",
      );

      scannerRef.current = null;
      setIsScanning(false);
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  /*
   * Obtener cámaras e iniciar la primera.
   */
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const initializeScanner = async () => {
      try {
        const devices =
            await Html5Qrcode.getCameras();

        if (cancelled) return;

        if (!devices.length) {
          toast.error(
              "No se encontró ninguna cámara",
          );
          return;
        }

        const formattedCameras = devices.map(
            (camera) => ({
              id: camera.id,
              label:
                  camera.label ||
                  `Cámara ${devices.indexOf(camera) + 1}`,
            }),
        );

        setCameras(formattedCameras);

        await startScanner(
            formattedCameras[0].id,
            0,
        );
      } catch (error) {
        console.error(
            "Error obteniendo cámaras:",
            error,
        );

        if (!cancelled) {
          toast.error(
              "No se pudo acceder a la cámara. Revisa los permisos del navegador.",
          );
        }
      }
    };

    initializeScanner();

    return () => {
      cancelled = true;

      const scanner = scannerRef.current;

      if (scanner) {
        try {
          const state = scanner.getState();

          if (state === 2 || state === 3) {
            scanner.stop().catch(() => {});
          }
        } catch {}

        scannerRef.current = null;
      }

      setIsScanning(false);
      setIsTorchOn(false);
      setTorchSupported(false);
      setCameras([]);
      setCurrentCameraIndex(0);
    };
  }, [open]);

  /*
   * Cambiar cámara
   */
  const handleSwitchCamera = async () => {
    if (
        cameras.length <= 1 ||
        isSwitchingCamera
    ) {
      return;
    }

    const nextIndex =
        (currentCameraIndex + 1) %
        cameras.length;

    const nextCamera =
        cameras[nextIndex];

    await startScanner(
        nextCamera.id,
        nextIndex,
    );
  };
  const handleToggleTorch = async () => {
    const scanner = scannerRef.current;

    if (!scanner || !torchSupported) {
      return;
    }

    try {
      const capabilities =
          scanner.getRunningTrackCameraCapabilities();

      const torch =
          capabilities.torchFeature();

      if (!torch.isSupported()) {
        toast.error(
            "Esta cámara no soporta linterna",
        );
        return;
      }

      await torch.apply(
          !isTorchOn,
      );

      setIsTorchOn(!isTorchOn);
    } catch (error) {
      console.error(
          "Error controlando linterna:",
          error,
      );

      toast.error(
          "No se pudo controlar la linterna",
      );
    }
  };

  /*
   * Cerrar
   */
  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  if (!open) return null;

  const currentCamera =
      cameras[currentCameraIndex];

  return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[3px] animate-[fadeIn_180ms_ease-out]"
            onClick={handleClose}
        />

        {/* Card */}
        <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl animate-[scaleIn_200ms_ease-out]">
          {/* Header */}
          <div className="flex items-start gap-3 p-4">
            <div className="shrink-0 rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <ScanLine className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">
                Leer código QR
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Enfoca el QR para registrar tu
                asistencia de manera segura.
              </p>
            </div>

            <Button
                variant="ghost"
                onClick={handleClose}
                className="h-8 w-8 rounded-full p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scanner */}
          <div className="px-4 pb-2">
            <div className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-b from-gray-50 to-white p-3 shadow-sm">
              <div
                  id="qr-reader"
                  className="min-h-[280px] overflow-hidden rounded-xl"
              />
            </div>

            {/* Controles personalizados */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {/* Cambiar cámara */}
              <Button
                  type="button"
                  variant="outline"
                  disabled={
                      cameras.length <= 1 ||
                      isSwitchingCamera ||
                      !isScanning
                  }
                  onClick={handleSwitchCamera}
                  className="h-10 rounded-xl border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {isSwitchingCamera ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Camera className="mr-2 h-4 w-4" />
                )}

                {isSwitchingCamera
                    ? "Cambiando..."
                    : "Cambiar cámara"}
              </Button>

              {/* Linterna */}
              <Button
                  type="button"
                  variant="outline"
                  disabled={
                      !torchSupported ||
                      !isScanning
                  }
                  onClick={handleToggleTorch}
                  className={`h-10 rounded-xl border-gray-200 ${
                      isTorchOn
                          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-white text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
              >
                {isTorchOn ? (
                    <FlashlightOff className="mr-2 h-4 w-4" />
                ) : (
                    <Flashlight className="mr-2 h-4 w-4" />
                )}

                {isTorchOn
                    ? "Apagar linterna"
                    : "Linterna"}
              </Button>
            </div>

            {/* Cámara actual */}
            {currentCamera && (
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                  <Camera className="h-3.5 w-3.5" />

                  <span className="max-w-[260px] truncate">
                {currentCamera.label}
              </span>
                </div>
            )}

            {/* Tips */}
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[13px] text-gray-600">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>

                <span>
                Tu sesión garantiza que el registro
                quede asociado a tu cuenta.
              </span>
              </div>

              <ul className="space-y-1 pl-5 text-xs text-gray-500">
                <li>
                  Permite el acceso a la cámara si el
                  navegador lo solicita.
                </li>

                <li>
                  Usa la linterna si hay poca
                  iluminación.
                </li>

                <li>
                  Mantén el código centrado dentro
                  del recuadro.
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-4 pb-4 pt-2">
            <Button
                variant="ghost"
                onClick={handleClose}
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
      </div>
  );
}