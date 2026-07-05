# Kasuwar Niger — Site web (Next.js)

Application web mobile-first pour Kasuwar Niger : restaurants, marketplace, pressing, livraison de colis, pharmacies de garde, et un tableau de bord administrateur.

## Ce qui est inclus (prêt à l'emploi)

- Site Next.js 14 complet, navigable, responsive (App Router + TypeScript + Tailwind CSS)
- Pages publiques : Accueil, Restaurants (liste + détail + menu), Marketplace (liste + fiche produit), Pressing (réservation), Livraison de colis (suivi simulé), Pharmacies de garde (appel + itinéraire Google Maps fonctionnels), Panier (persistant), Compte, Commandes
- **Tableau de bord admin** (`/admin`) : gestion des restaurants, plats, produits marketplace, livreurs, et paramètres du site — voir section dédiée plus bas
- Identité visuelle dérivée du logo (orange `#F5740F`, vert `#129447`, or `#F2A93B`)

Ce site fonctionne réellement dans le navigateur (panier, navigation, formulaires, admin) — mais avec des **données stockées localement dans le navigateur**, sans base de données partagée ni paiement réel. Voir "Ce qu'il manque" plus bas.

## Installation locale

Prérequis : [Node.js](https://nodejs.org) 18 ou plus récent.

```bash
npm install
npm run dev
```

Ouvrez http://localhost:3000 (site public) et http://localhost:3000/admin (tableau de bord).

## Tableau de bord administrateur

Accessible sur **`/admin`** (redirige vers `/admin/login` si non connecté).

Identifiants : définis dans `.env.local` (déjà configuré avec l'email que vous avez fourni — voir l'avertissement de sécurité ci-dessous).

Fonctionnalités :
- **Restaurants & plats** — ajouter/modifier/supprimer un restaurant, ajouter des plats à son menu
- **Produits (marketplace)** — ajouter/modifier/supprimer des articles
- **Livreurs** — ajouter/modifier/supprimer, statut (disponible / en course / hors service)
- **Paramètres** — nom du site, devise, frais de livraison de base, commission, couleurs, **mode maintenance** (fonctionnel : activez-le et rechargez le site public dans le même navigateur pour le tester)

Les restaurants et produits ajoutés dans l'admin **apparaissent immédiatement sur le site public**, dans ce même navigateur (accueil, listes, pages de détail) — les deux lisent les mêmes données.

### ⚠️ Important — sécurité et limites de ce tableau de bord

- Les données du site (restaurants, plats, produits, livreurs, pressing, pharmacies, commandes, paramètres) sont stockées dans une **vraie base de données partagée (Supabase/PostgreSQL)** — visibles par tous vos visiteurs, pas seulement dans votre navigateur.
- Les **comptes clients** (inscription/connexion) utilisent l'authentification Supabase, avec mots de passe hashés correctement côté serveur.
- La connexion `/admin/login` (tableau de bord admin) reste une vérification **côté navigateur** (email + hash du mot de passe), séparée des comptes clients. Suffisante si vous gardez le lien `/admin` privé, mais changez ce mot de passe avant un usage public à grande échelle et gardez à l'esprit qu'une personne inspectant le code source pourrait techniquement la contourner.
- Le mot de passe a été partagé en clair dans notre conversation : **changez-le** avant toute mise en ligne réelle destinée au public (voir `.env.local.example` pour générer un nouveau hash), et ne committez jamais `.env.local` sur GitHub (déjà exclu via `.gitignore`).
- Pour un vrai back-office sécurisé, partagé entre tous les utilisateurs et connecté aux commandes réelles, il faut un backend avec authentification serveur et base de données — voir le tableau plus bas.

## Déploiement sur **www.kassuwarniger.com** (hébergement LWS)

Il y a deux façons d'obtenir un site fonctionnel sur votre nom de domaine LWS. La première est plus simple et plus fiable pour une application Next.js ; la seconde utilise directement l'hébergement mutualisé LWS.

### Option A — Recommandée : domaine chez LWS, hébergement de l'application sur Vercel

Next.js est développé par Vercel, et leur hébergement gratuit est optimisé spécifiquement pour ce framework (déploiement en un clic, HTTPS automatique, aucune configuration serveur). Vous gardez votre domaine chez LWS et pointez simplement son DNS vers Vercel :

1. Poussez ce code sur un dépôt GitHub (`git init && git add . && git commit -m "init"`, puis créez un dépôt sur GitHub et poussez-y)
2. Sur [vercel.com](https://vercel.com), importez ce dépôt (Vercel détecte Next.js automatiquement, aucun réglage à changer)
3. Dans les paramètres du projet Vercel, ajoutez les variables d'environnement `NEXT_PUBLIC_ADMIN_EMAIL` et `NEXT_PUBLIC_ADMIN_PASSWORD_HASH` (valeurs dans votre `.env.local`)
4. Une fois déployé, allez dans Vercel → Project Settings → Domains → ajoutez `www.kassuwarniger.com`
5. Vercel vous donne des enregistrements DNS (en général un CNAME) à ajouter. Connectez-vous à votre espace client LWS → gestion de domaine → zone DNS → ajoutez cet enregistrement
6. Propagation DNS : 10 minutes à quelques heures. Votre site est ensuite accessible sur `www.kassuwarniger.com`, avec HTTPS automatique, hébergé par l'infrastructure de Vercel

C'est l'option la plus simple à maintenir dans la durée (mises à jour du code = un simple `git push`).

### Option B — Hébergement directement sur LWS (cPanel Node.js App Manager)

LWS propose un gestionnaire d'applications Node.js dans cPanel, mais uniquement sur les formules **cPanel L, XL, 2XL, 3XL ou CloudCP** (pas sur l'offre mutualisée de base). Le déploiement de Next.js y est possible mais plus manuel qu'avec Vercel :

1. Vérifiez que votre formule LWS inclut le gestionnaire Node.js (espace client LWS → cPanel → section "Setup Node.js App"). Si votre offre ne l'inclut pas, contactez le support LWS pour vérifier une mise à niveau, ou utilisez l'option A ci-dessus
2. Dans cPanel → **Setup Node.js App** → créer une application :
   - Version Node.js : choisissez 18 ou plus récent
   - Dossier de l'application (ex : `kassuwarniger`)
   - Domaine : `www.kassuwarniger.com`
   - Fichier de démarrage : `server.js` (voir ci-dessous)
3. Ce projet utilise le App Router de Next.js en mode SSR standard, qui nécessite un petit serveur Node personnalisé pour fonctionner sous Passenger (le système utilisé par LWS pour faire tourner Node.js derrière Apache). Créez un fichier `server.js` à la racine du projet :
   ```js
   const { createServer } = require("http");
   const next = require("next");
   const app = next({ dev: false });
   const handle = app.getRequestHandler();
   app.prepare().then(() => {
     createServer((req, res) => handle(req, res)).listen(process.env.PORT || 3000);
   });
   ```
4. Envoyez les fichiers du projet via le gestionnaire de fichiers cPanel ou FTP (excluez `node_modules` et `.next`, ils seront générés sur le serveur)
5. Dans le terminal cPanel (ou via SSH), placez-vous dans le dossier de l'application puis :
   ```bash
   npm install
   npm run build
   ```
6. Dans l'interface "Setup Node.js App", ajoutez les variables d'environnement `NEXT_PUBLIC_ADMIN_EMAIL` et `NEXT_PUBLIC_ADMIN_PASSWORD_HASH`, puis démarrez (ou redémarrez) l'application
7. Si une étape bloque (erreurs de permissions, port, ou build), l'assistance technique LWS peut vérifier la configuration Node.js — c'est un scénario qu'ils prennent en charge

Cette option garde tout chez LWS, mais demande davantage de manipulation technique et de suivi (mises à jour = re-upload + rebuild manuel).

## Ce qu'il manque pour une plateforme réellement opérationnelle

Ce site est un **front-end fonctionnel et déployable**, avec un admin qui fonctionne réellement dans le navigateur — mais ce n'est pas encore une plateforme transactionnelle complète partagée entre tous vos utilisateurs. Pour que les commandes, paiements et données admin soient réels et visibles par tous vos clients, il faut construire en plus :

| Brique | Description | Pourquoi ce n'est pas encore inclus |
|---|---|---|
| **Backend + base de données** | API (NestJS), base PostgreSQL pour utilisateurs, commandes, produits, restaurants | Nécessite un serveur hébergé (Railway, Render, VPS) et une base de données réelle — pas générable comme simple fichier statique |
| **Authentification serveur** | Connexion admin réellement sécurisée + comptes clients, vendeurs, restaurants, livreurs | Nécessite le backend ci-dessus + gestion sécurisée des sessions/JWT |
| **Paiement réel** | Orange Money, Moov Money, Airtel Money, carte | Nécessite un compte marchand actif chez chaque opérateur et leurs clés API, que vous seul pouvez obtenir |
| **Synchronisation admin ↔ clients** | Que vos restaurants/produits ajoutés soient visibles par tous les visiteurs, pas seulement dans votre navigateur | Nécessite la base de données ci-dessus |
| **Notifications** | SMS, WhatsApp, Push | Nécessite un compte chez un fournisseur (Twilio, Termii, etc.) |
| **Carte interactive réelle** | Géolocalisation, calcul de distance/prix dynamique | Nécessite une clé API Google Maps ou Mapbox |

**Suggestion de prochaine étape concrète** : construire l'API backend (schéma de base de données + endpoints) pour connecter d'abord le module Restaurants, afin que vos ajouts dans `/admin` deviennent visibles par tous vos clients — avant d'étendre aux autres modules.

## Structure du projet

```
app/
  (site)/              routes publiques du site
    page.tsx            accueil
    restaurants/         liste + [id] détail/menu
    marketplace/         liste + [id] fiche produit
    pressing/            réservation
    delivery/            livraison de colis
    pharmacies/          pharmacies de garde
    cart/                panier
    account/             compte
    orders/              commandes
    layout.tsx           layout public (header, nav, panier, gate de maintenance)
  (admin)/
    admin/               tableau de bord (login, restaurants, produits, livreurs, paramètres)
    layout.tsx           layout admin (sidebar, protection par authentification)
components/             Header, BottomNav, Logo, MaintenanceGate, éléments UI partagés
lib/
  admin-store.tsx       données du site (restaurants, plats, produits, livreurs, pressing, pharmacies, commandes, paramètres) — via Supabase
  admin-auth.tsx        authentification du tableau de bord admin (email + hash du mot de passe)
  customer-auth.tsx     comptes clients (inscription/connexion) — via Supabase Auth
  supabase-admin.ts     client Supabase côté serveur (clé secrète, routes API uniquement)
  supabase-browser.ts   client Supabase côté navigateur (clé publique, comptes clients)
  cart-context.tsx      état du panier client — localStorage (propre à chaque appareil, normal)
app/api/                routes API (restaurants, produits, plats, livreurs, pressing, pharmacies, commandes, paramètres)
db/schema.sql           schéma complet à exécuter dans Supabase (SQL Editor)
  data.ts               données de démonstration pour les pharmacies
```
