"use client";

import { useCallback, useEffect, useState } from "react";

/* ------------------------------------------------------------------
   Couche de données — parle maintenant à Supabase via les routes API
   (/api/...) au lieu du localStorage du navigateur. Les types et la
   forme des hooks (items, add, update, remove, hydrated) restent
   identiques à avant, pour que le reste du site n'ait rien à changer.
------------------------------------------------------------------- */

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erreur ${res.status}`);
  }
  return res.json();
}

function reportError(context: string, err: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[${context}]`, err);
  if (typeof window !== "undefined") {
    window.alert(`Une erreur est survenue (${context}). Vérifiez la connexion à la base de données dans les Paramètres/variables d'environnement.`);
  }
}

/* ---------------------- Types (inchangés) ---------------------- */

export type Restaurant = {
  id: number;
  name: string;
  tag: string;
  quartier: string;
  rating: number;
  time: string;
  fee: number;
  color: string;
  description?: string;
  images?: string[];
};

export type MenuItem = {
  id: number;
  restaurantId: number;
  name: string;
  desc: string;
  price: number;
  images?: string[];
  vendorId?: number;
  approved?: boolean;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  store: string;
  color: string;
  category?: string;
  description?: string;
  images?: string[];
  vendorId?: number;
  approved?: boolean;
};

export type Driver = {
  id: number;
  name: string;
  phone: string;
  zone: string;
  vehicle: string;
  status: "Disponible" | "En course" | "Hors service";
  images?: string[];
};

export type PressingService = {
  id: number;
  name: string;
  unitPrice: number;
  unitLabel: string;
};

export type Pharmacy = {
  id: number;
  name: string;
  quartier: string;
  distance: string;
  hours: string;
  phone: string;
};

export type OrderItem = {
  name: string;
  qty: number;
  price: number;
  source: string;
};

export type Order = {
  id: number;
  createdAt: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  restaurantNote: string;
  specialInstructions: string;
  invoiceRequested: boolean;
  paymentMethod: "Cash à la livraison" | "Mobile Money";
  items: OrderItem[];
  total: number;
  status: "Nouvelle" | "En préparation" | "En livraison" | "Livrée" | "Annulée";
};

export type Settings = {
  siteName: string;
  tagline: string;
  currency: string;
  baseDeliveryFee: number;
  commissionPercent: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  promoButtonLabel: string;
  promoButtonLink: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  maintenanceMode: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  siteName: "Kasuwar Niger",
  tagline: "E-commerce Marketplace",
  currency: "F CFA",
  baseDeliveryFee: 500,
  commissionPercent: 12,
  primaryColor: "#F5740F",
  secondaryColor: "#129447",
  accentColor: "#F2A93B",
  heroTitle: "-20% sur votre première commande",
  heroSubtitle: "Offre du jour",
  promoButtonLabel: "En profiter",
  promoButtonLink: "/marketplace",
  contactPhone: "",
  contactEmail: "",
  whatsappNumber: "",
  maintenanceMode: false,
};

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ---------------- Conversion camelCase (app) <-> snake_case (base) ---------------- */

const restaurantFromRow = (r: any): Restaurant => ({
  id: r.id, name: r.name, tag: r.tag, quartier: r.quartier, rating: Number(r.rating),
  time: r.time, fee: r.fee, color: r.color, description: r.description || "", images: r.images || [],
});
const restaurantToRow = (r: Partial<Restaurant>) => ({ ...r });

const menuItemFromRow = (r: any): MenuItem => ({
  id: r.id, restaurantId: r.restaurant_id, name: r.name, desc: r.descr, price: r.price, images: r.images || [],
  vendorId: r.vendor_id || undefined, approved: r.approved !== false,
});
const menuItemToRow = (m: Partial<MenuItem>) => {
  const row: any = {};
  if (m.restaurantId !== undefined) row.restaurant_id = m.restaurantId;
  if (m.name !== undefined) row.name = m.name;
  if (m.desc !== undefined) row.descr = m.desc;
  if (m.price !== undefined) row.price = m.price;
  if (m.images !== undefined) row.images = m.images;
  if (m.vendorId !== undefined) row.vendor_id = m.vendorId;
  if (m.approved !== undefined) row.approved = m.approved;
  return row;
};

const productFromRow = (r: any): Product => ({
  id: r.id, name: r.name, price: r.price, store: r.store, color: r.color,
  category: r.category || "", description: r.description || "", images: r.images || [],
  vendorId: r.vendor_id || undefined, approved: r.approved !== false,
});
const productToRow = (p: Partial<Product>) => ({ ...p, vendor_id: p.vendorId, vendorId: undefined });

const driverFromRow = (r: any): Driver => ({
  id: r.id, name: r.name, phone: r.phone, zone: r.zone, vehicle: r.vehicle, status: r.status, images: r.images || [],
});
const driverToRow = (d: Partial<Driver>) => ({ ...d });

const pressingFromRow = (r: any): PressingService => ({
  id: r.id, name: r.name, unitPrice: r.unit_price, unitLabel: r.unit_label,
});
const pressingToRow = (p: Partial<PressingService>) => {
  const row: any = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.unitPrice !== undefined) row.unit_price = p.unitPrice;
  if (p.unitLabel !== undefined) row.unit_label = p.unitLabel;
  return row;
};

const pharmacyFromRow = (r: any): Pharmacy => ({
  id: r.id, name: r.name, quartier: r.quartier, distance: r.distance, hours: r.hours, phone: r.phone,
});
const pharmacyToRow = (p: Partial<Pharmacy>) => ({ ...p });

const orderFromRow = (r: any): Order => ({
  id: r.id, createdAt: r.created_at, userId: r.user_id || undefined, customerName: r.customer_name,
  customerPhone: r.customer_phone, address: r.address, restaurantNote: r.restaurant_note || "",
  specialInstructions: r.special_instructions || "", invoiceRequested: !!r.invoice_requested,
  paymentMethod: r.payment_method, items: r.items || [], total: r.total, status: r.status,
});
const orderToRow = (o: Partial<Order>) => {
  const row: any = {};
  if (o.customerName !== undefined) row.customer_name = o.customerName;
  if (o.customerPhone !== undefined) row.customer_phone = o.customerPhone;
  if (o.address !== undefined) row.address = o.address;
  if (o.restaurantNote !== undefined) row.restaurant_note = o.restaurantNote;
  if (o.specialInstructions !== undefined) row.special_instructions = o.specialInstructions;
  if (o.invoiceRequested !== undefined) row.invoice_requested = o.invoiceRequested;
  if (o.paymentMethod !== undefined) row.payment_method = o.paymentMethod;
  if (o.items !== undefined) row.items = o.items;
  if (o.total !== undefined) row.total = o.total;
  if (o.status !== undefined) row.status = o.status;
  if (o.userId !== undefined) row.user_id = o.userId;
  return row;
};

const settingsFromRow = (r: any): Settings => ({
  siteName: r.site_name, tagline: r.tagline, currency: r.currency, baseDeliveryFee: r.base_delivery_fee,
  commissionPercent: r.commission_percent, primaryColor: r.primary_color, secondaryColor: r.secondary_color,
  accentColor: r.accent_color, heroTitle: r.hero_title, heroSubtitle: r.hero_subtitle,
  promoButtonLabel: r.promo_button_label, promoButtonLink: r.promo_button_link || "/marketplace", contactPhone: r.contact_phone || "", contactEmail: r.contact_email || "",
  whatsappNumber: r.whatsapp_number || "", maintenanceMode: !!r.maintenance_mode,
});
const settingsToRow = (s: Settings) => ({
  site_name: s.siteName, tagline: s.tagline, currency: s.currency, base_delivery_fee: s.baseDeliveryFee,
  commission_percent: s.commissionPercent, primary_color: s.primaryColor, secondary_color: s.secondaryColor,
  accent_color: s.accentColor, hero_title: s.heroTitle, hero_subtitle: s.heroSubtitle,
  promo_button_label: s.promoButtonLabel, promo_button_link: s.promoButtonLink, contact_phone: s.contactPhone, contact_email: s.contactEmail,
  whatsapp_number: s.whatsappNumber, maintenance_mode: s.maintenanceMode,
});

/* ---------------- Hook générique par collection ---------------- */

function useCollection<T extends { id: number }>(
  endpoint: string,
  fromRow: (r: any) => T,
  toRow: (t: any) => any,
  querySuffix = ""
) {
  const [items, setItems] = useState<T[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<{ items: any[] }>(`/api/${endpoint}${querySuffix}`)
      .then((res) => {
        if (cancelled) return;
        setItems(res.items.map(fromRow));
      })
      .catch((err) => reportError(endpoint, err))
      .finally(() => !cancelled && setHydrated(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = useCallback(
    async (item: Omit<T, "id">) => {
      try {
        const res = await api<{ item: any }>(`/api/${endpoint}`, { method: "POST", body: JSON.stringify(toRow(item)) });
        setItems((prev) => [...prev, fromRow(res.item)]);
      } catch (err) {
        reportError(`${endpoint}:add`, err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const update = useCallback(
    async (id: number, patch: Partial<T>) => {
      try {
        await api(`/api/${endpoint}/${id}`, { method: "PUT", body: JSON.stringify(toRow(patch)) });
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
      } catch (err) {
        reportError(`${endpoint}:update`, err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const remove = useCallback(async (id: number) => {
    try {
      await api(`/api/${endpoint}/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      reportError(`${endpoint}:remove`, err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, add, update, remove, hydrated };
}

export function useRestaurants() {
  return useCollection<Restaurant>("restaurants", restaurantFromRow, restaurantToRow);
}
export function useMenuItems(includeAll = false) {
  return useCollection<MenuItem>("menu-items", menuItemFromRow, menuItemToRow, includeAll ? "?all=1" : "");
}
export function useProducts(includeAll = false) {
  return useCollection<Product>("products", productFromRow, productToRow, includeAll ? "?all=1" : "");
}
export function useDrivers() {
  return useCollection<Driver>("drivers", driverFromRow, driverToRow);
}
export function usePressingServices() {
  return useCollection<PressingService>("pressing", pressingFromRow, pressingToRow);
}
export function usePharmacies() {
  return useCollection<Pharmacy>("pharmacies", pharmacyFromRow, pharmacyToRow);
}
export function useOrders() {
  return useCollection<Order>("orders", orderFromRow, orderToRow);
}

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    api<{ item: any }>("/api/settings")
      .then((res) => setSettingsState(settingsFromRow(res.item)))
      .catch((err) => reportError("settings", err))
      .finally(() => setHydrated(true));
  }, []);

  const setSettings = useCallback((s: Settings) => {
    setSettingsState(s);
    api("/api/settings", { method: "PUT", body: JSON.stringify(settingsToRow(s)) }).catch((err) =>
      reportError("settings:update", err)
    );
  }, []);

  return { settings, setSettings, hydrated };
}
