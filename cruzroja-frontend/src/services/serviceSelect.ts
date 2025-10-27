import axios from "axios";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();
const {
  data: { session },
} = await sb.auth.getSession();

export async function getCities() {
  try {
    const response = await axios.get(
      `http://localhost:8080/location/department/1/municipalities`,
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
export async function getEPS() {
  try {
    const response = await axios.get(`http://localhost:8080/eps/all`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getState() {
  try {
    const response = await axios.get(`http://localhost:8080/state/all`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getSkills() {
  try {
    const response = await axios.get(`http://localhost:8080/skill/all`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
