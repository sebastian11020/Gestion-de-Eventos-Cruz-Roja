"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // 👈 1) importar spinner
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { getPersonData } from "@/services/serviceGetPerson";
import { user } from "@/types/usertType";

export default function LoginCR() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const sb = supabase();
      const { error } = await sb.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) throw error;
      const id = localStorage.getItem("supabase_uid");
      const userData: user = await getPersonData(id ?? "");
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: userData.role }),
      });
      localStorage.setItem("role", userData.role);
      router.replace("/dashboard");
    } catch (e: any) {
      setErr(e.message ?? "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_left,rgba(30,64,175,0.35),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(220,38,38,0.15),transparent_40%)] bg-white">
      <div
        className="pointer-events-none absolute inset-0 blur-3xl opacity-40 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(600px 300px at 20% 20%, rgba(59,130,246,0.25), transparent 60%), radial-gradient(600px 300px at 80% 80%, rgba(239,68,68,0.18), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <div
          aria-hidden
          className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-blue-500 via-blue-400 to-red-400 opacity-70 blur"
        />
        <Card className="relative rounded-3xl border bg-white/90 backdrop-blur shadow-[0_10px_30px_rgba(2,6,23,.25)] transition-transform duration-300 hover:scale-[1.01]">
          <CardHeader className="space-y-4 pb-2">
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
            {/* 2) envolver en <form onSubmit={login}> */}
            <form onSubmit={login} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-blue-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email" // ✅ mejor type email
                  placeholder="tu@correo.com" // (opcional, placeholder más claro)
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  disabled={loading} // desactivar mientras carga
                  className="pr-3 rounded-xl bg-white/70 border-blue-100 shadow-inner focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-blue-900">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    placeholder="Tu contraseña"
                    value={loginData.password}
                    disabled={loading}
                    className="pr-10 rounded-xl bg-white/70 border-blue-100 shadow-inner focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-all"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="absolute inset-y-0 right-2 grid place-items-center px-2 text-blue-700/70 hover:text-blue-800 transition-colors"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot"
                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              {err && <p className="text-sm text-red-600">{err}</p>}

              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="
                  w-full rounded-xl
                  bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700
                  hover:from-blue-800 hover:via-blue-700 hover:to-blue-800
                  shadow-md hover:shadow-lg
                  focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500
                  transition-all text-white
                  disabled:opacity-70 disabled:cursor-not-allowed
                "
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            {/* Separador */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
              <span className="text-xs text-blue-900/70">o</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            </div>
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
