"use client";

import axios from "axios";
import { formCreatePerson } from "@/types/usertType";
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

export async function createPersonService(person: formCreatePerson) {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/person/create`,
      person,
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error en createPersonService:", error);
    throw error;
  }
}

export async function updatePersonService(person: formCreatePerson) {
  const sex=person.sex.toUpperCase()
  const gender = person.gender.toUpperCase()
  const type = person.type_affiliation.toUpperCase()
  const payload = {
      ...person,sex:sex,gender:gender,type_affiliation:type
  }
  console.log(payload);
  try {
    const token = await getAccessToken();

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/person/update/${person.id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error en updatePersonService:", error);
    throw error;
  }
}

export async function updatePersonProfile(person: any) {
  try {
    const token = await getAccessToken();

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/person/update-profile/`,
      person,
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error en updatePersonService:", error);
    throw error;
  }
}
