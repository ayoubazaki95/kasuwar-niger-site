"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const SESSION_KEY = "kasuwar-admin-session";

async function sha256Hex(text: string) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

type AdminAuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem(SESSION_KEY) === "true");
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const expectedEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase().trim();
    const expectedHash = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH || "";
    const hash = await sha256Hex(password);

    const ok = email.toLowerCase().trim() === expectedEmail && hash === expectedHash;
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
