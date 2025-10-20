import axios from "axios";

export async function getCities() {
  try {
    const response = await axios.get(
      `http://localhost:8080/location/department/1/municipalities`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function getEPS() {
  try {
    const response = await axios.get(`http://localhost:8080/eps/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getState() {
  try {
    const response = await axios.get(`http://localhost:8080/state/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getSkills() {
  try {
    const response = await axios.get(`http://localhost:8080/skill/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
