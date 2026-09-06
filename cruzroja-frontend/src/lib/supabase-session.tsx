"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";

export default function SupabaseSessionWatcher() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((window as any).__MUTE_AUTH_EVENTS) return;

      const id = session?.user?.id ?? null;

      if (event === "SIGNED_IN") {
        if (id) {
          localStorage.setItem("supabase_uid", id);
        }
      }

      if (event === "SIGNED_OUT") {
        localStorage.removeItem("supabase_uid");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
}

