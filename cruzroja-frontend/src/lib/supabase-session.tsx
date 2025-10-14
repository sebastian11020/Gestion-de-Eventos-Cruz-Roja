"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";

export default function SupabaseSessionWatcher() {
    useEffect(() => {
        const { data: listener } = supabase().auth.onAuthStateChange(
            (_event, session) => {
                const id = session?.user?.id ?? null;
                if (id) {
                    localStorage.setItem("supabase_uid", id);
                } else {
                    localStorage.removeItem("supabase_uid");
                }
                const token = session?.access_token;
                if (token) localStorage.setItem("access_token", token);
            },
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return null;
}
