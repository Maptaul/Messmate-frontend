import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuthTokens,
  LoginPayload,
  Me,
  RegistrationPayload,
  ResetPasswordPayload,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

/** Google Identity ID token → session cookies. New Google users join as MEMBER. */
export function googleOAuth(payload: { idToken: string }) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient<ApiResponse<null>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function forgotPassword(email: string) {
  return apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function userLogout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function refreshToken() {
  return apiClient<ApiResponse<AuthTokens>>("/auth/refresh-token", {
    method: "POST",
  });
}

export function getMe(client = apiClient) {
  return client<ApiResponse<Me>>("/auth/me");
}
