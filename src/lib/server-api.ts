import "server-only";
import { cookies } from "next/headers";
import { ofetch } from "ofetch";
import type { ApiClient } from "./api-client";

const backendUrl = `${process.env.BACKEND_URL?.replace(/\/+$/, "")}/api/v1`;

/** Calls the backend directly from the server, carrying the user's cookies. */
export async function serverApi(): Promise<ApiClient> {
  const cookie = (await cookies()).toString();
  const client = ofetch.create({ baseURL: backendUrl, headers: { cookie } });

  return (url, options) => client(url, options);
}
