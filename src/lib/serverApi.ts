import "server-only";
import { cookies } from "next/headers";
import { ofetch } from "ofetch";

const BASE_URL = `${process.env.BACKEND_URL?.replace(/\/+$/, "")}/api/v1`;

/**
 * The same client as `apiClient`, for server prefetch: it calls the API
 * directly and carries the visitor's cookies.
 */
export default async function serverApi() {
  const cookie = (await cookies()).toString();

  return ofetch.create({ baseURL: BASE_URL, headers: { cookie } });
}
