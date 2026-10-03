import { create } from "zustand";

interface CrumbState {
  label: string | null;
  setLabel: (label: string | null) => void;
}

export const useCrumbStore = create<CrumbState>((set) => ({
  label: null,
  setLabel: (label) => set({ label }),
}));
