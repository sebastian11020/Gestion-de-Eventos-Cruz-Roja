import { useEffect, useState } from "react";
import { getDepartments } from "@/services/serviceSelect";
import type { Department } from "@/types/sedesType";

export function useDepartments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await getDepartments();
                if (active) setDepartments(data ?? []);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    return { departments, loading };
}