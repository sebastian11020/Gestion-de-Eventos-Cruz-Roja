
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { role } = await req.json();
    const res = NextResponse.json({ ok: true });

    res.cookies.set("cr_role", role, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 120,
        path: "/",
    });

    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("cr_role", "", {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 0,
    });
    return res;
}
