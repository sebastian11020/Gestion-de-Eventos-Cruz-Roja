import axios from "axios";
import {createGroup} from "@/types/usertType";

export async function createGroupService(group:createGroup) {
    try {
        const response = await axios.post(
            `http://localhost:8080/group/create`,group
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}