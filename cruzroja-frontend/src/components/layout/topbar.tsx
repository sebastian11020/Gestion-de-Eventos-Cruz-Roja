"use client";

import Image from "next/image";
import { Bell, CheckCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useSideBarData } from "@/hooks/useSideBarData";
import { readNotifications } from "@/services/serviceSelect";

type Props = {
  onOpenSidebar?: () => void;
};

export function Topbar({ onOpenSidebar }: Props) {
  const [open, setOpen] = useState(false);
  const { notifications } = useSideBarData();
  const [items, setItems] = useState(notifications);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                panelRef.current &&
                !panelRef.current.contains(target) &&
                bellRef.current &&
                !bellRef.current.contains(target)
            ) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);


  const count = items.length;

  async function handleReadOne(id: string) {
    try {
      await readNotifications([id]);
      setItems((prev) => prev.filter((n) => n.id !== id));
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleReadAll() {
    const ids = items.map((n) => n.id);
    if (!ids.length) return;
    try {
      await readNotifications(ids);
      setItems([]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-lg backdrop-blur">
      <div className="mx-auto flex h-12 md:h-14 items-center px-3 sm:px-6 lg:px-8 gap-3">
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={onOpenSidebar}
          className="md:hidden inline-flex items-center gap-2 rounded-xl bg-white px-2.5 py-2 active:scale-[.98] transition"
        >
          {/* Imagen para móviles */}
          <span className="grid size-6 place-items-center rounded-md overflow-hidden">
            <Image
              src="/logo-cruzroja.png"
              alt="Logo Cruz Roja"
              width={24}
              height={24}
              className="object-contain"
            />
          </span>
          <span className="text-sm font-semibold text-gray-900">Dashboard</span>
        </button>

        {/* Desktop: marca */}
        <div className="hidden md:flex items-center gap-3">
          <div className="grid size-9 place-items-center bg-white shadow ring-1 ring-red-200 rounded-md overflow-hidden">
            <Image
              src="/Emblema_Cruz_Roja.jpg"
              alt="Logo Cruz Roja"
              width={38}
              height={38}
              className="object-contain"
            />
          </div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Cruz Roja Colombiana
          </h1>
        </div>

        {/* Derecha */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto relative">
          <div className="hidden sm:flex items-center gap-2">
            <Image
              src="/Flag_of_Boyacá_Department.png"
              width={28}
              height={28}
              alt="Bandera de Boyacá"
              className="rounded-sm shadow-sm"
            />
            <h2 className="text-base md:text-lg font-bold text-gray-900 tracking-tight">
              Seccional Boyacá
            </h2>
          </div>

          {/* Campana */}
          <button
            ref={bellRef}
            type="button"
            aria-label="Notificaciones"
            onClick={() => setOpen((v) => !v)}
            className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 transition"
          >
            <Bell className="size-5" />
            {count > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                {count}
              </span>
            )}
          </button>

          {/* Panel notificaciones */}
          {open && (
            <div className="absolute right-0 top-12 w-[22rem]">
              <div className="rounded-xl p-[1px] bg-gradient-to-r from-blue-400/25 via-blue-200/15 to-red-300/25 shadow-xl">
                <div
                  ref={panelRef}
                  className="rounded-xl bg-white ring-1 ring-black/5 overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-white to-slate-50">
                    <div className="inline-flex items-center gap-2">
                      <span className="grid size-6 place-items-center rounded-md bg-red-50 text-red-600 ring-1 ring-red-100">
                        <Bell className="size-3.5" />
                      </span>
                      <h3 className="text-sm font-semibold text-gray-800">
                        Notificaciones
                      </h3>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <button
                        onClick={handleReadAll}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                      >
                        <CheckCheck className="size-3.5" />
                        Leer todo
                      </button>
                    </div>
                  </div>

                  {/* Lista de notificaciones */}
                  <div className="max-h-72 overflow-auto">
                    {count === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                        <div className="grid size-12 place-items-center rounded-full bg-slate-100">
                          <Bell className="size-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-800">
                          No tienes notificaciones
                        </p>
                        <p className="text-xs text-slate-500">
                          Cuando haya novedades, aparecerán aquí.
                        </p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {items.map((n) => (
                          <li key={n.id}>
                            <button
                              className="group w-full text-left px-4 py-3 hover:bg-slate-50 transition"
                              onClick={() => handleReadOne(n.id)}
                            >
                              <div className="flex items-start gap-3">
                                <span className="mt-1.5 size-2.5 rounded-full bg-blue-500/80 group-hover:bg-blue-600" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[13.5px] text-slate-800">
                                    {n.description}
                                  </p>
                                  <p className="mt-1 text-[11px] text-slate-500">
                                    hace un momento
                                  </p>
                                </div>
                                <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                                  Nuevo
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-2 right-7 h-2 w-2 rotate-45 bg-white shadow-md ring-1 ring-black/5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
