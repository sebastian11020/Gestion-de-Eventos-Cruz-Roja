// app/403/page.tsx
import Link from "next/link";
import { ShieldAlert, LogIn, LayoutDashboard } from "lucide-react";
// Si usas shadcn/ui:
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Acceso denegado | 403",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-black">
      {/* halo */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-violet-500/20 to-indigo-500/20 blur-3xl dark:from-fuchsia-600/15 dark:via-violet-600/15 dark:to-indigo-600/15" />

      <section className="relative z-10 grid min-h-screen place-items-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-gray-200/60 bg-white/70 p-7 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div className="mt-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-gray-300">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                Código: 403 · Acceso denegado
              </div>
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              No tienes permisos para ver esta página
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Si crees que esto es un error, contacta al administrador o intenta
              con otra cuenta.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                <LayoutDashboard className="h-4 w-4" />
                Ir al dashboard
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-black"
              >
                <LogIn className="h-4 w-4" />
                Cambiar de cuenta
              </Link>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Tip: si acabas de recibir permisos, refresca la página o vuelve
                a iniciar sesión.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
