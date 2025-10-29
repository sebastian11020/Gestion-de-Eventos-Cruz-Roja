"use client";

import axios from "axios";
import { supabase } from "@/lib/supabase-browser";

const sb = supabase();

// 🔹 Helper: obtiene el token actual de Supabase
async function getAccessToken() {
    const { data: { session } } = await sb.auth.getSession();
    return session?.access_token ?? null;
}

// 🔹 Helper: arma los headers de autenticación
function authHeaders(token: string | null) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// 🔹 Servicio: obtener todas las seccionales
export async function getSectionalService() {
    try {
        const token = await getAccessToken();

        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/headquarters/all`,
            {
                headers: {
                    ...authHeaders(token),
                },
            }
        );

        return data;
    } catch (error) {
        console.error("getSectionalService error:", error);
        throw error;
    }
}
