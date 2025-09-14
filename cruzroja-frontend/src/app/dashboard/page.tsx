"use client";
import { Card } from "@/components/layout/InformationCard";
import {
  Users,
  CalendarCheck2,
  HardHat,
  ClipboardList,
  BicepsFlexed,
} from "lucide-react";
import Image from "next/image";
import EventsCalendar, { CalendarEvent } from "@/calendar/EventsCalendar";

export default function Dashboard() {
  const events: CalendarEvent[] = [
    {
      id: "1",
      title: "Jornada de donación",
      start: "2025-09-16T09:00:00",
      end: "2025-09-16T12:00:00",
      color: "#2563eb", // azul
      textColor: "#ffffff",
    },
    {
      id: "2",
      title: "Capacitación primeros auxilios",
      start: "2025-09-18T15:30:00",
      color: "#ef4444", // rojo
      textColor: "#ffffff",
    },
    {
      id: "3",
      title: "Reunión líderes de programa",
      start: "2025-09-20T15:30:00",
      color: "#16a34a", // verde
      textColor: "#ffffff",
    },
  ];
  return (
    <div className="p-4 sm:p-6 lg:p-1 overflow-y-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100">
      {/* Título principal */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight mb-4">
        Dashboard
      </h1>

      {/* Tarjetas */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Usuarios Totales"
          content="215"
          icon={<Users className="size-6" />}
          className="bg-blue-100 text-blue-500"
        />
        <Card
          title="Juan Pablo"
          content="Lider"
          icon={
            <Image
              src="/4792929.png"
              alt="Foto de perfil"
              width={50}
              height={50}
            />
          }
        />
        <Card
          title="Coordinadores de Agrupación"
          content="4"
          icon={<HardHat className="size-6" />}
          className="bg-yellow-100 text-yellow-500"
        />
        <Card
          title="Coordinadores de Programa"
          content="10"
          icon={<ClipboardList className="size-6" />}
          className="bg-amber-100 text-amber-800"
        />
        <Card
          title="Total Voluntarios"
          content="200"
          icon={<BicepsFlexed className="size-6" />}
          className="bg-pink-100 text-pink-500"
        />
        <Card
          title="Eventos Activos"
          content="50"
          icon={<CalendarCheck2 className="size-6" />}
          className="bg-green-100 text-green-500"
        />
      </div>
      <div className="mt-6 sm:mt-8 hidden md:block">
        <EventsCalendar
          events={events}
          initialView="dayGridMonth"
          height={500}
          onEventClick={(arg) => {
            console.log("Evento");
          }}
        />
      </div>
    </div>
  );
}
