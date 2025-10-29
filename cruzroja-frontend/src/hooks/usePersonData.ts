import { useState, useEffect } from "react";
import type { FormState } from "@/types/usertType";
import { getPerson } from "@/services/serviceGetPerson";
import { groupReport } from "@/types/reportType";
import { getReportDesvinculate } from "@/services/serviceSelect";

function normalizeGroups(input: unknown): groupReport["groups"] {
    if (!input) return [];

    if (typeof input === "object" && Array.isArray((input as any).groups)) {
        return (input as groupReport).groups ?? [];
    }
    if (Array.isArray(input)) {
        const merged: groupReport["groups"] = [];
        for (const item of input as any[]) {
            if (item && Array.isArray(item.groups)) {
                merged.push(...item.groups);
            }
        }
        return merged;
    }

    return [];
}

export function usePersonData() {
    const [users, setUsers] = useState<FormState[]>([]);
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<groupReport["groups"]>([]);

    async function loadAll() {
        setLoading(true);
        try {
            const [usersData, groupsData] = await Promise.all([getPerson(), getReportDesvinculate()]);
            setUsers(usersData ?? []);
            const normalized = normalizeGroups(groupsData);
            setGroups(normalized);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    return { users, groups, loading, reload: loadAll };
}
