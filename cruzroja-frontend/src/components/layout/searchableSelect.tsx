"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { normalize } from "@/utils/normalize";

type Option = { id: string | number; name: string };

export function SearchableSelect({
                                     value,
                                     options,
                                     onChange,
                                     placeholder = "Seleccione…",
                                     disabled = false,
                                 }: {
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = useMemo(
        () => options.find((o) => String(o.id) === String(value)) || null,
        [options, value],
    );

    useEffect(() => {
        if (!open) setQuery(selected?.name ?? "");
    }, [selected, open]);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery(selected?.name ?? "");
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, [selected]);

    const filtered = useMemo(() => {
        const q = normalize(query);
        if (!q) return options;
        return options.filter((o) => normalize(o.name).includes(q));
    }, [options, query]);

    function selectOption(o: Option) {
        onChange(String(o.id));
        setQuery(o.name);
        setOpen(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
        setOpen(true);
        if (e.target.value === "") onChange("");
    }

    return (
        <div className="relative" ref={containerRef}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => !disabled && setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete="off"
                className="w-full rounded-2xl bg-white px-2 py-2 text-sm focus:outline-none disabled:bg-gray-100"
            />
            {open && !disabled && (
                <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    {filtered.length === 0 && (
                        <li className="px-3 py-1.5 text-sm text-gray-400">Sin resultados</li>
                    )}
                    {filtered.map((o) => (
                        <li
                            key={o.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectOption(o)}
                            className={`cursor-pointer px-3 py-1.5 text-sm hover:bg-blue-50 ${
                                String(o.id) === String(value)
                                    ? "bg-blue-50 font-medium text-blue-700"
                                    : "text-gray-700"
                            }`}
                        >
                            {o.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}