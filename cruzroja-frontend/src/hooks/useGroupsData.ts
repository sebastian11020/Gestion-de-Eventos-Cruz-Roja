import { useEffect, useState } from "react";
import { getGroup, getGroupService } from "@/services/serviceGetGroup";
import { getSectionalService } from "@/services/serviceGetSectional";
import type { group, leaderDataTable } from "@/types/usertType";
import type { sectional, groups } from "@/types/sectionalType";
import { getPersonTable } from "@/services/serviceGetPerson";

export function useGroupsData() {
  const [sectionals, setSectionals] = useState<sectional[]>([]);
  const [groups, setGroups] = useState<group[]>([]);
  const [users, setUsers] = useState<leaderDataTable[]>([]);
  const [catalogGroups, setCatalogGroups] = useState<groups[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [groupsData, allGroups, sectionalsData, usersData] =
        await Promise.all([
          getGroupService(),
          getGroup(),
          getSectionalService(),
          getPersonTable(),
        ]);
      setGroups(groupsData);
      setCatalogGroups(allGroups);
      setSectionals(sectionalsData);
      setUsers(usersData);
      console.log(groupsData);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadAll();
  }, []);
  return { sectionals, groups, catalogGroups, users, loading, reload: loadAll };
}
