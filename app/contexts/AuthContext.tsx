"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/app/lib/roles";

/**
 * DEMO auth so the template runs without a backend: "signing in" stores a fake session in
 * localStorage. Replace login/signOut/the restore effect with the real provider (Supabase,
 * your API's /auth/login + apiClient token refresh…) and keep this shape — the shell
 * (NavigationLayout, SidebarContent, UserMenu, PageHeader) only reads these fields.
 */
interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  userName: string;
  role: string;
  /** True until the stored session has been read — gate redirects on it. */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "demo-session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState<string>(ROLES.GUEST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setUser(s.user);
        setUserName(s.userName);
        setRole(s.role);
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) throw Object.assign(new Error("Credenciales inválidas"), { status: 401 });
    const session = { user: { id: "demo", email }, userName: email.split("@")[0], role: ROLES.ADMIN };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session.user);
    setUserName(session.userName);
    setRole(session.role);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setRole(ROLES.GUEST);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, userName, role, loading, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
