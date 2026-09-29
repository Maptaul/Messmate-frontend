import { ofetch } from "ofetch";

// Same-origin: next.config.ts rewrites /api/v1/* to the MessMate API, so the
// auth cookies it sets belong to this app and proxy.ts can read them.
const BASE_URL = "/api/v1";

const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

export default apiClient;
