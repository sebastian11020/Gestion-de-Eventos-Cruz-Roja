// src/hooks/useSedesData.ts
import { useEffect, useState } from "react";
import { getCities } from "@/services/serviceSelect";
import { getSectionalService } from "@/services/serviceGetSectional";
import type { sectional } from "@/types/usertType";
import type { City } from "@/types/sedesType";

export function useSedesData() {
  const [cities, setCities] = useState<City[]>([]);
  const [sectionals, setSectionals] = useState<sectional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [citiesData, sectionalsData] = await Promise.all([
        getCities(),
        getSectionalService(),
      ]);
      setCities(citiesData);
      setSectionals(sectionalsData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return { cities, sectionals, loading, reload: loadAll };
}
