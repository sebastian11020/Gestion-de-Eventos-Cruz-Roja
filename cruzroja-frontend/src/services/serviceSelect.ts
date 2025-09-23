import axios from "axios";

export async function getCities() {
  try {
    const response = await axios.get(
      `http://localhost:8080/department/${1}/municipalities`,
    );
    console.log("Respuesta Municipios", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
