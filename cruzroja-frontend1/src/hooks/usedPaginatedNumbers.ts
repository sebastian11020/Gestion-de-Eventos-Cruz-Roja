import { useMemo } from "react";

export function usePageNumbers(
  page: number,
  totalPages: number,
  maxButtons = 5,
) {
  return useMemo(() => {
    if (totalPages <= maxButtons)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const half = Math.floor(maxButtons / 2);
    let from = Math.max(1, page - half);
    let to = Math.min(totalPages, from + maxButtons - 1);

    if (to - from + 1 < maxButtons) from = Math.max(1, to - maxButtons + 1);
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [page, totalPages, maxButtons]);
}
