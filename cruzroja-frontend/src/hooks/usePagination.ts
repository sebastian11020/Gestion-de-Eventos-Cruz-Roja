import { useMemo, useState } from "react";

export type PaginationApi = {
    page: number;
    pageSize: number;
    totalPages: number;
    showingFrom: number;
    showingTo: number;
    setPageSize: (n: number) => void;
    goTo: (p: number) => void;
    slice: <T>(rows: T[]) => T[];
};

export function buildPageList(totalPages: number, current: number, maxButtons = 7) {
    if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [];
    const side = Math.floor((maxButtons - 3) / 2);
    const left = Math.max(2, current - side);
    const right = Math.min(totalPages - 1, current + side);
    pages.push(1);
    if (left > 2) pages.push("...");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
}

export function usePagination(total: number, initialPageSize = 10): PaginationApi {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);

    const showingFrom = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const showingTo = Math.min(safePage * pageSize, total);

    function goTo(p: number) {
        setPage(Math.min(Math.max(1, p), totalPages));
    }

    function slice<T>(rows: T[]) {
        const start = (safePage - 1) * pageSize;
        const end = start + pageSize;
        return rows.slice(start, end);
    }

    return useMemo(
        () => ({ page: safePage, pageSize, totalPages, showingFrom, showingTo, setPageSize, goTo, slice }),
        [safePage, pageSize, totalPages, showingFrom, showingTo]
    );
}