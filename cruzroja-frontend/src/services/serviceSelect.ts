"use client";

import axios from "axios";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();

async function getAccessToken() {
    const { data: { session } } = await sb.auth.getSession();
    return session?.access_token ?? null;
}

function authHeaders(token: string | null) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}


export async function getCities() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/location/department/1/municipalities`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getCities error:", error);
        throw error;
    }
}
export async function getDepartments() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/location/departmentsWithMunicipalities`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getDepartments error:", error);
        throw error;
    }
}

export async function getEPS() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/eps/all`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getEPS error:", error);
        throw error;
    }
}
export async function getState() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/state/all`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getState error:", error);
        throw error;
    }
}

export async function getSkills() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/skill/all`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getSkills error:", error);
        throw error;
    }
}

export async function getReportDesvinculate() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/person/inactivity-report`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getReport error:", error);
        throw error;
    }
}

export async function getReportInactivate() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/person/unlinked-report`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getReport error:", error);
        throw error;
    }
}

export async function getEventsCalendar() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/event/calendar`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getReport error:", error);
        throw error;
    }
}

export async function getPersonDashboard() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/person/dashboard-card`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getReport error:", error);
        throw error;
    }
}

export async function getPersonPodium() {
    try {
        const token = await getAccessToken();
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/person/dashboard-podium`,
            { headers: { ...authHeaders(token) } }
        );
        return data;
    } catch (error) {
        console.error("getReport error:", error);
        throw error;
    }
}


