import { create } from "zustand";
import type { RegistrationPayload } from "@/types";

/**
 * The OTP lives five minutes and the only way to resend it is to register
 * again. Keep the payload in memory (never storage - it holds a password) so
 * the verify page can resend; a reload simply drops it.
 */
interface PendingRegistrationState {
  payload: RegistrationPayload | null;
  setPayload: (payload: RegistrationPayload | null) => void;
}

export const usePendingRegistration = create<PendingRegistrationState>()(
  (set) => ({
    payload: null,
    setPayload: (payload) => set({ payload }),
  }),
);
