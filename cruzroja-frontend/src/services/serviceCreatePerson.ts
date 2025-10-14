import axios from "axios";
import {formCreatePerson} from "@/types/usertType";

export async function createPersonService(person: formCreatePerson) {
    try {
        const response = await axios.post(
            `http://localhost:8080/person/create`,
            person,
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function updatePersonService(person: formCreatePerson) {
    try {
        const response = await axios.put(`http://localhost:8080/person/update/${person.id}`
            , person);
        return response.data;
    }catch (error) {
        console.error(error);
    }
}