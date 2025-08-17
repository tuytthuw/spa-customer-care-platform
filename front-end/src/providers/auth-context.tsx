"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "ADMIN" | "RECEPTION" | "TECH" | "CLIENT";
export type User = { id: string; name: string; email: string; role: Role };

type AuthCtx = {
  user: User | null;
  registerClient: (p: { name: string; email: string }) => void;
  loginAs: (role: Role) => void; // tiện test
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const LS_KEY = "spa_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) localStorage.setItem(LS_KEY, JSON.stringify(user));
    else localStorage.removeItem(LS_KEY);
  }, [user]);

  const api = useMemo<AuthCtx>(
    () => ({
      user,
      registerClient: ({ name, email }) => {
        const u: User = {
          id: crypto.randomUUID(),
          name,
          email,
          role: "CLIENT",
        };
        setUser(u);
      },
      loginAs: (role: Role) => {
        const u: User = {
          id: "dev",
          name: "Dev",
          email: `${role.toLowerCase()}@demo`,
          role,
        };
        setUser(u);
      },
      logout: () => setUser(null),
    }),
    [user]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
