"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (value: string) => void;
};

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };
  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      {/* Icono */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Botón (opcional, se puede ocultar si quieres solo enter) */}
      <button type="submit" className="hidden">
        Buscar
      </button>
    </form>
  );
}
