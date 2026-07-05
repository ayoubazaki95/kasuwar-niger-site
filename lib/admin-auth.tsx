"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const SESSION_KEY = "kasuwar-admin-session";
const SESSION_EMAIL_KEY = "kasuwar-admin-session-email";
const SESSION_PRIMARY_KEY = "kasuwar-admin-session-primary";

async function sha256Hex(text: string) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

type AdminAuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  isPrimaryAdmin: boolean;
  adminEmail: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPrimaryAdmin, setIsPrimaryAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem(SESSION_KEY) === "true");
    setIsPrimaryAdmin(sessionStorage.getItem(SESSION_PRIMARY_KEY) === "true");
    setAdminEmail(sessionStorage.getItem(SESSION_EMAIL_KEY) || "");
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const trimmedEmail = email.toLowerCase().trim();
    const expectedEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase().trim();
    const expectedHash = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH || "";
    const hash = await sha256Hex(password);

    // Compte admin principal (variables d'environnement)
    if (trimmedEmail === expectedEmail && hash === expectedHash) {
      sessionStorage.setItem(SESSION_KEY, "true");
      sessionStorage.setItem(SESSION_PRIMARY_KEY, "true");
      sessionStorage.setItem(SESSION_EMAIL_KEY, trimmedEmail);
      setIsAuthenticated(true);
      setIsPrimaryAdmin(true);
      setAdminEmail(trimmedEmail);
      return true;
    }

    // Comptes administrateurs supplémentaires (ajoutés depuis /admin/administrateurs)
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem(SESSION_KEY, "true");
        sessionStorage.setItem(SESSION_PRIMARY_KEY, "false");
        sessionStorage.setItem(SESSION_EMAIL_KEY, trimmedEmail);
        setIsAuthenticated(true);
        setIsPrimaryAdmin(false);
        setAdminEmail(trimmedEmail);
        return true;
      }
    } catch {
      /* réseau indisponible, échec silencieux -> retourne false ci-dessous */
    }

    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_PRIMARY_KEY);
    sessionStorage.removeItem(SESSION_EMAIL_KEY);
    setIsAuthenticated(false);
    setIsPrimaryAdmin(false);
    setAdminEmail("");
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, loading, isPrimaryAdmin, adminEmail, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
