export const ACTIVE_MESS_COOKIE = "activeMessId";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Only a preference: the server checks it against the user's own messes. */
export function rememberActiveMess(messId: string) {
  // biome-ignore lint/suspicious/noDocumentCookie: a plain preference cookie
  document.cookie = `${ACTIVE_MESS_COOKIE}=${messId}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}
