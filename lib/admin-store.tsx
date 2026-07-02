"use client";

import { useCallback, useEffect, useState } from "react";

/* ------------------------------------------------------------------
   Lightweight client-side "database": each collection is synced to
   its own localStorage key. No backend — see README "Sécurité" section.
------------------------------------------------------------------- */

export type Restaurant = {
  id: number;
  name: string;
  tag: string;
  quartier: string;
  rating: number;
  time: string;
  fee: number;
  color: string;
};

export type MenuItem = {
  id: number;
  restaurantId: number;
  name: string;
  desc: string;
  price: number;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  store: string;
  color: string;
};

export type Driver = {
  id: number;
  name: string;
  phone: string;
  zone: string;
  vehicle: string;
  status: "Disponible" | "En course" | "Hors service";
};

export type Settings = {
  siteName: string;
  currency: string;
  baseDeliveryFee: number;
  commissionPercent: number;
  primaryColor: string;
  secondaryColor: string;
  maintenanceMode: boolean;
};

export const DEFAULT_RESTAURANTS: Restaurant[] = [
  { id: 1, name: "Chez Mariama", tag: "Tô • Riz au gras • Sauce", quartier: "Plateau", rating: 4.8, time: "20-30 min", fee: 500, color: "from-orange to-orange-dark" },
  { id: 2, name: "Le Sahel Grill", tag: "Brochettes • Grillades", quartier: "Yantala", rating: 4.6, time: "25-35 min", fee: 700, color: "from-green to-green-dark" },
  { id: 3, name: "Bissap & Co", tag: "Jus naturels • Snacks", quartier: "Terminus", rating: 4.9, time: "15-25 min", fee: 400, color: "from-gold to-orange-dark" },
  { id: 4, name: "Niamey Saveurs", tag: "Thiéboudienne • Attiéké", quartier: "Boukoki", rating: 4.5, time: "30-40 min", fee: 600, color: "from-ink to-inkSoft" },
];

export const DEFAULT_MENU: MenuItem[] = [
  { id: 1, restaurantId: 1, name: "Riz au gras + viande", desc: "Riz parfumé, sauce tomate, bœuf braisé", price: 2500 },
  { id: 2, restaurantId: 1, name: "Tô + sauce gombo", desc: "Pâte de mil, sauce gombo et poisson fumé", price: 1800 },
  { id: 3, restaurantId: 2, name: "Brochettes de bœuf (x5)", desc: "Marinées, grillées au charbon de bois", price: 2000 },
  { id: 4, restaurantId: 3, name: "Jus de bissap", desc: "Hibiscus frais, glaçons, menthe", price: 700 },
];

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: "Pagne Bazin Riche", price: 18000, store: "Boutique Aïssa", color: "from-green to-ink" },
  { id: 2, name: "Sandales en cuir", price: 9500, store: "Atelier Boukoki", color: "from-orange to-gold" },
  { id: 3, name: "Sac à main tressé", price: 12000, store: "Niamey Craft", color: "from-ink to-inkSoft" },
  { id: 4, name: "Théière artisanale", price: 7000, store: "Marché Katako", color: "from-gold to-green" },
];

export const DEFAULT_DRIVERS: Driver[] = [
  { id: 1, name: "Souleymane Idi", phone: "+227 96 11 22 33", zone: "Plateau / Terminus", vehicle: "Moto", status: "Disponible" },
  { id: 2, name: "Hamissou Boubacar", phone: "+227 96 44 55 66", zone: "Yantala / Boukoki", vehicle: "Moto", status: "Hors service" },
];

export const DEFAULT_SETTINGS: Settings = {
  siteName: "Kasuwar Niger",
  currency: "F CFA",
  baseDeliveryFee: 500,
  commissionPercent: 12,
  primaryColor: "#F5740F",
  secondaryColor: "#129447",
  maintenanceMode: false,
};

function useLocalCollection<T extends { id: number }>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* fall back to seed */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      /* storage full or unavailable */
    }
  }, [items, hydrated, key]);

  const add = useCallback((item: Omit<T, "id">) => {
    setItems((prev) => {
      const id = prev.reduce((max, i) => Math.max(max, i.id), 0) + 1;
      return [...prev, { ...item, id } as T];
    });
  }, []);

  const update = useCallback((id: number, patch: Partial<T>) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return { items, add, update, remove, hydrated };
}

export function useRestaurants() {
  return useLocalCollection<Restaurant>("kasuwar-admin-restaurants", DEFAULT_RESTAURANTS);
}

export function useMenuItems() {
  return useLocalCollection<MenuItem>("kasuwar-admin-menu", DEFAULT_MENU);
}

export function useProducts() {
  return useLocalCollection<Product>("kasuwar-admin-products", DEFAULT_PRODUCTS);
}

export function useDrivers() {
  return useLocalCollection<Driver>("kasuwar-admin-drivers", DEFAULT_DRIVERS);
}

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kasuwar-admin-settings");
      if (raw) setSettingsState({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {
      /* fall back to defaults */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("kasuwar-admin-settings", JSON.stringify(settings));
    } catch {
      /* storage full or unavailable */
    }
  }, [settings, hydrated]);

  const setSettings = (s: Settings) => setSettingsState(s);

  return { settings, setSettings, hydrated };
}
