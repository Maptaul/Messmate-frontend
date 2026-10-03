import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE } from "@/i18n/config";
import { localePath, splitLocale } from "@/i18n/locale-path";
import { ACCESS_COOKIE, REFRESH_COOKIE, verifyAccessToken } from "@/lib/jwt";
import type { SessionUser, UserRole } from "@/types";
import { ROLE_HOME } from "@/utils/role.util";

const AUTH_PAGES = ["/login", "/register", "/forgot-password"];

const ANY_ROLE: UserRole[] = ["ADMIN", "MESS_MANAGER", "MEMBER"];
const RESIDENTS: UserRole[] = ["MESS_MANAGER", "MEMBER"];

/** Which roles may open each protected area. First match wins. */
const AREAS: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["ADMIN"] },
  { prefix: "/manager", roles: ["MESS_MANAGER"] },
  // A manager lives in the mess too: plans meals and pays a bill.
  { prefix: "/dashboard", roles: RESIDENTS },
  { prefix: "/payment", roles: RESIDENTS },
  { prefix: "/profile", roles: ANY_ROLE },
  { prefix: "/finance", roles: ANY_ROLE },
];

const LOCALE_COOKIE_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  sameSite: "lax",
} as const;

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
  const { locale, path, explicit } = splitLocale(pathname);
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const at = (target: string) => new URL(target, request.url);

  // 1. `/en/...` isn't canonical - remember English and drop the prefix.
  if (explicit && locale === DEFAULT_LOCALE) {
    const response = NextResponse.redirect(at(path + search));
    response.cookies.set(LOCALE_COOKIE, locale, LOCALE_COOKIE_OPTIONS);
    return response;
  }

  // 2. An unprefixed link, but this visitor chose Bangla before.
  if (!explicit && isLocale(savedLocale) && savedLocale !== DEFAULT_LOCALE) {
    return NextResponse.redirect(at(localePath(savedLocale, path) + search));
  }

  // 3. Auth and roles, on the path without its locale.
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

  const area = AREAS.find(({ prefix }) => isUnder(path, prefix));
  const isAuthPage = AUTH_PAGES.some((page) => isUnder(path, page));

  let response: NextResponse;

  if (user && isAuthPage) {
    response = NextResponse.redirect(
      at(localePath(locale, ROLE_HOME[user.role])),
    );
  } else if (area && !user) {
    const login = at(localePath(locale, "/login"));
    login.searchParams.set("redirect", pathname + search);
    response = NextResponse.redirect(login);
    // Whatever was left is dead; don't keep sending it.
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
  } else if (area && user && !area.roles.includes(user.role)) {
    response = NextResponse.redirect(
      at(localePath(locale, ROLE_HOME[user.role])),
    );
  } else {
    // Hand fresh tokens to this very render, not just the next request.
    for (const cookie of setCookies) {
      const [pair] = cookie.split(";");
      const eq = pair.indexOf("=");
      request.cookies.set(pair.slice(0, eq), pair.slice(eq + 1));
    }
    const init = { request: { headers: request.headers } };

    // 4. English URLs carry no prefix, so serve them from app/[lang] as "en".
    response =
      locale === DEFAULT_LOCALE
        ? NextResponse.rewrite(
            at(`/${DEFAULT_LOCALE}${path === "/" ? "" : path}${search}`),
            init,
          )
        : NextResponse.next(init);

    if (explicit && savedLocale !== locale) {
      response.cookies.set(LOCALE_COOKIE, locale, LOCALE_COOKIE_OPTIONS);
    }
  }

  for (const cookie of setCookies) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)",
  ],
};
