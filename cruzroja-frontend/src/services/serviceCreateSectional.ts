"use client";

import axios from "axios";
import { createSectional } from "@/types/usertType";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();
async function getAccessToken() {
  const {
    data: { session },
  } = await sb.auth.getSession();
  return session?.access_token ?? null;
}

function authHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createSectionalService(sectional: createSectional) {
  try {
    const token = await getAccessToken();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/headquarters/create`,
      sectional,
      {
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
      },
    );
    return data;
  } catch (error) {
    console.error("createSectionalService error:", error);
    throw error;
  }
}
export async function changeLeaderSectionalService(newLeader: any) {
  try {
    const token = await getAccessToken();
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/headquarters/change-leader`,
      newLeader,
      {
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
      },
    );
    return data;
  } catch (error) {
    console.error("changeLeaderSectionalService error:", error);
    throw error;
  }
}
export async function getSectionalInfo() {
  try {
    const token = await getAccessToken();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/headquarters/WithProgram`,
      { headers: { ...authHeaders(token) } },
    );
    return data;
  } catch (error) {
    console.error("getSectionalInfo error:", error);
    throw error;
  }
}

export async function getSectionalCreate() {
  try {
    const token = await getAccessToken();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/headquarters/MissingProgram`,
      { headers: { ...authHeaders(token) } },
    );
    return data;
  } catch (error) {
    console.error("getSectionalCreate error:", error);
    throw error;
  }
}

export async function deleteSectional(id: string) {
  try {
    const token = await getAccessToken();
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/headquarters/update/${id}`,
      {},
      { headers: { ...authHeaders(token) } },
    );
    return data;
  } catch (error) {
    console.error("deleteSectional error:", error);
    throw error;
  }
}
