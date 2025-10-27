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
