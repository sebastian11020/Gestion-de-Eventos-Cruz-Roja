import { useEffect, useState } from "react";
import { user } from "@/types/usertType";
import { getPersonData } from "@/services/serviceGetPerson";

export function useSideBarData() {
  const [user, setUser] = useState<user>();

  async function loadAll() {
    try {
      const supaBaseId: string = localStorage.getItem("supabase_uid") ?? "";
      const userData = await getPersonData(supaBaseId);
      setUser(userData);
        localStorage.setItem("role",userData.role)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);
  return { user };
}
