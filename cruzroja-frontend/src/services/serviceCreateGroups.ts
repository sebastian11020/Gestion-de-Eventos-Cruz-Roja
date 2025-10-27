import axios from "axios";
import { createGroup } from "@/types/usertType";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();
const {
  data: { session },
} = await sb.auth.getSession();

export async function createGroupService(group: createGroup) {
  try {
    const response = await axios.post(
      `http://localhost:8080/group/create`,
      group,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function associateGroupService(group: createGroup) {
  try {
    const response = await axios.post(
      `http://localhost:8080/group-headquarters/associate`,
      group,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function changeLeaderGroup(newLeaderGroup: any) {
  try {
    const response = await axios.post(
      `http://localhost:8080/group-headquarters/change-leader`,
      newLeaderGroup,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteGroup(idGroup: string, idHeadquarters: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/group-headquarters/deactivate/${idGroup}/${idHeadquarters}`,
        {},
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateGroup(id_group: string, name: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/group/update/${id_group}`,
      { name: name },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
