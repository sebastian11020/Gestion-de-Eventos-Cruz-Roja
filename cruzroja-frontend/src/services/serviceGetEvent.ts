import axios from "axios";
import type { CreateEventForm } from "@/types/usertType";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();
const {
  data: { session },
} = await sb.auth.getSession();

export async function getAmbitService() {
  try {
    const response = await axios.get(`http://localhost:8080/scope/all`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getFrameService() {
  try {
    const response = await axios.get(`http://localhost:8080/event-frame/all`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function getClassificationService() {
  try {
    const response = await axios.get(
      `http://localhost:8080/classification-event/all`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getEventService() {
  const id = localStorage.getItem("supabase_uid");
  try {
    const response = await axios.get(
      `http://localhost:8080/event/all?id_user=${id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function createEventService(event: CreateEventForm) {
  try {
    const response = await axios.post(
      `http://localhost:8080/event/create`,
      event,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getLeaderEvent() {
  try {
    const response = await axios.get(`http://localhost:8080/person/table/all`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteEventService(id: string) {
  try {
    const response = await axios.put(
      `http://localhost:8080/event/deactivate/${id}`,
        {},
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function inscribeEvent(id_event: string, id_skill: string) {
  const id_person = localStorage.getItem("supabase_uid");
  const payload = {
    id_event: id_event,
    id_person: id_person,
    id_skill: id_skill,
  };
  try {
    const response = await axios.post(
      `http://localhost:8080/event-enrollment/enrollment`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function cancelInscribeEvent(id_event: string) {
  const id_person = localStorage.getItem("supabase_uid");
  const payload = {
    id_event: id_event,
    id_person: id_person,
  };
  try {
    const response = await axios.post(
      `http://localhost:8080/event-enrollment/canceled-enrollment`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getSkillsPerson() {
  try {
    const id = localStorage.getItem("supabase_uid");
    const response = await axios.get(
      `http://localhost:8080/person/skills/?id_user=${id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function startEventService(id: string) {
    try {
        const response = await axios.put(
            `http://localhost:8080/event/start/${id}`,{},
            {
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${session?.access_token}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export async function endEventService(id: string) {
    try {
        const response = await axios.put(
            `http://localhost:8080/event/end/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
