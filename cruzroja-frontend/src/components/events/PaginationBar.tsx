"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationBar({
                                  loading,
                                  page,
                                  totalPages,
                                  showingFrom,
                                  showingTo,
                                  total,
                                  onPrev,
                                  onNext,
                              }: {
    loading: boolean;
    page: number;
    totalPages: number;
    showingFrom: number;
    showingTo: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div className="mt-2 flex items-center justify-between">
      <span className="text-sm text-gray-600">
        {loading ? "Cargando eventos…" : `Mostrando ${showingFrom}–${showingTo} de ${total}`}
      </span>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl"
                    onClick={onPrev}
                    disabled={loading || page === 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                </Button>
                <span className="text-sm text-gray-700">
          Página {page} de {totalPages}
        </span>
                <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl"
                    onClick={onNext}
                    disabled={loading || page === totalPages}
                >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
