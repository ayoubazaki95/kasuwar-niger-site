-- Migration à exécuter UNE FOIS dans Supabase (SQL Editor -> New query -> Run)
-- si vous avez déjà exécuté schema.sql une première fois auparavant.
-- Sans danger de le relancer plusieurs fois (tout est protégé par IF NOT EXISTS).

alter table settings add column if not exists promo_button_link text default '/marketplace';

create table if not exists admin_accounts (
  id bigint generated always as identity primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

-- Comptes vendeurs : peuvent ajouter des produits/plats, qui restent "en attente"
-- jusqu'à validation par un administrateur (colonne "approved").
create table if not exists vendor_accounts (
  id bigint generated always as identity primary key,
  email text unique not null,
  password_hash text not null,
  business_name text not null,
  created_at timestamptz default now()
);

alter table products add column if not exists vendor_id bigint references vendor_accounts(id) on delete set null;
alter table products add column if not exists approved boolean default true;
update products set approved = true where approved is null;

alter table menu_items add column if not exists vendor_id bigint references vendor_accounts(id) on delete set null;
alter table menu_items add column if not exists approved boolean default true;
update menu_items set approved = true where approved is null;
