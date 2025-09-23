"use client";
import { useState } from "react";
import { AppSidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false); // para móvil
  return (
    <div className="min-h-screen bg-slate-50 md:pl-64">
      <Topbar onOpenSidebar={() => setOpen(true)} />
      <AppSidebar open={open} setOpen={setOpen} />
      <main className="p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
