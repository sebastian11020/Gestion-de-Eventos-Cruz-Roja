export function DL({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-1 gap-2 text-sm text-gray-700">
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-3 gap-2">
          <dt className="col-span-1 text-gray-500">{label}</dt>
          <dd className="col-span-2 font-medium">{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
