"use client";
import { useEffect, useMemo, useState } from "react";
import { HoursModal } from "@/components/reports/HoursModal";
import { VolunteersTable } from "@/components/reports/volunteersTable";
import { InactiveTable } from "@/components/reports/inactiveTable";
import { usePersonData } from "@/hooks/usePersonData";
import { useSelection } from "@/hooks/useSelection";
import { usePagination } from "@/hooks/usePagination";
import { buildInactivityPdf } from "@/utils/pdf/inactivity";
import { buildUnlinkingPdf } from "@/utils/pdf/unlinking";
import { formatFechaLarga } from "@/utils/date";
import type { groupReport } from "@/types/reportType";

export type Volunteer = groupReport["groups"][number]["volunteers"][number];
export type InactiveItem = {
  document: string;
  name: string;
  license: string;
  Inactivation_date: string;
};

const LS_KEY_VOL = "cr_report_selected";
const LS_KEY_INA = "cr_inactive_selected";

export default function ReportesPage() {
  const { groups, loading, unlinked } = usePersonData();

  const rowsVol: Volunteer[] = useMemo(
    () => (groups ?? []).flatMap((g) => g.volunteers ?? []),
    [groups],
  );
  const docToGroup = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of groups ?? []) {
      for (const v of g.volunteers ?? []) {
        if (v?.document) map.set(v.document, g.name ?? "OTROS");
      }
    }
    return map;
  }, [groups]);

  // ---- selección (tabla 1)
  const selVol = useSelection<Volunteer>({ keyOf: (v) => v.document });

  useEffect(() => {
    // restaurar selección desde LS
    try {
      const raw = localStorage.getItem(LS_KEY_VOL);
      if (raw) JSON.parse(raw).forEach((v: Volunteer) => selVol.select(v));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- notas (tabla 1)
  const [notes, setNotes] = useState<Record<string, string>>({});

  // ---- paginación (tabla 1)
  const pagVol = usePagination(rowsVol.length, 10);
  const pageSliceVol = useMemo(
    () => pagVol.slice(rowsVol),
    [rowsVol, pagVol.page, pagVol.pageSize],
  );

  // ---- modal horas
  const [openHoursFor, setOpenHoursFor] = useState<Volunteer | null>(null);

  // ---- acciones (tabla 1)
  async function handlePdfVol() {
    const selected = selVol.items();
    if (selected.length === 0) return;
    await buildInactivityPdf({
      people: selected,
      docToGroup,
      groupsOrder: (groups ?? []).map((g) => g.name ?? "OTROS"),
      notes,
      numero: "DSV N° 03 - 2025",
      ciudadFecha: `Tunja, ${formatFechaLarga()}`,
    });
  }
  const selIna = useSelection<InactiveItem>({ keyOf: (x) => x.document });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY_INA);
      if (raw) JSON.parse(raw).forEach((it: InactiveItem) => selIna.select(it));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [notesIna, setNotesIna] = useState<Record<string, string>>({});

  const pagIna = usePagination(unlinked.length, 10);
  const pageSliceIna = useMemo(
    () => pagIna.slice(unlinked),
    [unlinked, pagIna.page, pagIna.pageSize],
  );

  async function handlePdfIna() {
    const selected = selIna.items();
    if (selected.length === 0) return;
    await buildUnlinkingPdf({
      people: selected,
      notes: notesIna,
      numero: "DSV N° 04 - 2025",
      ciudadFecha: `Tunja, ${formatFechaLarga()}`,
    });
    localStorage.setItem(LS_KEY_INA, JSON.stringify(selected));
  }

  return (
    <div className="p-6 space-y-10">
      {/* Sección 1 */}
      <VolunteersTable
        loading={loading}
        total={rowsVol.length}
        pageSlice={pageSliceVol}
        pagination={pagVol}
        selection={selVol}
        notes={notes}
        setNotes={setNotes}
        onOpenHours={setOpenHoursFor}
        onGeneratePdf={handlePdfVol}
      />

      <HoursModal
        volunteer={openHoursFor}
        onClose={() => setOpenHoursFor(null)}
      />

      {/* Sección 2 */}
      <InactiveTable
        total={unlinked.length}
        pageSlice={pageSliceIna}
        pagination={pagIna}
        selection={selIna}
        notes={notesIna}
        setNotes={setNotesIna}
        onGeneratePdf={handlePdfIna}
      />
    </div>
  );
}
