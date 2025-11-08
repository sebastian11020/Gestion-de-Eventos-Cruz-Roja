"use client";
import Link from "next/link";
import {
  Home,
  Layers,
  Clipboard,
  Users,
  CalendarCheck,
  Settings,
  LogOut,
  ChartColumnBig,
  Warehouse,
  ChevronDown,
  User as UserIcon,
  KeyRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import { useSideBarData } from "@/hooks/useSideBarData";
import { useEffect, useMemo, useState } from "react";
import { Role } from "@/const/consts";

function normalizeRole(s?: string | null): Role | undefined {
  if (!s) return undefined;
  return s.trim().replace(/\s+/g, " ").toUpperCase() as Role;
}

type Item = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: Role[];
};

const MENU: Item[] = [
  {
    title: "Inicio",
    href: "/dashboard",
    icon: Home,
    allowedRoles: [
      "ADMINISTRADOR",
      "COORDINADOR AGRUPACION",
      "COORDINADOR PROGRAMA",
      "LIDER VOLUNTARIADO",
      "LIDER SEDE",
      "VOLUNTARIO",
    ],
  },
  {
    title: "Sedes",
    href: "/dashboard/sedes",
    icon: Warehouse,
    allowedRoles: ["ADMINISTRADOR", "LIDER VOLUNTARIADO"],
  },
  {
    title: "Agrupaciones",
    href: "/dashboard/agrupaciones",
    icon: Layers,
    allowedRoles: ["ADMINISTRADOR", "LIDER VOLUNTARIADO", "LIDER SEDE"],
  },
  {
    title: "Programas",
    href: "/dashboard/programas",
    icon: Clipboard,
    allowedRoles: [
      "ADMINISTRADOR",
      "LIDER VOLUNTARIADO",
      "LIDER SEDE",
      "COORDINADOR AGRUPACION",
    ],
  },
  {
    title: "Voluntarios",
    href: "/dashboard/voluntarios",
    icon: Users,
    allowedRoles: ["ADMINISTRADOR", "LIDER VOLUNTARIADO", "LIDER SEDE"],
  },
  {
    title: "Eventos",
    href: "/dashboard/eventos",
    icon: CalendarCheck,
    allowedRoles: [
      "ADMINISTRADOR",
      "COORDINADOR AGRUPACION",
      "COORDINADOR PROGRAMA",
      "LIDER VOLUNTARIADO",
      "LIDER SEDE",
      "VOLUNTARIO",
    ],
  },
  {
    title: "Reportes",
    href: "/dashboard/reportes",
    icon: ChartColumnBig,
    allowedRoles: ["ADMINISTRADOR", "LIDER VOLUNTARIADO", "LIDER SEDE"],
  },
];

function firstToken(s?: string) {
  return (s ?? "").trim().split(/\s+/)[0] ?? "";
}
function makeInitials(name?: string, lastName?: string) {
  const a = firstToken(name).charAt(0).toUpperCase();
  const b = firstToken(lastName).charAt(0).toUpperCase();
  return a + b || "CR";
}

export function AppSidebar({
  open,
  setOpen,
  initialRole,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  initialRole: string | null;
}) {
  const { user } = useSideBarData();
  const [openSettings, setOpenSettings] = useState(false);
  const [role, setRole] = useState<Role | undefined>(() =>
    normalizeRole(initialRole),
  );

  useEffect(() => {
    if (user?.role) setRole(normalizeRole(user.role));
    else if (typeof window !== "undefined") {
      const fromLs = localStorage.getItem("role");
      if (fromLs) setRole(normalizeRole(fromLs));
    }
  }, [user?.role]);

  const visibleMenu = useMemo(() => {
    if (!role) return [];
    return MENU.filter((it) => it.allowedRoles.includes(role));
  }, [role]);

  async function handleLogout() {
    const sb = supabase();
    const { error } = await sb.auth.signOut();
    localStorage.removeItem("role");
    await fetch("/api/session", { method: "DELETE" });
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      return false;
    }
    window.location.href = "/login";
  }

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
              <span className="grid size-10 place-items-center rounded-full bg-white text-blue-900 font-bold shadow-md select-none">
                {makeInitials(user?.name, user?.lastName)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold leading-tight">
                  {[firstToken(user?.name), firstToken(user?.lastName)]
                    .filter(Boolean)
                    .join(" ") || "Usuario"}
                </p>
                <p className="text-[11px] text-blue-100/80">{role ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Menú (si no hay rol aún, puedes mostrar skeletons o nada) */}
          <nav className="space-y-1">
            {visibleMenu.map((it) => {
              const Icon = it.icon;
              return (
                <Link
                  key={it.title}
                  href={it.href}
                  onClick={() => setOpen(false)}
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
          {/* Footer */}
          <div className="mt-auto pb-3">
            <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Configuración con submenu */}
            <div className="space-y-1">
              <button
                onClick={() => setOpenSettings((v) => !v)}
                aria-expanded={openSettings}
                aria-controls="submenu-settings"
                className="group relative mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all hover:translate-x-[2px] hover:bg-white/10 active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 overflow-hidden"
              >
                <span className="grid size-7 place-items-center rounded-lg bg-white/10 ring-1 ring-white/10 shadow-sm transition-colors group-hover:bg-white/15">
                  <Settings className="size-4 text-blue-100/90 group-hover:text-white transition-colors" />
                </span>
                <span className="text-[13.5px] font-medium tracking-wide text-blue-100 group-hover:text-white transition-colors">
                  Configuración
                </span>
                <ChevronDown
                  className={`ml-auto size-4 text-blue-200 transition-transform ${
                    openSettings ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>

              {/* Submenu */}
              <div
                id="submenu-settings"
                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${
                  openSettings
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0">
                  <ul className="pl-10 pr-2 py-1 space-y-1">
                    <li>
                      <Link
                        href="/dashboard/person"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <UserIcon className="size-4" />
                        Ver perfil
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard/change-password"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <KeyRound className="size-4" />
                        Cambiar contraseña
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="group relative mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all hover:translate-x-[2px] hover:bg-white/10 active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 overflow-hidden"
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
