import axios from "axios";
import { createSectional } from "@/types/usertType";

export async function createSectionalService(sectional: createSectional) {
  try {
    const response = await axios.post(
      `http://localhost:8080/headquarters/create`,
      sectional,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function changeLeaderSectionalService(newLeader:any) {
    try {
        const response = await axios.post(
            `http://localhost:8080/headquarters/change-leader`,
            newLeader,
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
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteSectional(id: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/headquarters/update/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
