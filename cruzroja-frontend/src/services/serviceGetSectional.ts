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


export async function getSectionalService() {
  try {
    const token = await getAccessToken();

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/headquarters/all`,
      {
        headers: {
          ...authHeaders(token),
        },
      },
    );

    return data;
  } catch (error) {
    console.error("getSectionalService error:", error);
    throw error;
  }
}
