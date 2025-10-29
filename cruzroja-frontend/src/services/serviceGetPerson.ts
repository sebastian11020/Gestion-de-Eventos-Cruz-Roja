"use client";

import axios from "axios";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();

async function getAccessToken() {
    const { data: { session } } = await sb.auth.getSession();
    return session?.access_token ?? null;
}

export async function getPersonTable() {
    const token = await getAccessToken();
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/person/table/all`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return data;
}

export async function getPerson() {
    const token = await getAccessToken();
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/person/all`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return data;
}

export async function getPersonId(document: string) {
    const token = await getAccessToken();
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/person/leaderinfo/${document}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return data;
}

export async function getPersonUpdate() {
    const token = await getAccessToken();
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/person/profile/`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return data;
}

export async function getPersonData(id: string) {
    const token = await getAccessToken();
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/person/login/${id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return data;
}

export async function getPersonEvent() {
    const token = await getAccessToken();
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/person/table/special-event`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return data;
}

export async function getAssistEvent(id: string) {
    const token = await getAccessToken();
    const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/event-enrollment/get-participants-table/${id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return data;
}

export async function removeAssistEvent(id_event: string, id_user: string) {
    const token = await getAccessToken();
    const payload = { id_event, id_person: id_user };
    const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/event-enrollment/canceled-enrollment`,
        payload,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return data;
}
