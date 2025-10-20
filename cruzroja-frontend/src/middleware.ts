import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/login", "/auth/forgot", "/403"]);
const RULES: Array<{ pattern: RegExp; roles: string[] }> = [
  {
    pattern: /^\/dashboard\/agrupaciones(?:\/|$)/,
    roles: ["ADMINISTRADOR", "LIDER VOLUNTARIADO", "LIDER SEDE"],
  },
  {
    pattern: /^\/dashboard\/sedes(?:\/|$)/,
    roles: ["ADMINISTRADOR", "LIDER VOLUNTARIADO"],
  },
  {
    pattern: /^\/dashboard\/programas(?:\/|$)/,
    roles: [
      "ADMINISTRADOR",
      "LIDER VOLUNTARIADO",
      "LIDER SEDE",
      "COORDINADOR AGRUPACION",
    ],
  },
  {
    pattern: /^\/dashboard\/voluntarios(?:\/|$)/,
    roles: ["ADMINISTRADOR", "LIDER VOLUNTARIADO", "LIDER SEDE"],
  },
  {
    pattern: /^\/dashboard\/reportes(?:\/|$)/,
    roles: ["ADMINISTRADOR", "LIDER VOLUNTARIADO", "LIDER SEDE"],
  },
  {
    pattern: /^\/dashboard(?:\/|$)/,
    roles: [
      "ADMINISTRADOR",
      "COORDINADOR AGRUPACION",
      "COORDINADOR PROGRAMA",
      "LIDER VOLUNTARIADO",
      "LIDER SEDE",
      "VOLUNTARIO",
    ],
  },
];

function requiredRoles(pathname: string) {
  return RULES.find((r) => r.pattern.test(pathname))?.roles ?? null;
}

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();
  const raw = req.cookies.get("cr_role")?.value;
  const role = raw ? decodeURIComponent(raw) : null;

  if (!role && pathname.startsWith("/dashboard")) {
    const url = new URL("/login", origin);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const needed = requiredRoles(pathname);
  if (needed && role && !needed.includes(role)) {
    return NextResponse.redirect(new URL("/403", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
