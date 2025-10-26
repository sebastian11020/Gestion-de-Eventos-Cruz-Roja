import axios from "axios";
import type {CreateEventForm} from "@/types/usertType";

export async function getAmbitService() {
  try {
    const response = await axios.get(`http://localhost:8080/scope/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getFrameService() {
  try {
    const response = await axios.get(`http://localhost:8080/event-frame/all`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function getClassificationService() {
  try {
    const response = await axios.get(
      `http://localhost:8080/classification-event/all`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getEventService() {
    try {
        const response = await axios.get(
            `http://localhost:8080/event/all`,
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function createEventService(event:CreateEventForm) {
    try {
        const response = await axios.post(
            `http://localhost:8080/event/create`,event
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteEventService(id:string) {
    try {
        const response = await axios.put(`http://localhost:8080/event/deactivate/${id}`);
        return response.data;
    }catch (error) {
        console.error(error);
    }
}
