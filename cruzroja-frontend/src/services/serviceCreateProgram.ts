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
