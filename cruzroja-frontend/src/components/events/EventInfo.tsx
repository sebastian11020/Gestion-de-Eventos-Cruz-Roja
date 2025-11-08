"use client";
import { CalendarDays, MapPin, Users, UserCircle2 } from "lucide-react";
import { parseQty } from "@/utils/eventStatus";
import type { skillQuota } from "@/types/usertType";

export function EventInfo({
  leaderName,
  date,
  city,
  department,
  streetAddress,
  capacity,
  skillQuotas = [],
}: {
  leaderName: string;
  date: string;
  city: string;
  department: string;
  streetAddress: string;
  capacity?: string;
  skillQuotas?: skillQuota[];
}) {
  return (
    <div className="flex flex-col p-4 gap-3 flex-1">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <UserCircle2 className="w-4 h-4 text-blue-600" />
        <span className="font-medium">{leaderName}</span>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-500" />
          <span>{date}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>
            {department} - {city} –{" "}
            <span className="text-gray-700">{streetAddress}</span>
          </span>
        </div>

        {capacity && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">
              Cupo total: <span className="font-medium">{capacity}</span>
            </span>
          </div>
        )}

        {Array.isArray(skillQuotas) && skillQuotas.length > 0 ? (
          <div className="mt-1">
            <span className="block text-xs text-gray-500 mb-1">
              Cupos por habilidad:
            </span>
            <div className="flex flex-wrap gap-2">
              {skillQuotas.map((sq) => (
                <span
                  key={String(sq.id)}
                  className="px-2 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700"
                  title={`${sq.name}: ${parseQty(sq.quantity)} cupos`}
                >
                  {sq.name}{" "}
                  <span className="font-semibold">{parseQty(sq.quantity)}</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <span className="block text-xs text-gray-500 mb-1">
            No se requieren habilidades especiales
          </span>
        )}
      </div>
    </div>
  );
}
