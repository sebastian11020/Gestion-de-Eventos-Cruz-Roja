import axios from "axios";
import { createGroup } from "@/types/usertType";

export async function createGroupService(group: createGroup) {
  try {
    const response = await axios.post(
      `http://localhost:8080/group/create`,
      group,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function associateGroupService(group: createGroup) {
  try {
    const response = await axios.post(
      `http://localhost:8080/group-headquarters/associate`,
      group,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function changeLeaderGroup(newLeaderGroup: any) {
  try {
    const response = await axios.post(
      `http://localhost:8080/group-headquarters/change-leader`,
      newLeaderGroup,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteGroup(idGroup: string, idHeadquarters: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/group-headquarters/deactivate/${idGroup}/${idHeadquarters}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateGroup(id_group: string, name: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/group/update/${id_group}`,
      { name: name },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
