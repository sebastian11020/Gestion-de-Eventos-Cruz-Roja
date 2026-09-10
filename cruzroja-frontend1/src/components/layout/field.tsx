export function Field({
  label,
  icon,
  children,
  hint,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div
        className={`mt-1 flex items-center rounded-2xl border bg-white px-3 ${icon ? "pl-2" : ""} focus-within:ring-2 focus-within:ring-blue-500/20`}
      >
        {icon && <span className="pr-2 text-gray-400">{icon}</span>}
        <div className="flex-1">{children}</div>
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
