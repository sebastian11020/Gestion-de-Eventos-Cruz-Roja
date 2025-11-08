"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cambiar contraseña",
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loadingInit, setLoadingInit] = useState(true);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const sb = supabase();
        const { data } = await sb.auth.getUser();
        const userEmail = data.user?.email ?? "";
        if (!userEmail) {
          toast.error("Tu sesión expiró. Vuelve a iniciar sesión.");
          router.replace("/login");
          return;
        }
        setEmail(userEmail);
      } catch {
        toast.error("No se pudo obtener la sesión. Inicia sesión de nuevo.");
        router.replace("/login");
      } finally {
        setLoadingInit(false);
      }
    })();
  }, [router]);

  // Validación simple de robustez
  function validatePassword(pw: string) {
    const issues: string[] = [];
    if (pw.length < 8) issues.push("Debe tener al menos 8 caracteres.");
    if (!/[A-Z]/.test(pw)) issues.push("Debe incluir al menos una mayúscula.");
    if (!/[a-z]/.test(pw)) issues.push("Debe incluir al menos una minúscula.");
    if (!/[0-9]/.test(pw)) issues.push("Debe incluir al menos un número.");
    if (!/[^A-Za-z0-9]/.test(pw))
      issues.push("Debe incluir al menos un símbolo.");
    return issues;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    // Validaciones rápidas
    if (!currentPw) return setErr("Ingresa tu contraseña actual.");
    if (!newPw) return setErr("Ingresa la nueva contraseña.");
    if (newPw !== confirmPw) return setErr("La confirmación no coincide.");

    const strength = validatePassword(newPw);
    if (strength.length > 0) {
      setErr(strength[0]); // muestra el 1er problema encontrado
      return;
    }

    setSubmitting(true);
    try {
      const sb = supabase();

      // 1) Re-autenticar para verificar current password
      const { error: reauthError } = await sb.auth.signInWithPassword({
        email,
        password: currentPw,
      });
      if (reauthError) {
        setErr("La contraseña actual es incorrecta.");
        return;
      }
      const { error: updError } = await sb.auth.updateUser({ password: newPw });
      if (updError) {
        setErr(updError.message || "No se pudo actualizar la contraseña.");
        return;
      }
      toast.success("Contraseña actualizada. Vuelve a iniciar sesión.");
      await sb.auth.signOut();
      localStorage.removeItem("role"); // si la usas para el menú
      await fetch("/api/session", { method: "DELETE" }).catch(() => {});
      router.replace("/login");
    } catch (e: any) {
      setErr(e?.message ?? "Ocurrió un error al cambiar la contraseña.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingInit) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="inline-flex items-center gap-2 text-blue-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4 bg-white">
      <div className="relative w-full max-w-md ">
        <div
          aria-hidden
          className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-blue-500 via-blue-400 to-red-400 opacity-70 blur"
        />
        <Card className="relative rounded-3xl border bg-white/90 backdrop-blur shadow-[0_10px_30px_rgba(2,6,23,.25)]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Cambiar contraseña
            </CardTitle>
            <p className="text-center text-sm text-blue-900/70">
              Estás cambiando la clave de{" "}
              <span className="font-medium">{email}</span>
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="current">Contraseña actual</Label>
                <div className="relative">
                  <Input
                    id="current"
                    type={showCur ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    disabled={submitting}
                    className="pr-10 rounded-xl bg-white/70 border-blue-100 shadow-inner focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCur((v) => !v)}
                    className="absolute inset-y-0 right-2 grid place-items-center px-2 text-blue-700/70 hover:text-blue-800"
                    aria-label={showCur ? "Ocultar" : "Mostrar"}
                    disabled={submitting}
                  >
                    {showCur ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new">Nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="new"
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    disabled={submitting}
                    className="pr-10 rounded-xl bg-white/70 border-blue-100 shadow-inner focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute inset-y-0 right-2 grid place-items-center px-2 text-blue-700/70 hover:text-blue-800"
                    aria-label={showNew ? "Ocultar" : "Mostrar"}
                    disabled={submitting}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[11px] text-blue-900/70">
                  Mínimo 8 caracteres, con mayúscula, minúscula, número y
                  símbolo.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirmar nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={showConf ? "text" : "password"}
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    disabled={submitting}
                    className="pr-10 rounded-xl bg-white/70 border-blue-100 shadow-inner focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConf((v) => !v)}
                    className="absolute inset-y-0 right-2 grid place-items-center px-2 text-blue-700/70 hover:text-blue-800"
                    aria-label={showConf ? "Ocultar" : "Mostrar"}
                    disabled={submitting}
                  >
                    {showConf ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {err && <p className="text-sm text-red-600">{err}</p>}

              <Button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 hover:from-blue-800 hover:via-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 text-white"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Guardando…
                  </span>
                ) : (
                  "Cambiar contraseña"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/forgot"
                  className="text-xs text-blue-800 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
