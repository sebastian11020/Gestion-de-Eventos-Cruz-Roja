"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { getPersonData } from "@/services/serviceGetPerson";
import { user } from "@/types/usertType";
import { usePageTitle } from "@/hooks/usePageTittle";

export default function LoginCR() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    usePageTitle("Login");

    async function login(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErr(null);

        try {
            const sb = supabase();
            const { data, error } = await sb.auth.signInWithPassword({
                email: loginData.email,
                password: loginData.password,
            });

            if (error) throw error;

            const id = data.user?.id;
            if (!id) throw new Error("No se pudo obtener el usuario.");
            localStorage.setItem("supabase_uid", id);

            const userData: user = await getPersonData(id);

            await fetch("/api/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
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
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">

            {/* Fondo */}
            <Image
                src="/Fondo_Login.png"
                alt="Background"
                fill
                priority
                className="object-cover"
            />

            {/* CONTENIDO */}
            <div className="relative w-full max-w-md">

                {/* Borde Glow externo */}
                <div
                    aria-hidden
                    className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r
            from-blue-500 via-blue-400 to-red-400
            opacity-60 blur"
                />

                {/* TARJETA GLASSMORPHISM */}
                <Card
                    className="
            relative rounded-3xl border
            bg-white/40           /* transparencia del vidrio */
            backdrop-blur-2xl     /* difumina el fondo */
            shadow-[0_10px_30px_rgba(2,6,23,.25)]
            transition-transform duration-300 hover:scale-[1.01]
          "
                >
                    <CardHeader className="space-y-4 pb-2">
                        <div className="flex items-center justify-center gap-3">
                            <div className="size-12 rounded-2xl bg-white/70 backdrop-blur-sm grid place-items-center shadow ring-1 ring-blue-200 overflow-hidden">
                                <Image
                                    src="/Emblema_Cruz_Roja.jpg"
                                    alt="Logo Cruz Roja"
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            <div className="text-center">
                                <p className="text-sm font-medium text-blue-900/90">
                                    Cruz Roja Colombiana-Seccional Boyacá
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <CardTitle className="text-xl font-semibold tracking-tight">
                                Iniciar sesión
                            </CardTitle>
                        </div>

                        <p className="text-center text-sm text-blue-900/80">
                            📚 Accede para llevar un mejor control de tu record de voluntariado ⛑️.
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-0">
                        <form onSubmit={login} className="space-y-6">

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-blue-900">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={loginData.email}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, email: e.target.value })
                                    }
                                    disabled={loading}
                                    className="
                    pr-3 rounded-xl bg-white/60
                    border-blue-100 shadow-inner
                    backdrop-blur-sm
                    focus-visible:ring-2 focus-visible:ring-blue-600
                    focus-visible:ring-offset-2 transition-all
                  "
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
                                        placeholder="Tu contraseña"
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData({ ...loginData, password: e.target.value })
                                        }
                                        disabled={loading}
                                        className="
                      pr-10 rounded-xl bg-white/60
                      border-blue-100 shadow-inner
                      backdrop-blur-sm
                      focus-visible:ring-2 focus-visible:ring-blue-600
                      focus-visible:ring-offset-2 transition-all
                    "
                                    />

                                    <button
                                        type="button"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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

                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                            <span className="text-xs text-blue-900/70">o</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                        </div>

                        <p className="text-[11px] text-center text-blue-900/80">
                            Uso interno institucional. Si necesitas ayuda, contacta al administrador.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
