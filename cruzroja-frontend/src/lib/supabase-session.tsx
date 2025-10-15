"use client";
import { useEffect} from "react";
import { supabase } from "@/lib/supabase-browser";

export default function SupabaseSessionWatcher() {
    if (typeof window !== "undefined" && (window as any).__MUTE_AUTH_EVENTS === undefined) {
        (window as any).__MUTE_AUTH_EVENTS = false;
    }

    useEffect(() => {
        const { data: listener } = supabase().auth.onAuthStateChange(
            (event, session) => {
                if ((window as any).__MUTE_AUTH_EVENTS) return;

                const id = session?.user?.id ?? null;
                const token = session?.access_token ?? null;

                if (event === "SIGNED_IN") {
                    if (id) localStorage.setItem("supabase_uid", id);
                    if (token) localStorage.setItem("access_token", token);
                }

                if (event === "TOKEN_REFRESHED" && token) {
                    localStorage.setItem("access_token", token);
                }

                if (event === "SIGNED_OUT") {
                    localStorage.removeItem("supabase_uid");
                    localStorage.removeItem("access_token");
                }
            }
        );
        return () => listener.subscription.unsubscribe();
    }, []);

    return null;
}
