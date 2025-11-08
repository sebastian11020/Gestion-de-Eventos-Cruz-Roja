export function normalize(s?: string) {
  return (s ?? "").trim().toUpperCase();
}

export function getFlags(state?: string) {
  const status = normalize(state);
  const isOngoing = ["EN CURSO", "EN_CURSO", "ONGOING", "IN_PROGRESS"].includes(
    status,
  );
  const isFinished = ["FINALIZADO", "FINALIZED"].includes(status);
  const isCanceled = ["CANCELADO", "CANCELED", "CANCELLED"].includes(status);
  return { status, isOngoing, isFinished, isCanceled };
}

export function getStatusStyle(flags: ReturnType<typeof getFlags>) {
  const { isOngoing, isFinished, isCanceled } = flags;
  if (isOngoing) return "bg-amber-100 text-amber-800 ring-amber-300";
  if (isFinished) return "bg-emerald-100 text-emerald-800 ring-emerald-300";
  if (isCanceled) return "bg-red-100 text-red-800 ring-red-300";
  return "bg-blue-100 text-blue-800 ring-blue-300";
}

export function parseQty(q: number | string) {
  const n = typeof q === "string" ? parseInt(q, 10) : q;
  return Number.isFinite(n) ? n : 0;
}
