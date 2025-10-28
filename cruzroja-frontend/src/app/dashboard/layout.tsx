import { cookies } from "next/headers";
import { DashboardShell } from "./shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("cr_role")?.value ?? null;
  const initialRole = raw ? decodeURIComponent(raw) : null;

  return <DashboardShell initialRole={initialRole}>{children}</DashboardShell>;
}
