import { useEffect, useMemo, useState } from "react";

export function usePaginatedSearch<T>({
  data,
  query,
  pageSize,
  filterFn,
}: {
  data: T[];
  query: string;
  pageSize: number;
  filterFn: (item: T, q: string) => boolean;
}) {
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query;
    if (!q) return data;
    return data.filter((item) => filterFn(item, q));
  }, [data, query, filterFn]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  const paged = useMemo(
    () => filtered.slice(start, end),
    [filtered, start, end],
  );
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return {
    page,
    setPage,
    filtered,
    paged,
    total,
    totalPages,
    start,
    end,
    canPrev,
    canNext,
  };
}
