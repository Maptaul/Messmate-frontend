export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "MESS_MANAGER" | "MEMBER";
  /** Sent only when asking to run a mess. */
  messName?: string;
  messAddress?: string;
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
