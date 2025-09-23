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
