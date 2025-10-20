// src/components/ui/loading.tsx
"use client";

type Size = "sm" | "md" | "lg" | "xl";
const sizeMap: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

export function Loading({
  size = "md",
  label = "Cargando…",
  className = "",
  minHeight = "min-h-[200px]", // asegura espacio visible
}: {
  size?: Size;
  label?: string;
  className?: string;
  /** Ajusta la altura mínima del contenedor (flex center) */
  minHeight?: string;
}) {
  const dim = sizeMap[size];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex items-center justify-center ${minHeight} ${className}`}
    >
      <span className="inline-flex flex-col items-center gap-3 text-gray-700">
        {/* ruedita moderna */}
        <span className={`relative inline-block ${dim}`}>
          {/* pista suave */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-black/5 to-black/0 dark:from-white/10 dark:to-white/0" />
          {/* aro girando usando currentColor */}
          <span
            className="absolute inset-0 animate-spin rounded-full
                           after:absolute after:inset-0 after:rounded-full
                           after:border-4 after:border-transparent
                           after:border-t-current after:border-r-current/40"
          />
        </span>
        <span className="text-sm opacity-80">{label}</span>
      </span>
    </div>
  );
}
