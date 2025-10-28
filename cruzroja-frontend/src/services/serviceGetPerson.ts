import axios from "axios";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();
const {
  data: { session },
} = await sb.auth.getSession();

export async function getPersonTable() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/person/table/all`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPerson() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/person/all`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPersonId(document: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/person/leaderinfo/${document}`,
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

export async function getPersonData(id: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/person/login/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPersonEvent() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/person/table/special-event`,
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

export async function getAssistEvent(id:string) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/event-enrollment/get-participants-table/${id}`,
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

export async function removeAssistEvent(id_event:string,id_user:string) {
    try {
        const payload = {
            id_event:id_event,
            id_person:id_user,
        }
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/event-enrollment/canceled-enrollment`,payload,
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


