import { useState, useEffect } from "react";
import type { desvinculate, FormState } from "@/types/usertType";
import { getPerson } from "@/services/serviceGetPerson";
import { groupReport } from "@/types/reportType";
import {
  getReportDesvinculate,
  getReportInactivate,
} from "@/services/serviceSelect";

function normalizeGroups(input: unknown): groupReport["groups"] {
  if (!input) return [];
  if (
    Array.isArray(input) &&
    input.every((it) => it && Array.isArray((it as any).volunteers))
  ) {
    return input as groupReport["groups"];
  }
  if (typeof input === "object" && Array.isArray((input as any).volunteers)) {
    return [input as any];
  }
  if (typeof input === "object" && Array.isArray((input as any).groups)) {
    return (input as any).groups ?? [];
  }
  if (Array.isArray(input)) {
    const merged: groupReport["groups"] = [];
    for (const item of input as any[]) {
      if (item && Array.isArray(item.groups)) {
        merged.push(...item.groups);
      }
    }
    if (merged.length) return merged;
  }

  return [];
}

export function usePersonData() {
  const [users, setUsers] = useState<FormState[]>([]);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<groupReport["groups"]>([]);
  const [unlinked, setUnlinked] = useState<desvinculate[]>([]);

  async function loadAll() {
    setLoading(true);
    try {
      const [usersData, groupsData, inactivateData] = await Promise.all([
        getPerson(),
        getReportDesvinculate(),
        getReportInactivate(),
      ]);
      setUsers(usersData ?? []);
      const normalized = normalizeGroups(groupsData);
      setGroups(normalized);
      setUnlinked(inactivateData);
      console.log(inactivateData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return { users, groups, unlinked, loading, reload: loadAll };
}
