import { create } from "zustand";

interface CrumbState {
  /** The last breadcrumb on a detail page — a user's name, a month. */
  label: string | null;
  setLabel: (label: string | null) => void;
}

export const useCrumbStore = create<CrumbState>((set) => ({
  label: null,
  setLabel: (label) => set({ label }),
}));
