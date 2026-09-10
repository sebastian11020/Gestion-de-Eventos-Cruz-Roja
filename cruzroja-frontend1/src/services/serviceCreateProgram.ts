"use client";

import axios from "axios";
import { createProgram } from "@/types/usertType";
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

export async function createProgramService(program: createProgram) {
  try {
    const token = await getAccessToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/program/create`,
      program,
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error en createProgramService:", error);
    throw error;
  }
}

export async function associateProgramService(program: createProgram) {
  try {
    const token = await getAccessToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/program-headquarters/associate`,
      program,
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error en associateProgramService:", error);
    throw error;
  }
}

export async function getProgramService() {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/program-headquarters/all`,
      {
        headers: {
          ...authHeaders(token),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error en getProgramService:", error);
    throw error;
  }
}

export async function updateProgram(id_program: string, name: string) {
  try {
    const token = await getAccessToken();
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/program/update/${id_program}`,
      { name },
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error en updateProgram:", error);
    throw error;
  }
}

export async function getProgramTable(id: string) {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/group-headquarters/table/${id}`,
      {
        headers: {
          ...authHeaders(token),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error en getProgramTable:", error);
    throw error;
  }
}

export async function changeLeaderProgram(newLeaderGroup: any) {
  try {
    const token = await getAccessToken();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/program-headquarters/change-leader`,
      newLeaderGroup,
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error en changeLeaderProgram:", error);
    throw error;
  }
}

export async function deleteProgram(idProgram: string) {
  try {
    const token = await getAccessToken();
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/program-headquarters/deactivate/${idProgram}`,
      {},
      {
        headers: {
          ...authHeaders(token),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error en deleteProgram:", error);
    throw error;
  }
}
