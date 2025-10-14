"use client";
export function Progress({ progress }: { progress: number }) {
  return (
    <div className="px-6 pt-4">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-600">
        <span>Progreso</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
