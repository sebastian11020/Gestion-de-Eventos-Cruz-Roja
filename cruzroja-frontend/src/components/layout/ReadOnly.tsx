export function ReadOnly({ label, value }: { label: string; value?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 shadow-inner">
        {value ?? "—"}
      </div>
    </label>
  );
}
