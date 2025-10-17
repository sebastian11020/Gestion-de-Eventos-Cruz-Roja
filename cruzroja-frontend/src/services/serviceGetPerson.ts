import axios from "axios";

export async function getPersonTable() {
  try {
    const response = await axios.get(`http://localhost:8080/person/table/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPerson() {
  try {
    const response = await axios.get(`http://localhost:8080/person/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPersonId(document: string) {
  try {
    const response = await axios.get(
      `http://localhost:8080/person/leaderinfo/${document}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPersonData(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:8080/person/login/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
