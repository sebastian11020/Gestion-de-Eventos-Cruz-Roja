import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SupabaseSessionWatcher from "@/lib/supabase-session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Cruz Roja Seccional Boyacá",
        template: "%s | Cruz Roja Seccional Boyacá",
    },
    description: "Sistema de gestión de eventos y horas - Cruz Roja Colombiana",
    icons: {
        icon: "/Emblema_Cruz_Roja.png",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" reverseOrder={false} />
        <SupabaseSessionWatcher />
        <SpeedInsights />
      </body>
    </html>
  );
}
