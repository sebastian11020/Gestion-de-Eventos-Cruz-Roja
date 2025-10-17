import { createProgram } from "@/types/usertType";
import axios from "axios";

export async function createProgramService(program: createProgram) {
  try {
    const response = await axios.post(
      `http://localhost:8080/program/create`,
      program,
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
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProgram(idProgram: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/program-headquarters/deactivate/${idProgram}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
