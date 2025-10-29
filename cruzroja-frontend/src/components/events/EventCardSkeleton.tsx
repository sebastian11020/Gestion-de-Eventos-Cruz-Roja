"use client";

export function EventCardSkeleton() {
    return (
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
            <div className="h-4 w-24 rounded bg-gray-200 mb-3" />
            <div className="h-5 w-3/4 rounded bg-gray-200 mb-2" />
            <div className="h-4 w-1/2 rounded bg-gray-200 mb-4" />
            <div className="h-3 w-full rounded bg-gray-200 mb-2" />
            <div className="h-3 w-5/6 rounded bg-gray-200 mb-2" />
            <div className="h-3 w-4/6 rounded bg-gray-200 mb-6" />
            <div className="flex gap-2">
                <div className="h-9 w-24 rounded-xl bg-gray-200" />
                <div className="h-9 w-28 rounded-xl bg-gray-200" />
            </div>
        </div>
    );
}
