export function getSupabaseUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("supabase_uid");
}
