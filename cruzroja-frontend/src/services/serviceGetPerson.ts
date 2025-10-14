import axios from 'axios';

export async function getPersonTable() {
    try {
        const response = await axios.get(
            `http://localhost:8080/person/table/all`,
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}