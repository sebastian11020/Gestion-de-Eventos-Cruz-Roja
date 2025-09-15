"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function LoginCR() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div
      className={`
        min-h-screen w-full flex items-center justify-center p-4
        bg-[radial-gradient(ellipse_at_top_left,rgba(30,64,175,0.35),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(220,38,38,0.15),transparent_40%)]
       bg-white
      `}
    >
      {/* Aura decorativa */}
      <div
        className="pointer-events-none absolute inset-0 blur-3xl opacity-40 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(600px 300px at 20% 20%, rgba(59,130,246,0.25), transparent 60%), radial-gradient(600px 300px at 80% 80%, rgba(239,68,68,0.18), transparent 60%)",
        }}
      />

      {/* Card con borde-aurora y glass */}
      <div className="relative w-full max-w-md">
        <div
          aria-hidden
          className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-blue-500 via-blue-400 to-red-400 opacity-70 blur"
        />
        <Card
          className={`
            relative rounded-3xl border bg-white/90 backdrop-blur
            shadow-[0_10px_30px_rgba(2,6,23,.25)]
            transition-transform duration-300 hover:scale-[1.01]
          `}
        >
          <CardHeader className="space-y-4 pb-2">
            {/* Marca */}
            <div className="flex items-center justify-center gap-3">
              <div className="size-12 rounded-2xl bg-white grid place-items-center shadow ring-1 ring-blue-200">
                <svg
                  viewBox="0 0 24 24"
                  className="size-7 text-red-600"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-blue-900/80">
                  Cruz Roja Colombiana
                </p>
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Iniciar sesión
              </CardTitle>
            </div>
            <p className="text-center text-sm text-blue-900/70">
              📚 Accede para llevar un mejor control de tu record de
              voluntariado ⛑️.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-0">
            {/* Documento */}
            <div className="grid gap-2">
              <Label htmlFor="document" className="text-blue-900">
                Documento
              </Label>
              <Input
                id="document"
                type="text"
                placeholder="Número de documento"
                className={`
                  pr-3 rounded-xl
                  bg-white/70
                  border-blue-100
                  shadow-inner
                  focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                  transition-all
                `}
              />
            </div>

            {/* Contraseña */}
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-blue-900">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  className={`
                    pr-10 rounded-xl
                    bg-white/70
                    border-blue-100
                    shadow-inner
                    focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                    transition-all
                  `}
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className={`
                    absolute inset-y-0 right-2 grid place-items-center px-2
                    text-blue-700/70 hover:text-blue-800
                    transition-colors
                  `}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/recuperar"
                  className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Botón entrar */}
            <Button
              type="submit"
              className={`
                w-full rounded-xl
                bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700
                hover:from-blue-800 hover:via-blue-700 hover:to-blue-800
                shadow-md hover:shadow-lg
                focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500
                transition-all
              `}
            >
              Entrar
            </Button>

            {/* Separador */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
              <span className="text-xs text-blue-900/70">o</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            </div>

            {/* Acción secundaria */}
            <div className="text-center">
              <Link
                href="/recuperar"
                className="inline-flex items-center justify-center text-sm font-medium text-blue-800 hover:text-blue-900 hover:underline transition-colors"
              >
                Recuperar acceso
              </Link>
            </div>

            {/* Nota legal breve */}
            <p className="text-[11px] text-center text-blue-900/70">
              Uso interno institucional. Si necesitas ayuda, contacta al
              administrador.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
