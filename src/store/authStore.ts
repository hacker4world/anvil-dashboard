import { Account } from "@/models/Account.model";
import { create } from "zustand";

export interface AuthState {
  account: Account | null;
  token: string | null;
  setAuth: (account: Account, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  account: null,
  token: null,

  setAuth: (account: Account, token: string) => {
    set({ account, token });
  },

  clearAuth: () => {
    set({ account: null, token: null });
  },
}));
