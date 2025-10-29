"use client";
import React from "react";
import { getFlags, getStatusStyle } from "@/utils/eventStatus";

export function EventStatusBadge({ state }: { state: string }) {
    const flags = getFlags(state);
    const cls = getStatusStyle(flags);
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}
            title={`Estado: ${state}`}
        >
      {state}
    </span>
    );
}
