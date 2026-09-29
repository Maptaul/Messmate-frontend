import type { MessageKey } from "./translate";

/**
 * The API answers in English. Messages users actually hit get a translation;
 * anything not listed is shown as the API wrote it.
 */
const API_MESSAGE_KEYS: Record<string, MessageKey> = {
  "Invalid Credentials": "errors.api.invalidCredentials",
  "User Not Found": "errors.api.userNotFound",
  "User Does Not Exist!": "errors.api.userNotFound",
  "User Is Blocked": "errors.api.userBlocked",
  "User Is Deleted": "errors.api.userDeleted",
  "OTP Does Not Match": "errors.api.otpMismatch",
  "Email Already Verified": "errors.api.emailAlreadyVerified",
  "Too many requests. Please try again later.": "errors.api.tooManyRequests",
  "Too many authentication attempts. Please try again later.":
    "errors.api.tooManyRequests",
  "User not found. Please log in again.": "errors.api.sessionExpired",
};

export const apiMessageKey = (message: string): MessageKey | undefined =>
  API_MESSAGE_KEYS[message];
