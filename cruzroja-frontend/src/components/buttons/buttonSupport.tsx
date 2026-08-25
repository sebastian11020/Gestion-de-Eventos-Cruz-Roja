"use client";

import { Bug } from "lucide-react";
import { useState } from "react";
import ReportErrorModal from "./ReportErrorModal";

export default function ReportErrorButton() {
 const [open, setOpen] = useState(false);

 return (
     <>
      <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all hover:translate-x-[2px] hover:bg-white/10 active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950 overflow-hidden"
      >
       {/* Línea decorativa */}
       <span
           aria-hidden
           className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-red-400/90 opacity-0 transition-opacity group-hover:opacity-100"
       />

       {/* Efecto de brillo */}
       <span
           aria-hidden
           className="pointer-events-none absolute inset-y-0 -left-full w-2/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-300 group-hover:left-0 group-hover:opacity-100"
       />

       {/* Icono */}
       <span className="grid size-7 place-items-center rounded-lg bg-white/10 ring-1 ring-white/10 shadow-sm transition-colors group-hover:bg-white/15">
          <Bug className="size-4 text-red-300 transition-colors group-hover:text-red-200" />
        </span>

       {/* Texto */}
       <span className="text-[13.5px] font-medium tracking-wide text-blue-100 transition-colors group-hover:text-white">
          Reportar un error
        </span>
      </button>

      <ReportErrorModal
          open={open}
          onClose={() => setOpen(false)}
      />
     </>
 );
}