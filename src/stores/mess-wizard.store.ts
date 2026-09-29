import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const WIZARD_STEPS = ["details", "money", "members", "review"] as const;

interface MessWizardState {
  step: number;
  details: { name: string; address: string };
  /** Kept as the strings the inputs hold; the schema coerces them. */
  money: { monthlyRent: string; monthlyDeposit: string };
  memberEmails: string[];
  setStep: (step: number) => void;
  setDetails: (details: MessWizardState["details"]) => void;
  setMoney: (money: MessWizardState["money"]) => void;
  addEmail: (email: string) => void;
  removeEmail: (email: string) => void;
  reset: () => void;
}

const INITIAL = {
  step: 0,
  details: { name: "", address: "" },
  money: { monthlyRent: "", monthlyDeposit: "0" },
  memberEmails: [] as string[],
};

/**
 * The create-mess wizard's draft (B7A7: multi-step form data persistence).
 * Kept in sessionStorage so a reload or a wrong turn doesn't lose four steps
 * of typing; it holds no secrets, and closing the tab clears it. Hydration is
 * manual (`skipHydration`) because the server render has no storage — the
 * wizard calls `persist.rehydrate()` once mounted.
 */
export const useMessWizard = create<MessWizardState>()(
  persist(
    (set) => ({
      ...INITIAL,
      setStep: (step) => set({ step }),
      setDetails: (details) => set({ details }),
      setMoney: (money) => set({ money }),
      addEmail: (email) =>
        set((state) => ({ memberEmails: [...state.memberEmails, email] })),
      removeEmail: (email) =>
        set((state) => ({
          memberEmails: state.memberEmails.filter((each) => each !== email),
        })),
      reset: () => set(INITIAL),
    }),
    {
      name: "messmate-create-mess",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: ({ step, details, money, memberEmails }) => ({
        step,
        details,
        money,
        memberEmails,
      }),
    },
  ),
);
