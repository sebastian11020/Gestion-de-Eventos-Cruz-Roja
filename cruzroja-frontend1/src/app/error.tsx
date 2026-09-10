"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error capturado:", error);
  }, [error]);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-14">
        {/* Escena */}
        <div className="relative w-full">
          <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                500 • Error de conexión
              </span>
              <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                Parece que el cable se desconectó…
              </h1>

              {/* Ilustración */}
              <div className="relative mt-2 flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl">
                <Image
                    src="/Error500.png"
                    alt="Error de conexión"
                    fill
                    priority
                    className="object-contain"
                />
              </div>

              {/* Acciones */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => reset()} className="px-6">
                  Reintentar conexión
                </Button>
                <Button variant="outline" asChild className="px-6">
                  <Link href="/">Ir al inicio</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Nota inferior */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Si el problema persiste, contacta al soporte o inténtalo más tarde.
        </p>
      </div>

      {/* Animaciones locales */}
      <style jsx>{`
        /* Enchufe “respira” */
        @keyframes plug-bob {
          0%,
          100% {
            transform: translateX(0) translateY(0) rotate(0deg);
          }
          50% {
            transform: translateX(-6px) translateY(-2px) rotate(-2deg);
          }
        }
        /* Chispa parpadea */
        @keyframes spark {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        /* Técnico se balancea levemente */
        @keyframes tech-bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        /* Llave inglesa gira */
        @keyframes wrench-spin {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(25deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        /* “Pulso” de señal */
        @keyframes ping {
          0% {
            transform: scale(0.7);
            opacity: 0.6;
          }
          70% {
            transform: scale(1.2);
            opacity: 0;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        .plug-bob {
          animation: plug-bob 2.2s ease-in-out infinite;
          transform-origin: center;
        }
        .spark {
          animation: spark 1.2s ease-in-out infinite;
          transform-origin: center;
        }
        .tech-bob {
          animation: tech-bob 2.6s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .wrench-spin {
          animation: wrench-spin 1.8s ease-in-out infinite;
          transform-origin: 6px 6px;
        }
        .ping {
          animation: ping 1.8s ease-out infinite;
        }
      `}</style>
    </div>
  );
}

