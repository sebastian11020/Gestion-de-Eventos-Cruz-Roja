import { createProgram } from "@/types/usertType";
import axios from "axios";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();
const {
  data: { session },
} = await sb.auth.getSession();

export async function createProgramService(program: createProgram) {
  try {
    const response = await axios.post(
      `http://localhost:8080/program/create`,
      program,
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

export async function associateProgramService(program: createProgram) {
  try {
    const response = await axios.post(
      `http://localhost:8080/program-headquarters/associate`,
      program,
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

export async function getProgramService() {
  try {
    const response = await axios.get(
      `http://localhost:8080/program-headquarters/all`,
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

export async function updateProgram(id_program: string, name: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/program/update/${id_program}`,
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

export async function getProgramTable(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:8080/group-headquarters/table/${id}`,
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

export async function changeLeaderProgram(newLeaderGroup: any) {
  try {
    const response = await axios.post(
      `http://localhost:8080/program-headquarters/change-leader`,
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

export async function deleteProgram(idProgram: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/program-headquarters/deactivate/${idProgram}`,{},
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
