"use client";

import axios from "axios";
import { supabase } from "@/lib/supabase-browser";

async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}
function authHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getGroupService() {
  try {
    const token = await getAccessToken();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/group-headquarters/all`,
      { headers: { ...authHeaders(token) } },
    );
    return data;
  } catch (error) {
    console.error("getGroupService error:", error);
    throw error;
  }
}

export async function getGroup() {
  try {
    const token = await getAccessToken();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/group/all`,
      { headers: { ...authHeaders(token) } },
    );
    return data;
  } catch (error) {
    console.error("getGroup error:", error);
    throw error;
  }
}

export async function getGroupTable(id: string) {
  try {
    const token = await getAccessToken();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/headquarters/table/${id}`,
      { headers: { ...authHeaders(token) } },
    );
    return data;
  } catch (error) {
    console.error("getGroupTable error:", error);
    throw error;
  }
}
