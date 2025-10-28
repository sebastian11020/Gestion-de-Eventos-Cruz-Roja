"use client";
export function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold tracking-tight text-gray-800">
        {title}
      </h2>
    </div>
  );
}
