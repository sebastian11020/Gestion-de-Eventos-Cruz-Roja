import {createProgram} from "@/types/usertType";
import axios from "axios";

export async function createProgramService(program:createProgram) {
    try {
        console.log("Creating program service...");
        console.log(program);
        const response = await axios.post(
            `http://localhost:8080/program/create`,program
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}