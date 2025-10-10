import { useState, useEffect } from "react";
import { getSectionalInfo } from "@/services/serviceCreateSectional";
import { getProgramService } from "@/services/serviceCreateProgram";
import type { program } from "@/types/usertType";
import type { SectionalNode } from "@/types/programType";

export function useProgramsData() {
  const [items, setItems] = useState<program[]>([]);
  const [sectionals, setSectionals] = useState<SectionalNode[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [programsData, sectionalsData] = await Promise.all([
        getProgramService(),
        getSectionalInfo(),
      ]);
      setItems(programsData);
      setSectionals(sectionalsData);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadAll();
  }, []);
  return { items, sectionals, loading, reload: loadAll };
}
