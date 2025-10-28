// app/api/session/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { role } = await req.json().catch(() => ({}));
    if (!role) return NextResponse.json({ ok: false, message: "role requerido" }, { status: 400 });

    const isHttps = new URL(req.url).protocol === "https:"; // en LAN casi siempre http
    const value = encodeURIComponent(String(role));

    const res = NextResponse.json({ ok: true });

    // HttpOnly (server lo ve, cliente NO lo ve en document.cookie)
    res.cookies.set("cr_role", value, {
        httpOnly: true,
        secure: isHttps,   // <- en http será false
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 120,
    });

    // DEBUG: visible en document.cookie (para que confirmes rápido)
    res.cookies.set("cr_role_dbg", value, {
        httpOnly: false,
        secure: isHttps,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 120,
    });

    return res;
}

export async function DELETE(req: Request) {
    const isHttps = new URL(req.url).protocol === "https:";
    const res = NextResponse.json({ ok: true });
    res.cookies.set("cr_role", "", { httpOnly: true, secure: isHttps, sameSite: "lax", path: "/", maxAge: 0 });
    res.cookies.set("cr_role_dbg", "", { httpOnly: false, secure: isHttps, sameSite: "lax", path: "/", maxAge: 0 });
    return res;
}
