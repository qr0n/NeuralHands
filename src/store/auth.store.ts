import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = { id: string; email: string } | null;

type AuthState = {
  user: User;
  login: (u: NonNullable<User>) => void;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (u) => set({ user: u }),
      logout: () => set({ user: null }),
      register: async (email: string, _password: string) => {
        // TODO: replace with real API call POST /auth/register
        set({ user: { id: "demo", email } });
      },
    }),
    { name: "nh-auth" }
  )
);
