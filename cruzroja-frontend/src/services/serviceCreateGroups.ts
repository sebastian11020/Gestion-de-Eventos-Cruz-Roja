"use client";

import axios from "axios";
import { createGroup } from "@/types/usertType";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();

async function getAccessToken() {
    const { data: { session } } = await sb.auth.getSession();
    return session?.access_token ?? null;
}

function authHeaders(token: string | null) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createGroupService(group: createGroup) {
    const token = await getAccessToken();
    const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/group/create`,
        group,
        { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
    );
    return data;
}

export async function associateGroupService(group: createGroup) {
    const token = await getAccessToken();
    const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/group-headquarters/associate`,
        group,
        { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
    );
    return data;
}

export async function changeLeaderGroup(newLeaderGroup: any) {
    const token = await getAccessToken();
    const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/group-headquarters/change-leader`,
        newLeaderGroup,
        { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
    );
    return data;
}

export async function deleteGroup(idGroup: string, idHeadquarters: string) {
    const token = await getAccessToken();
    const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/group-headquarters/deactivate/${idGroup}/${idHeadquarters}`,
        {},
        { headers: authHeaders(token) }
    );
    return data;
}

export async function updateGroup(id_group: string, name: string) {
    const token = await getAccessToken();
    const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/group/update/${id_group}`,
        { name },
        { headers: { "Content-Type": "application/json", ...authHeaders(token) } }
    );
    return data;
}
