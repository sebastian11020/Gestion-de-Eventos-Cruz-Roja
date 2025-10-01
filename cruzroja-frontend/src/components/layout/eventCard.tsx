"use client";

import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

type EventCardProps = {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: string;
  showSuscribe: boolean;
  onSubscribe: () => void;
  onViewEnrolled: () => void;
};

export function EventCard({
  title,
  description,
  date,
  location,
  capacity,
  showSuscribe,
  onSubscribe,
  onViewEnrolled,
}: EventCardProps) {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
      {/* Contenido */}
      <div className="flex flex-col p-4 gap-3 flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>

        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          {capacity && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Cupo: {capacity}</span>
            </div>
          )}
        </div>

        {/* 🔹 Botones de acción */}
        <div className="mt-auto flex flex-col gap-2">
          {showSuscribe && (
            <Button
              onClick={onSubscribe}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Inscribirme
            </Button>
          )}
          <Button
            onClick={onViewEnrolled}
            variant="outline"
            className="w-full rounded-xl"
          >
            Ver inscritos
          </Button>
        </div>
      </div>
    </div>
  );
}
