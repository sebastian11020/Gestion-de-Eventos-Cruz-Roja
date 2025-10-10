import { useEffect, useState } from "react";
import { getGroup, getGroupService } from "@/services/serviceGetGroup";
import { getSectionalService } from "@/services/serviceGetSectional";
import type { group } from "@/types/usertType";
import type { sectional, groups } from "@/types/sectionalType";

export function useGroupsData() {
  const [sectionals, setSectionals] = useState<sectional[]>([]);
  const [groups, setGroups] = useState<group[]>([]);
  const [catalogGroups, setCatalogGroups] = useState<groups[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [groupsData, allGroups, sectionalsData] = await Promise.all([
        getGroupService(),
        getGroup(),
        getSectionalService(),
      ]);
      setGroups(groupsData);
      setCatalogGroups(allGroups);
      setSectionals(sectionalsData);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadAll();
  }, []);
  return { sectionals, groups, catalogGroups, loading, reload: loadAll };
}
