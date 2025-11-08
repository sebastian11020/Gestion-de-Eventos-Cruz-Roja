import { useEffect, useState } from "react";
import { user } from "@/types/usertType";
import { getPersonData } from "@/services/serviceGetPerson";
import { Notifications } from "@/types/dashboardTypes";
import { getNotifications } from "@/services/serviceSelect";

export function useSideBarData() {
  const [user, setUser] = useState<user>();
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  async function loadAll() {
    try {
      const supaBaseId: string = localStorage.getItem("supabase_uid") ?? "";
      const userData = await getPersonData(supaBaseId);
      const notificationsData = await getNotifications();
      setUser(userData);
      setNotifications(notificationsData);
      localStorage.setItem("role", userData.role);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);
  return { user, notifications };
}
