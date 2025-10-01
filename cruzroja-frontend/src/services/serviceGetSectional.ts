import axios from "axios";

export async function getSectionalService() {
  try {
    const response = await axios.get(`http://localhost:8080/headquarters/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
