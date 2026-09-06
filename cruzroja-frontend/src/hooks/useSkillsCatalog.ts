import { useEffect, useState } from "react";
import { getSkills } from "@/services/serviceSelect";

export function useSkillsCatalog() {
    const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await getSkills();
                if (active) setSkills(data ?? []);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, []);

    return { skills, loading };
}