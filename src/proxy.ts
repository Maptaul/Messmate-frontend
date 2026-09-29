import { type NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, ROLE_HOME } from "@/lib/constants";
import { verifyAccessToken } from "@/lib/jwt";
import type { Role, SessionUser } from "@/types";

const AUTH_PAGES = ["/login", "/register", "/verify-email", "/forgot-password"];

const ANY_ROLE: Role[] = ["ADMIN", "MESS_MANAGER", "MEMBER"];
const RESIDENTS: Role[] = ["MESS_MANAGER", "MEMBER"];

/** Which roles may open each protected area. First match wins. */
const AREAS: { prefix: string; roles: Role[] }[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/manager", roles: ["MESS_MANAGER"] },
  // A manager lives in the mess too: plans meals and pays a bill.
  { prefix: "/dashboard", roles: RESIDENTS },
  { prefix: "/payment", roles: RESIDENTS },
  { prefix: "/profile", roles: ANY_ROLE },
  { prefix: "/finance", roles: ANY_ROLE },
];

const isUnder = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/**
 * The access token lasts a day, the refresh token a week. When only the
 * refresh token is left, trade it for a new pair before routing.
 */
async function refreshSession(refreshToken: string) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/auth/refresh-token`,
      {
        method: "POST",
        headers: { cookie: `${REFRESH_COOKIE}=${refreshToken}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;

    const setCookies = res.headers.getSetCookie();
    const accessCookie = setCookies.find((c) =>
      c.startsWith(`${ACCESS_COOKIE}=`),
    );
    const accessToken = accessCookie
      ?.split(";")[0]
      .slice(ACCESS_COOKIE.length + 1);
    const user = await verifyAccessToken(accessToken);

    return user ? { user, setCookies } : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  let user: SessionUser | null = await verifyAccessToken(
    request.cookies.get(ACCESS_COOKIE)?.value,
  );
  let setCookies: string[] = [];

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!user && refreshToken) {
    const refreshed = await refreshSession(refreshToken);
    if (refreshed) {
      user = refreshed.user;
      setCookies = refreshed.setCookies;
    }
  }

  const area = AREAS.find(({ prefix }) => isUnder(pathname, prefix));
  const isAuthPage = AUTH_PAGES.some((page) => isUnder(pathname, page));

  let response: NextResponse;

  if (user && isAuthPage) {
    response = NextResponse.redirect(
      new URL(ROLE_HOME[user.role], request.url),
    );
  } else if (area && !user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("redirect", pathname + search);
    response = NextResponse.redirect(login);
    // Whatever was left is dead; don't keep sending it.
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
  } else if (area && user && !area.roles.includes(user.role)) {
    response = NextResponse.redirect(
      new URL(ROLE_HOME[user.role], request.url),
    );
  } else {
    // Hand fresh tokens to this very render, not just the next request.
    for (const cookie of setCookies) {
      const [pair] = cookie.split(";");
      const at = pair.indexOf("=");
      request.cookies.set(pair.slice(0, at), pair.slice(at + 1));
    }
    response = NextResponse.next({ request: { headers: request.headers } });
  }

  for (const cookie of setCookies)
    response.headers.append("set-cookie", cookie);

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)",
  ],
};
