import axios from "axios";

export async function getGroupService() {
  try {
    const response = await axios.get(
      `http://localhost:8080/group-headquarters/all`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getGroup() {
  try {
    const response = await axios.get(`http://localhost:8080/group/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
