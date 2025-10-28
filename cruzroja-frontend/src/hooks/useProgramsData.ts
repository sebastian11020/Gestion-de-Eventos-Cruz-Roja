import { useState, useEffect } from "react";
import { getSectionalCreate } from "@/services/serviceCreateSectional";
import { getProgramService } from "@/services/serviceCreateProgram";
import type { leaderDataTable, program } from "@/types/usertType";
import type { SectionalNode } from "@/types/programType";
import { getPersonTable } from "@/services/serviceGetPerson";

export function useProgramsData() {
  const [items, setItems] = useState<program[]>([]);
  const [sectionals, setSectionals] = useState<SectionalNode[]>([]);
  const [users, setUsers] = useState<leaderDataTable[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [programsData, sectionalsData, usersData] = await Promise.all([
        getProgramService(),
        getSectionalCreate(),
        getPersonTable(),
      ]);
      setItems(programsData);
      setSectionals(sectionalsData);
      setUsers(usersData);
      console.log(programsData);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadAll();
  }, []);
  return { items, sectionals, users, loading, reload: loadAll };
}
