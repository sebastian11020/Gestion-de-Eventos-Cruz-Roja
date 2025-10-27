import axios from "axios";
import { formCreatePerson } from "@/types/usertType";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();
const {
  data: { session },
} = await sb.auth.getSession();

export async function createPersonService(person: formCreatePerson) {
  try {
    const response = await axios.post(
      `http://localhost:8080/person/create`,
      person,
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

export async function updatePersonService(person: formCreatePerson) {
  try {
    const response = await axios.put(
      `http://localhost:8080/person/update/${person.id}`,
      person,
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
