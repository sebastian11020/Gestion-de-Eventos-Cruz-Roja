import axios from "axios";
import {createSectional} from "@/types/usertType";

export async function createSectionalService(sectional:createSectional) {
    try {
        const response = await axios.post(
            `http://localhost:8080/headquarters/create`,sectional
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getSectionalInfo() {
    try {
        const response = await axios.get('http://localhost:8080/headquarters/allInfo')
        return response.data;
    }catch (error) {
        console.error(error);
    }
}