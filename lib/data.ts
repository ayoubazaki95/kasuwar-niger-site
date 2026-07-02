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

export type MenuItem = { id: number; name: string; desc: string; price: number };

export type Product = { id: number; name: string; price: number; store: string; color: string };

export type Pharmacy = {
  id: number;
  name: string;
  quartier: string;
  distance: string;
  hours: string;
  phone: string;
};

export const RESTAURANTS: Restaurant[] = [
  { id: 1, name: "Chez Mariama", tag: "Tô • Riz au gras • Sauce", quartier: "Plateau", rating: 4.8, time: "20-30 min", fee: 500, color: "from-orange to-orange-dark" },
  { id: 2, name: "Le Sahel Grill", tag: "Brochettes • Grillades", quartier: "Yantala", rating: 4.6, time: "25-35 min", fee: 700, color: "from-green to-green-dark" },
  { id: 3, name: "Bissap & Co", tag: "Jus naturels • Snacks", quartier: "Terminus", rating: 4.9, time: "15-25 min", fee: 400, color: "from-gold to-orange-dark" },
  { id: 4, name: "Niamey Saveurs", tag: "Thiéboudienne • Attiéké", quartier: "Boukoki", rating: 4.5, time: "30-40 min", fee: 600, color: "from-ink to-inkSoft" },
];

export const MENU: MenuItem[] = [
  { id: 1, name: "Riz au gras + viande", desc: "Riz parfumé, sauce tomate, bœuf braisé", price: 2500 },
  { id: 2, name: "Tô + sauce gombo", desc: "Pâte de mil, sauce gombo et poisson fumé", price: 1800 },
  { id: 3, name: "Brochettes de bœuf (x5)", desc: "Marinées, grillées au charbon de bois", price: 2000 },
  { id: 4, name: "Jus de bissap", desc: "Hibiscus frais, glaçons, menthe", price: 700 },
];

export const PRODUCTS: Product[] = [
  { id: 1, name: "Pagne Bazin Riche", price: 18000, store: "Boutique Aïssa", color: "from-green to-ink" },
  { id: 2, name: "Sandales en cuir", price: 9500, store: "Atelier Boukoki", color: "from-orange to-gold" },
  { id: 3, name: "Sac à main tressé", price: 12000, store: "Niamey Craft", color: "from-ink to-inkSoft" },
  { id: 4, name: "Théière artisanale", price: 7000, store: "Marché Katako", color: "from-gold to-green" },
];

export const PHARMACIES: Pharmacy[] = [
  { id: 1, name: "Pharmacie du Plateau", quartier: "Plateau, près du Grand Marché", distance: "1.2 km", hours: "Garde 24h", phone: "+22790000001" },
  { id: 2, name: "Pharmacie Yantala", quartier: "Yantala, Avenue de la Liberté", distance: "2.4 km", hours: "Garde jusqu'à 7h", phone: "+22790000002" },
  { id: 3, name: "Pharmacie Terminus", quartier: "Terminus, face station", distance: "3.1 km", hours: "Garde 24h", phone: "+22790000003" },
];
