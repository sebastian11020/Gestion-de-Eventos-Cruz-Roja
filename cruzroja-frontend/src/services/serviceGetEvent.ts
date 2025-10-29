"use client";

import axios from "axios";
import type { CreateEventForm } from "@/types/usertType";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();

async function getAccessToken() {
    const {
        data: { session },
    } = await sb.auth.getSession();
    return session?.access_token ?? null;
}

async function getUserId() {
    if (typeof window !== "undefined") {
        const id = localStorage.getItem("supabase_uid");
        if (id) return id;
    }
    const {
        data: { session },
    } = await sb.auth.getSession();
    return session?.user?.id ?? null;
}

function authHeaders(token: string | null) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}
export async function getAmbitService() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/scope/all`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getAmbitService error:", error);
        throw error;
    }
}

export async function getFrameService() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/event-frame/all`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getFrameService error:", error);
        throw error;
    }
}

export async function getClassificationService() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/classification-event/all`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getClassificationService error:", error);
        throw error;
    }
}

export async function getEventService() {
    try {
        const token = await getAccessToken();
        const id = await getUserId(); // evita crashear en SSR y usa sesión si no hay localStorage
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/event/all`,
            {
                params: { id_user: id ?? undefined },
                headers: { ...authHeaders(token) },
            }
        );
        return data;
    } catch (error) {
        console.error("getEventService error:", error);
        throw error;
    }
}

export async function createEventService(event: CreateEventForm) {
    try {
        const token = await getAccessToken();
        const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/event/create`,
            event,
            { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("createEventService error:", error);
        throw error;
    }
}

export async function getLeaderEvent() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/person/table/all`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getLeaderEvent error:", error);
        throw error;
    }
}

export async function deleteEventService(id: string) {
    try {
        const token = await getAccessToken();
        const { data } = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/event/deactivate/${id}`,
            {},
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("deleteEventService error:", error);
        throw error;
    }
}

export async function inscribeEvent(id_event: string, id_skill: string) {
    try {
        const token = await getAccessToken();
        const id_person = await getUserId();
        const payload = { id_event, id_person, id_skill };
        const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/event-enrollment/enrollment`,
            payload,
            { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("inscribeEvent error:", error);
        throw error;
    }
}

export async function cancelInscribeEvent(id_event: string) {
    try {
        const token = await getAccessToken();
        const id_person = await getUserId();
        const payload = { id_event, id_person };
        const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/event-enrollment/canceled-enrollment`,
            payload,
            { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("cancelInscribeEvent error:", error);
        throw error;
    }
}

export async function getSkillsPerson() {
    try {
        const token = await getAccessToken();
        const id = await getUserId();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/person/skills/`,
            {
                params: { id_user: id ?? undefined },
                headers: { ...authHeaders(token) },
            }
        );
        return data;
    } catch (error) {
        console.error("getSkillsPerson error:", error);
        throw error;
    }
}

export async function startEventService(id: string) {
    try {
        const token = await getAccessToken();
        const { data } = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/event/start/${id}`,
            {},
            { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("startEventService error:", error);
        throw error;
    }
}

export async function endEventService(id: string) {
    try {
        const token = await getAccessToken();
        const { data } = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/event/end/${id}`,
            {},
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("endEventService error:", error);
        throw error;
    }
}

export async function updateEventService(id: string, payload: any) {
    try {
        const token = await getAccessToken();
        const { data } = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/event/update/${id}`,
            payload,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("updateEventService error:", error);
        throw error;
    }
}
