"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return toast.error("Ingresa tu correo.");
        setLoading(true);
        try {
            const sb = supabase();
            const { error } = await sb.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset`,
            });
            if (error) throw error;
            toast.success("Si el correo está registrado, te enviamos el enlace.");
        } catch (err: any) {
            toast.error(err?.message ?? "No se pudo enviar el correo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />
            </div>

            {/* Card principal */}
            <form
                onSubmit={onSubmit}
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-md transition-all hover:shadow-blue-200/40"
            >
                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-blue-600/10 text-blue-600 shadow-inner">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Recuperar contraseña
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Ingresa tu correo electrónico y te enviaremos un enlace para
                        restablecerla.
                    </p>
                </div>

                {/* Input correo */}
                <div className="grid gap-2 mb-6">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-slate-700"
                    >
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-9 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            placeholder="tucorreo@dominio.com"
                        />
                    </div>
                    <p className="text-xs text-slate-500">
                        Solo enviaremos el enlace si tu correo está registrado.
                    </p>
                </div>

                {/* Botón */}
                <Button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                    {loading ? (
                        <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando…
            </span>
                    ) : (
                        "Enviar enlace"
                    )}
                </Button>

                {/* Footer */}
                <div className="mt-6 text-center text-sm">
                    <p className="text-slate-500">
                        ¿Recordaste tu contraseña?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-700"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
