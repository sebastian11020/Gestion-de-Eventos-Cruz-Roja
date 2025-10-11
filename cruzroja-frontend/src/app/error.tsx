// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error capturado:', error);
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
                            <p className="text-pretty text-sm text-slate-600 sm:text-base">
                                Nuestro técnico está intentando reconectar el servidor. Puedes
                                reintentar o volver al inicio.
                            </p>

                            {/* Ilustración animada */}
                            <div className="mt-2 w-full">
                                <Scene />
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

/** Escena SVG: toma y enchufe desconectados + técnico intentando reconectar */
function Scene() {
    return (
        <div className="mx-auto max-w-xl">
            <svg
                viewBox="0 0 680 260"
                className="mx-auto h-56 w-full select-none"
                role="img"
                aria-label="Cable desconectado y técnico intentando reconectar"
            >
                {/* Fondo suave */}
                <defs>
                    <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                        <stop stopColor="#f8fafc" offset="0" />
                        <stop stopColor="#eef2ff" offset="1" />
                    </linearGradient>
                    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                    </filter>
                    <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill="#e2e8f0" />
                    </pattern>
                </defs>

                <rect x="0" y="0" width="680" height="260" fill="url(#g1)" rx="16" />

                {/* Pared con textura */}
                <rect x="24" y="24" width="632" height="212" fill="url(#dots)" rx="14" opacity="0.35" />

                {/* Toma de pared (izquierda) */}
                <g transform="translate(80, 95)" filter="url(#shadow)">
                    <rect x="0" y="0" width="90" height="70" rx="10" fill="#ffffff" stroke="#cbd5e1" />
                    <rect x="24" y="20" width="12" height="18" rx="3" fill="#94a3b8" />
                    <rect x="54" y="20" width="12" height="18" rx="3" fill="#94a3b8" />
                    {/* Indicador de señal (ping) */}
                    <circle cx="78" cy="10" r="4" fill="#10b981" opacity="0.7" />
                    <circle className="ping" cx="78" cy="10" r="8" fill="#10b981" opacity="0.15" />
                </g>

                {/* Cable (línea curva) */}
                <path
                    d="M172,130 C260,150 360,80 450,120 C520,150 560,170 600,166"
                    stroke="#94a3b8"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="6 8"
                />

                {/* Enchufe (derecha) */}
                <g className="plug-bob" transform="translate(580, 125)" filter="url(#shadow)">
                    {/* cuerpo */}
                    <rect x="0" y="-12" width="42" height="24" rx="6" fill="#1f2937" />
                    {/* patas */}
                    <rect x="-6" y="-6" width="8" height="4" rx="1" fill="#9ca3af" />
                    <rect x="-6" y="2" width="8" height="4" rx="1" fill="#9ca3af" />
                    {/* cable */}
                    <rect x="38" y="-4" width="10" height="8" rx="2" fill="#334155" />
                </g>

                {/* Chispas cerca de la toma (cuando intenta conectar) */}
                <g transform="translate(172, 126)">
                    <circle className="spark" cx="0" cy="-10" r="3" fill="#fb7185" />
                    <circle className="spark" cx="10" cy="-4" r="2.5" fill="#f59e0b" style={{ animationDelay: '0.25s' as any }} />
                    <circle className="spark" cx="-8" cy="2" r="2" fill="#22d3ee" style={{ animationDelay: '0.5s' as any }} />
                </g>

                {/* Técnico con casco, escalera y llave */}
                <g className="tech-bob" transform="translate(360, 150)">
                    {/* sombra */}
                    <ellipse cx="0" cy="38" rx="34" ry="6" fill="#94a3b8" opacity="0.3" />
                    {/* escalera */}
                    <g transform="translate(-36, -10)">
                        <rect x="-8" y="-6" width="6" height="56" rx="2" fill="#cbd5e1" />
                        <rect x="14" y="-6" width="6" height="56" rx="2" fill="#cbd5e1" />
                        <rect x="-6" y="4" width="24" height="4" rx="2" fill="#e5e7eb" />
                        <rect x="-6" y="16" width="24" height="4" rx="2" fill="#e5e7eb" />
                        <rect x="-6" y="28" width="24" height="4" rx="2" fill="#e5e7eb" />
                        <rect x="-6" y="40" width="24" height="4" rx="2" fill="#e5e7eb" />
                    </g>

                    {/* cuerpo */}
                    <g transform="translate(0, 0)">
                        {/* casco */}
                        <path d="M-10,-8 C-6,-20 6,-20 10,-8 L10,0 L-10,0 Z" fill="#fbbf24" stroke="#d97706" />
                        {/* cabeza */}
                        <circle cx="0" cy="4" r="10" fill="#f1f5f9" stroke="#cbd5e1" />
                        {/* torso */}
                        <rect x="-12" y="14" width="24" height="18" rx="4" fill="#3b82f6" />
                        {/* brazo */}
                        <rect x="10" y="16" width="14" height="6" rx="3" fill="#3b82f6" />
                        {/* mano */}
                        <circle cx="26" cy="19" r="4" fill="#f1f5f9" stroke="#cbd5e1" />
                        {/* llave inglesa */}
                        <g className="wrench-spin" transform="translate(32, 19)">
                            <path
                                d="M0,0 L10,0 L12,-3 L16,1 L12,5 L10,2 L0,2 Z"
                                fill="#64748b"
                                stroke="#475569"
                            />
                        </g>
                        {/* piernas */}
                        <rect x="-12" y="32" width="10" height="14" rx="2" fill="#1f2937" />
                        <rect x="2" y="32" width="10" height="14" rx="2" fill="#1f2937" />
                        {/* botas */}
                        <rect x="-13" y="44" width="12" height="4" rx="1" fill="#0f172a" />
                        <rect x="1" y="44" width="12" height="4" rx="1" fill="#0f172a" />
                    </g>
                </g>
            </svg>
        </div>
    );
}
