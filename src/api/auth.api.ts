import { type ApiClient, apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  AuthTokens,
  LoginPayload,
  Me,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "@/types";

export function login(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

/** Google Identity ID token → session cookies. New Google users join as MEMBER. */
export function googleLogin(idToken: string) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/google", {
    method: "POST",
    body: { idToken },
  });
}

export function register(payload: RegisterPayload) {
  return apiClient<ApiResponse<null>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
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

export function logout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function refreshToken() {
  return apiClient<ApiResponse<AuthTokens>>("/auth/refresh-token", {
    method: "POST",
  });
}

export function getMe(client: ApiClient = apiClient) {
  return client<ApiResponse<Me>>("/auth/me");
}
