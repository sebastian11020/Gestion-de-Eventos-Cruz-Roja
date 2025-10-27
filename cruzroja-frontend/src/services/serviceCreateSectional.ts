import axios from "axios";
import { createSectional } from "@/types/usertType";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();
const {
  data: { session },
} = await sb.auth.getSession();

export async function createSectionalService(sectional: createSectional) {
  try {
    const response = await axios.post(
      `http://localhost:8080/headquarters/create`,
      sectional,
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

export async function changeLeaderSectionalService(newLeader: any) {
  try {
    const response = await axios.post(
      `http://localhost:8080/headquarters/change-leader`,
      newLeader,
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

export async function getSectionalInfo() {
  try {
    const response = await axios.get(
      "http://localhost:8080/headquarters/WithProgram",
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

export async function getSectionalCreate() {
  try {
    const response = await axios.get(
      "http://localhost:8080/headquarters/MissingProgram",
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

export async function deleteSectional(id: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/headquarters/update/${id}`,{},
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
