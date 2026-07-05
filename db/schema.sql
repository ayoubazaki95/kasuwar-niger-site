-- Schéma Kasuwar Niger — à exécuter dans Supabase : Dashboard → SQL Editor → New query → coller → Run

create table if not exists restaurants (
  id bigint generated always as identity primary key,
  name text not null,
  tag text default '',
  quartier text default '',
  rating numeric(2,1) default 4.5,
  time text default '',
  fee integer default 0,
  color text default 'from-orange to-orange-dark',
  description text default '',
  images jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists menu_items (
  id bigint generated always as identity primary key,
  restaurant_id bigint references restaurants(id) on delete cascade,
  name text not null,
  descr text default '',
  price integer default 0,
  images jsonb default '[]'
);

create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  price integer default 0,
  store text default '',
  color text default 'from-green to-ink',
  category text default '',
  description text default '',
  images jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists drivers (
  id bigint generated always as identity primary key,
  name text not null,
  phone text default '',
  zone text default '',
  vehicle text default 'Moto',
  status text default 'Disponible',
  images jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists pressing_services (
  id bigint generated always as identity primary key,
  name text not null,
  unit_price integer default 0,
  unit_label text default 'F/pièce'
);

create table if not exists pharmacies (
  id bigint generated always as identity primary key,
  name text not null,
  quartier text default '',
  distance text default '',
  hours text default 'Garde 24h',
  phone text default ''
);

create table if not exists orders (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  address text default '',
  restaurant_note text default '',
  special_instructions text default '',
  invoice_requested boolean default false,
  payment_method text default 'Cash à la livraison',
  items jsonb default '[]',
  total integer default 0,
  status text default 'Nouvelle'
);

create table if not exists settings (
  id integer primary key default 1,
  site_name text default 'Kasuwar Niger',
  tagline text default 'E-commerce Marketplace',
  currency text default 'F CFA',
  base_delivery_fee integer default 500,
  commission_percent integer default 12,
  primary_color text default '#F5740F',
  secondary_color text default '#129447',
  accent_color text default '#F2A93B',
  hero_title text default '-20% sur votre première commande',
  hero_subtitle text default 'Offre du jour',
  promo_button_label text default 'En profiter',
  contact_phone text default '',
  contact_email text default '',
  whatsapp_number text default '',
  maintenance_mode boolean default false,
  constraint single_row check (id = 1)
);
insert into settings (id) values (1) on conflict (id) do nothing;

-- Comptes clients : Supabase gère déjà l'authentification (table auth.users, mots de
-- passe hashés, sessions). Cette table ajoute juste les informations supplémentaires
-- (téléphone, adresse) liées à chaque compte.
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text default '',
  phone text default '',
  address text default '',
  created_at timestamptz default now()
);

-- Crée automatiquement une ligne "profiles" à chaque inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sécurité (RLS) : les clients ne voient/modifient que leur propre profil et leurs
-- propres commandes ; les tables catalogue restent lisibles publiquement (le site les
-- affiche à tous), écriture réservée au serveur (clé service_role, utilisée par l'admin).
alter table profiles enable row level security;
create policy "Lecture de son propre profil" on profiles for select using (auth.uid() = id);
create policy "Modification de son propre profil" on profiles for update using (auth.uid() = id);

alter table orders enable row level security;
create policy "Un client voit ses propres commandes" on orders for select using (auth.uid() = user_id);
create policy "Un client peut créer une commande" on orders for insert with check (true);

alter table restaurants enable row level security;
create policy "Lecture publique des restaurants" on restaurants for select using (true);
alter table menu_items enable row level security;
create policy "Lecture publique des plats" on menu_items for select using (true);
alter table products enable row level security;
create policy "Lecture publique des produits" on products for select using (true);
alter table drivers enable row level security;
create policy "Lecture publique des livreurs" on drivers for select using (true);
alter table pressing_services enable row level security;
create policy "Lecture publique du pressing" on pressing_services for select using (true);
alter table pharmacies enable row level security;
create policy "Lecture publique des pharmacies" on pharmacies for select using (true);
alter table settings enable row level security;
create policy "Lecture publique des paramètres" on settings for select using (true);

-- Données de démonstration (modifiable/supprimable depuis l'admin ensuite)
insert into restaurants (name, tag, quartier, rating, time, fee, color, description) values
('Chez Mariama', 'Tô • Riz au gras • Sauce', 'Plateau', 4.8, '20-30 min', 500, 'from-orange to-orange-dark', 'Cuisine nigérienne traditionnelle.'),
('Le Sahel Grill', 'Brochettes • Grillades', 'Yantala', 4.6, '25-35 min', 700, 'from-green to-green-dark', 'Grillades au charbon de bois.');

insert into menu_items (restaurant_id, name, descr, price) values
(1, 'Riz au gras + viande', 'Riz parfumé, sauce tomate, bœuf braisé', 2500),
(1, 'Tô + sauce gombo', 'Pâte de mil, sauce gombo et poisson fumé', 1800),
(2, 'Brochettes de bœuf (x5)', 'Marinées, grillées au charbon de bois', 2000);

insert into products (name, price, store, color, category, description) values
('Pagne Bazin Riche', 18000, 'Boutique Aïssa', 'from-green to-ink', 'Mode', 'Tissu bazin riche de qualité.'),
('Sandales en cuir', 9500, 'Atelier Boukoki', 'from-orange to-gold', 'Mode', 'Cuir véritable, fabrication artisanale.');

insert into pressing_services (name, unit_price, unit_label) values
('Lavage standard', 800, 'F/pièce'),
('Nettoyage à sec', 1500, 'F/pièce');

insert into pharmacies (name, quartier, distance, hours, phone) values
('Pharmacie du Plateau', 'Plateau, près du Grand Marché', '1.2 km', 'Garde 24h', '+22790000001');
