"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Layers,
  Clipboard,
  Users,
  CalendarCheck,
  Settings,
  LogOut,
  ChartColumnBig,
} from "lucide-react";

type Item = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const MENU: Item[] = [
  { title: "Inicio", href: "/dashboard", icon: Home },
  { title: "Agrupaciones", href: "/dashboard/agrupaciones", icon: Layers },
  { title: "Programas", href: "/dashboard/programas", icon: Clipboard },
  { title: "Voluntarios", href: "/dashboard/voluntarios", icon: Users },
  { title: "Eventos", href: "/dashboard/eventos", icon: CalendarCheck },
  { title: "Reportes", href: "/dashboard/reportes", icon: ChartColumnBig },
];

const user = {
  name: "Sebastian",
  lastName: "Daza",
  rol: "Administrador",
};

export function AppSidebar({
  open,
  setOpen,
  onLogout,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onLogout?: () => void;
}) {
  return (
    <>
      {/* Overlay móvil */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        className={[
          "fixed left-0 top-0 z-50 h-screen w-64 text-white border-r border-white/10 backdrop-blur",
          "bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950",
          "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(600px_240px_at_20%_-10%,rgba(59,130,246,.18),transparent_60%),radial-gradient(500px_200px_at_100%_100%,rgba(239,68,68,.10),transparent_60%)]",
          "transition-transform duration-300 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="flex h-full flex-col px-3">
          {/* Encabezado usuario */}
          <div className="relative mt-4 mb-5 rounded-2xl p-[1px] bg-gradient-to-r from-blue-400/25 via-blue-200/15 to-red-300/25">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10 shadow-lg backdrop-blur">
              <span className="grid size-10 place-items-center rounded-full bg-white shadow-md overflow-hidden">
                <Image
                  src="/129560286.jpeg"
                  alt="Foto de perfil"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold leading-tight">
                  {user.name} {user.lastName}
                </p>
                <p className="text-[11px] text-blue-100/80">{user.rol}</p>
              </div>
            </div>
          </div>

          {/* Menú */}
          <nav className="space-y-1">
            {MENU.map((it) => {
              const Icon = it.icon;
              return (
                <Link
                  key={it.title}
                  href={it.href}
                  onClick={() => setOpen(false)} // cerrar al navegar
                  className={[
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2",
                    "transition-all hover:translate-x-[2px]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950",
                    "bg-white/0 hover:bg-white/[.08] active:bg-white/[.12]",
                    "overflow-hidden",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full bg-blue-300/90 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-full w-2/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-300 group-hover:left-0 group-hover:opacity-100"
                  />
                  <span className="grid size-7 place-items-center rounded-lg bg-white/10 ring-1 ring-white/10 shadow-sm transition-colors group-hover:bg-white/15">
                    <Icon className="size-4 text-blue-100/90 transition-colors group-hover:text-white" />
                  </span>
                  <span className="text-[13.5px] font-medium tracking-wide text-blue-100 group-hover:text-white transition-colors">
                    {it.title}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto pb-3">
            <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <Link
              href="#"
              onClick={() => setOpen(false)}
              className="group relative mb-1 flex items-center gap-3 rounded-xl px-3 py-2 transition-all hover:translate-x-[2px] hover:bg-white/10 active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 overflow-hidden"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-white/10 ring-1 ring-white/10 shadow-sm transition-colors group-hover:bg-white/15">
                <Settings className="size-4 text-blue-100/90 group-hover:text-white transition-colors" />
              </span>
              <span className="text-[13.5px] font-medium tracking-wide text-blue-100 group-hover:text-white transition-colors">
                Configuración
              </span>
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all hover:translate-x-[2px] hover:bg-white/10 active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 overflow-hidden"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-white/10 ring-1 ring-white/10 shadow-sm transition-colors group-hover:bg-white/15">
                <LogOut className="size-4 text-red-400 group-hover:text-red-500 transition-colors" />
              </span>
              <span className="text-[13.5px] font-semibold tracking-wide text-red-400 group-hover:text-red-500 transition-colors">
                Cerrar sesión
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
