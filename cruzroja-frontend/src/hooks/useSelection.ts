import { useMemo, useState } from "react";

export type SelectionApi<T> = {
  isSelected: (item: T) => boolean;
  toggle: (item: T) => void;
  toggleMany: (items: T[]) => void;
  clear: () => void;
  count: () => number;
  items: () => T[];
  select: (item: T) => void;
};

export function useSelection<T>({ keyOf }: { keyOf: (t: T) => string }) {
  const [map, setMap] = useState<Record<string, T>>({});

  function isSelected(item: T) {
    return !!map[keyOf(item)];
  }
  function toggle(item: T) {
    const k = keyOf(item);
    setMap((prev) => {
      const next = { ...prev } as Record<string, T>;
      if (next[k]) delete next[k];
      else next[k] = item;
      return next;
    });
  }
  function toggleMany(items: T[]) {
    const allSelected = items.every((x) => !!map[keyOf(x)]);
    setMap((prev) => {
      const next = { ...prev } as Record<string, T>;
      if (allSelected) {
        for (const x of items) delete next[keyOf(x)];
      } else {
        for (const x of items) next[keyOf(x)] = x;
      }
      return next;
    });
  }
  function select(item: T) {
    const k = keyOf(item);
    setMap((prev) => ({ ...prev, [k]: item }));
  }
  function clear() {
    setMap({});
  }
  function count() {
    return Object.keys(map).length;
  }
  function items() {
    return Object.values(map);
  }

  return useMemo<SelectionApi<T>>(
    () => ({ isSelected, toggle, toggleMany, clear, count, items, select }),
    [map],
  );
}
