"use client";

import axios from "axios";
import { formCreatePerson } from "@/types/usertType";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();

async function getAccessToken() {
    const { data: { session } } = await sb.auth.getSession();
    return session?.access_token ?? null;
}

function authHeaders(token: string | null) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createPersonService(person: formCreatePerson) {
    try {
        const token = await getAccessToken();

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/person/create`,
            person,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(token),
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error en createPersonService:", error);
        throw error;
    }
}

export async function updatePersonService(person: formCreatePerson) {
    try {
        const token = await getAccessToken();

        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/person/update/${person.id}`,
            person,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(token),
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error en updatePersonService:", error);
        throw error;
    }
}
