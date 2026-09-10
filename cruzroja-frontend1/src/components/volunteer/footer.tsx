"use client";

export function Footer({
  step,
  stepsLen,
  canNext,
  onClose,
  onReset,
  onPrev,
  onNext,
  onSubmit,
}: {
  step: number;
  stepsLen: number;
  canNext: boolean;
  onClose: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 bg-gray-50 px-6 py-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          type="button"
          className="rounded-lg  px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600"
        >
          Cancelar
        </button>
        <button
          onClick={onReset}
          type="button"
          className="rounded-lg  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Limpiar
        </button>
      </div>
      <div className="flex items-center gap-2">
        {step > 0 && (
          <button
            onClick={onPrev}
            type="button"
            className="rounded-lg  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Anterior
          </button>
        )}
        {step < stepsLen - 1 ? (
          <button
            onClick={onNext}
            type="button"
            disabled={!canNext}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={onSubmit}
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Guardar
          </button>
        )}
      </div>
    </div>
  );
}
