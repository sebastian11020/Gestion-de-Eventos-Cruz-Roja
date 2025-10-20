"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

function validPassword(pw: string) {
  return pw.length >= 8;
}

// Eval simple de fortaleza (puedes ajustar reglas)
function passwordScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 5); // 0-5
}
function scoreLabel(score: number) {
  return (
    ["Muy débil", "Débil", "Aceptable", "Buena", "Fuerte", "Excelente"][
      score
    ] ?? "Muy débil"
  );
}
function scoreBarClass(score: number) {
  const base = "h-2 rounded transition-all";
  const widths = ["w-1/6", "w-2/6", "w-3/6", "w-4/6", "w-5/6", "w-full"];
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-600",
  ];
  return `${base} ${widths[score]} ${colors[score]}`;
}

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => passwordScore(pw), [pw]);
  const match = pw.length > 0 && pw === pw2;
  const canSubmit = ready && validPassword(pw) && match && !loading;

  useEffect(() => {
    const sb = supabase();

    async function ensureRecoverySession() {
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (session) {
        setReady(true);
        return;
      }

      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      if (type === "recovery" && access_token && refresh_token) {
        const { error } = await sb.auth.setSession({
          access_token,
          refresh_token,
        });
        if (!error) {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          setReady(true);
          return;
        }
      }

      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await sb.auth.exchangeCodeForSession(code);
        if (!error) {
          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          url.searchParams.delete("type");
          window.history.replaceState({}, document.title, url.pathname);
          setReady(true);
          return;
        }
      }

      toast.error("Enlace inválido o expirado. Solicita nuevamente el correo.");
    }

    ensureRecoverySession();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validPassword(pw))
      return toast.error("La contraseña debe tener mínimo 8 caracteres.");
    if (pw !== pw2) return toast.error("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      const sb = supabase();
      const { error } = await sb.auth.updateUser({ password: pw });
      if (error) throw error;

      await sb.auth.signOut(); // opcional: login limpio
      toast.success(
        "Contraseña actualizada. Inicia sesión con tu nueva clave.",
      );
      window.location.href = "/login";
    } catch (err: any) {
      toast.error(err?.message ?? "No se pudo actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <main className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4">
        <div className="text-slate-600 inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Validando enlace…
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4">
      {/* Decor */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />
      </div>

      <section className="w-full max-w-md">
        {/* Header minimal */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>

        {/* Card */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-2xl backdrop-blur-md transition-all hover:shadow-blue-200/40"
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-blue-600/10 text-blue-700 ring-1 ring-blue-200">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Restablecer contraseña
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Define una nueva contraseña para tu cuenta.
            </p>
          </div>

          {/* Nueva contraseña */}
          <div className="grid gap-2 mb-3">
            <label htmlFor="pw" className="text-sm font-medium text-slate-700">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="pw"
                type={showPw ? "text" : "password"}
                required
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="********"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={
                  showPw ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-700"
              >
                {showPw ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Barra de fortaleza */}
            <div className="mt-1">
              <div className="h-2 w-full rounded bg-slate-200">
                <div className={scoreBarClass(score)} />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Fortaleza:{" "}
                  <span className="font-medium">{scoreLabel(score)}</span>
                </span>
                <span>Mínimo 8 caracteres</span>
              </div>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="grid gap-2 mb-4">
            <label htmlFor="pw2" className="text-sm font-medium text-slate-700">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="pw2"
                type={showPw2 ? "text" : "password"}
                required
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="********"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={
                  showPw2 ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                onClick={() => setShowPw2((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-700"
              >
                {showPw2 ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Match hint */}
            {pw2.length > 0 && (
              <div
                className={`mt-1 inline-flex items-center gap-1 text-xs ${
                  match ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {match
                  ? "Las contraseñas coinciden"
                  : "Las contraseñas no coinciden"}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando…
              </span>
            ) : (
              "Guardar contraseña"
            )}
          </Button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Por seguridad, te pediremos iniciar sesión nuevamente después del
            cambio.
          </p>
        </form>
      </section>
    </main>
  );
}
