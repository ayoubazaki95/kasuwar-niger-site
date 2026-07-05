"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const SESSION_KEY = "kasuwar-vendor-session";
const SESSION_ID_KEY = "kasuwar-vendor-id";
const SESSION_NAME_KEY = "kasuwar-vendor-business-name";

type VendorAuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  vendorId: number | null;
  businessName: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const VendorAuthContext = createContext<VendorAuthContextType | null>(null);

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem(SESSION_KEY) === "true");
    const id = sessionStorage.getItem(SESSION_ID_KEY);
    setVendorId(id ? Number(id) : null);
    setBusinessName(sessionStorage.getItem(SESSION_NAME_KEY) || "");
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/vendor-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem(SESSION_KEY, "true");
        sessionStorage.setItem(SESSION_ID_KEY, String(data.vendorId));
        sessionStorage.setItem(SESSION_NAME_KEY, data.businessName);
        setIsAuthenticated(true);
        setVendorId(data.vendorId);
        setBusinessName(data.businessName);
        return true;
      }
    } catch {
      /* échec réseau -> false ci-dessous */
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem(SESSION_NAME_KEY);
    setIsAuthenticated(false);
    setVendorId(null);
    setBusinessName("");
  };

  return (
    <VendorAuthContext.Provider value={{ isAuthenticated, loading, vendorId, businessName, login, logout }}>
      {children}
    </VendorAuthContext.Provider>
  );
}

export function useVendorAuth() {
  const ctx = useContext(VendorAuthContext);
  if (!ctx) throw new Error("useVendorAuth must be used within VendorAuthProvider");
  return ctx;
}
