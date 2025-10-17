// src/hooks/useSedesData.ts
import { useEffect, useState } from "react";
import { getCities } from "@/services/serviceSelect";
import { getSectionalService } from "@/services/serviceGetSectional";
import type { group, leaderDataTable, sectional } from "@/types/usertType";
import type { City } from "@/types/sedesType";
import { getPersonTable } from "@/services/serviceGetPerson";
import { getGroup } from "@/services/serviceGetGroup";

export function useSedesData() {
  const [cities, setCities] = useState<City[]>([]);
  const [sectionals, setSectionals] = useState<sectional[]>([]);
  const [groups, setGroups] = useState<group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<leaderDataTable[]>([]);

  async function loadAll() {
    setLoading(true);
    try {
      const [citiesData, sectionalsData, groupsData, usersData] =
        await Promise.all([
          getCities(),
          getSectionalService(),
          getGroup(),
          getPersonTable(),
        ]);
      setCities(citiesData);
      setSectionals(sectionalsData);
      setUsers(usersData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return { cities, sectionals, loading, users, reload: loadAll };
}
