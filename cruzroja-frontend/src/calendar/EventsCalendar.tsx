"use client";

import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";

export type CalendarEvent = {
  id?: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  allDay?: boolean;
  color?: string;
  textColor?: string;
  extendedProps?: Record<string, any>;
};

type EventsCalendarProps = {
  events: CalendarEvent[];
  height?: string | number;
  initialView?: "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek";
  onEventClick?: (arg: EventClickArg) => void;
};

export default function EventsCalendar({
  events,
  height = 600,
  initialView = "dayGridMonth",
  onEventClick,
}: EventsCalendarProps) {
  return (
    <div className="rounded-xl bg-white shadow-md p-3 md:p-4 ring-1 ring-black/5">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        locale={esLocale}
        initialView={initialView}
        height={height}
        expandRows
        stickyHeaderDates
        dayMaxEvents
        selectable
        navLinks
        nowIndicator
        slotDuration="00:30:00"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        firstDay={1}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        buttonText={{
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          list: "Lista",
        }}
        titleFormat={{ year: "numeric", month: "long" }}
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        moreLinkClick="popover"
        events={events}
        eventClick={onEventClick}
        eventDisplay="block"
        eventContent={renderEvent}
      />

      <style jsx global>{`
        /* ===== Toolbar ===== */
        .fc .fc-toolbar {
          gap: 0.5rem;
        }
        .fc .fc-toolbar-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1f2937; /* gray-800 */
        }
        .fc .fc-toolbar.fc-header-toolbar {
          background: white;
          border-radius: 0.75rem;
          padding: 0.6rem 0.8rem;
          margin-bottom: 0.8rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        /* ===== Botones (rojos) ===== */
        .fc .fc-button {
          border-radius: 0.5rem;
          border: 1px solid rgba(220, 38, 38, 0.2);
          background: #fff;
          color: #dc2626;
          font-weight: 600;
          padding: 0.35rem 0.65rem;
          transition: all 0.15s ease;
        }
        .fc .fc-button:hover {
          background: #fee2e2;
        }
        .fc .fc-button.fc-button-primary {
          background: #dc2626; /* red-600 */
          border-color: #dc2626;
          color: white;
        }
        .fc .fc-button.fc-button-primary:hover {
          background: #b91c1c; /* red-700 */
        }

        /* ===== Cabeceras ===== */
        .fc .fc-col-header-cell {
          background: #f9fafb;
          border: 0;
        }
        .fc .fc-col-header-cell-cushion {
          padding: 0.6rem 0;
          color: #374151;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.7rem;
        }

        /* ===== Celdas ===== */
        .fc .fc-daygrid-day {
          transition: background 0.12s ease;
        }
        .fc .fc-daygrid-day:hover {
          background: #f3f4f6; /* gray-100 */
        }
        .fc .fc-daygrid-day.fc-day-today {
          background: #fee2e2; /* red-100 */
        }
        .fc .fc-daygrid-day-number {
          color: #374151;
          font-weight: 600;
        }
        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          color: #b91c1c;
        }

        /* ===== Eventos ===== */
        .fc .fc-event {
          border: 0;
          border-radius: 0.6rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
          padding: 0.25rem 0.4rem;
          cursor: default !important;
        }
        .fc .fc-event:hover {
          filter: brightness(0.97);
          transform: translateY(-1px);
        }

        /* ===== Popover ===== */
        .fc .fc-more-popover {
          border-radius: 0.75rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}

/** Render custom event pill */
function renderEvent(arg: EventContentArg) {
  const { timeText, event } = arg;
  const color = (event.backgroundColor ||
    event.extendedProps?.color ||
    "#dc2626") as string;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#1f2937",
            lineHeight: 1.2,
            display: "flex",
            alignItems: "center",
            gap: 4,
            minWidth: 0,
          }}
        >
          {timeText && (
            <span style={{ opacity: 0.7, flexShrink: 0 }}>{timeText}</span>
          )}
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1, // se adapta al espacio
            }}
            title={event.title} // tooltip al pasar el mouse
          >
            {event.title}
          </span>
        </div>
      </div>
    </div>
  );
}
