# Guide d'installation et de configuration — Kasuwar Niger

Ce guide vous accompagne pas à pas : de l'installation sur votre ordinateur jusqu'à la mise en ligne sur **www.kassuwarniger.com**.

---

## 1. Prérequis

Avant de commencer, installez ces outils sur votre ordinateur (une seule fois) :

| Outil | Pourquoi | Où le télécharger |
|---|---|---|
| **Node.js** (version 18 ou plus récente) | Fait tourner le site en local | [nodejs.org](https://nodejs.org) — choisissez la version "LTS" |
| **Un éditeur de code** (optionnel mais utile) | Pour modifier le contenu (textes, prix, couleurs) | [Visual Studio Code](https://code.visualstudio.com) (gratuit) |
| **Un compte GitHub** | Pour héberger votre code et le déployer | [github.com](https://github.com) (gratuit) |
| **Un compte Vercel** | Pour héberger le site en ligne | [vercel.com](https://vercel.com) (gratuit, connectez-vous avec GitHub) |

Pour vérifier que Node.js est bien installé, ouvrez un terminal et tapez :

```bash
node --version
```

Vous devez voir un numéro de version commençant par 18, 20, 22 ou plus.

---

## 2. Installation locale (sur votre ordinateur)

### Étape 1 — Extraire le projet

Décompressez le fichier `kasuwar-niger-site.zip` que je vous ai fourni, dans un dossier de votre choix (par exemple votre Bureau).

### Étape 2 — Ouvrir un terminal dans le dossier

- **Windows** : ouvrez le dossier extrait, faites un clic droit dans un espace vide → "Ouvrir dans le terminal"
- **Mac** : ouvrez le Terminal, tapez `cd ` (avec un espace), puis glissez le dossier dans la fenêtre, et appuyez sur Entrée

### Étape 3 — Installer les dépendances

```bash
npm install
```

Cette commande télécharge tout ce dont le site a besoin pour fonctionner (patientez 1 à 2 minutes).

### Étape 4 — Créer le fichier de configuration des identifiants admin

À la racine du projet (à côté de `package.json`), créez un fichier nommé exactement **`.env.local`** et collez-y ce contenu :

```
NEXT_PUBLIC_ADMIN_EMAIL=ayoubazaki@gmail.com
NEXT_PUBLIC_ADMIN_PASSWORD_HASH=a16141e04b8d0b6f9e9c1d98e795d717a3151f18ee2157260f6d2204c41ac184
```

> Ce fichier n'est pas inclus dans le zip pour ne pas faire circuler vos identifiants. Le mot de passe n'est jamais stocké en clair — seule son empreinte (hash) l'est. Voir la section 6 pour changer ce mot de passe.

### Étape 5 — Lancer le site en local

```bash
npm run dev
```

Ouvrez votre navigateur sur :
- **http://localhost:3000** → le site public
- **http://localhost:3000/admin** → le tableau de bord admin

Pour arrêter le site, revenez au terminal et appuyez sur `Ctrl + C`.

---

## 3. Configuration du tableau de bord admin

Connectez-vous sur `/admin` avec :
- Email : `ayoubazaki@gmail.com`
- Mot de passe : celui que vous m'avez communiqué

Une fois connecté, vous avez 4 sections :

### Restaurants & plats
- **"Nouveau restaurant"** : renseignez nom, quartier, spécialités, temps de livraison, frais de livraison → Enregistrer
- Sur chaque restaurant déjà créé, cliquez **"Ajouter un plat"** pour construire son menu (nom, description, prix)
- L'icône crayon modifie une fiche, l'icône poubelle la supprime

### Produits (marketplace)
- **"Nouvel article"** : nom, boutique/vendeur, prix → Enregistrer

### Livreurs
- **"Nouveau livreur"** : nom, téléphone, zone de livraison, véhicule, statut (Disponible / En course / Hors service)

### Paramètres
- Nom du site, devise, frais de livraison de base, commission vendeurs
- Couleurs principale/secondaire (enregistrées comme configuration ; les appliquer visuellement à tout le site demande une étape de développement supplémentaire)
- **Mode maintenance** : activez-le pour afficher une page "Site en maintenance" aux visiteurs — utile pendant que vous préparez votre lancement. Rechargez le site public pour voir l'effet.

> **Rappel important** : tout ce que vous ajoutez ici est enregistré dans le navigateur que vous utilisez (technique appelée `localStorage`), pas sur un serveur central. Vos clients ne verront pas ces changements sur leur propre téléphone tant qu'il n'y a pas de vraie base de données connectée. C'est idéal pour préparer et valider votre catalogue avant le vrai lancement, mais gardez cette limite en tête — voir section 7.

---

## 4. Mise en ligne (déploiement)

### Étape 1 — Créer un dépôt GitHub

1. Sur [github.com](https://github.com), cliquez **New repository**
2. Nommez-le par exemple `kasuwar-niger-site`, laissez-le "Private" si vous préférez, puis **Create repository**
3. Dans le terminal, à la racine du projet :

```bash
git init
git add .
git commit -m "Premier envoi du site Kasuwar Niger"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM-UTILISATEUR/kasuwar-niger-site.git
git push -u origin main
```

(Remplacez l'URL par celle affichée sur la page de votre nouveau dépôt GitHub.)

### Étape 2 — Déployer sur Vercel

1. Sur [vercel.com](https://vercel.com), connectez-vous avec votre compte GitHub
2. Cliquez **Add New → Project**
3. Sélectionnez votre dépôt `kasuwar-niger-site` → **Import**
4. Avant de cliquer "Deploy", ouvrez **Environment Variables** et ajoutez :
   - `NEXT_PUBLIC_ADMIN_EMAIL` = `ayoubazaki@gmail.com`
   - `NEXT_PUBLIC_ADMIN_PASSWORD_HASH` = `a16141e04b8d0b6f9e9c1d98e795d717a3151f18ee2157260f6d2204c41ac184`
5. Cliquez **Deploy**. En 1 à 2 minutes, votre site est en ligne sur une adresse du type `kasuwar-niger-site.vercel.app`

### Étape 3 — Connecter votre domaine www.kassuwarniger.com

1. Dans votre projet Vercel → **Settings → Domains** → tapez `www.kassuwarniger.com` → **Add**
2. Vercel affiche un enregistrement DNS à créer (en général un `CNAME` pointant vers `cname.vercel-dns.com`)
3. Connectez-vous à votre espace client **LWS** → section domaine/zone DNS de `kassuwarniger.com`
4. Ajoutez l'enregistrement exact indiqué par Vercel (type, nom, valeur)
5. Patientez entre 10 minutes et quelques heures le temps que le changement se propage
6. Une fois propagé, `www.kassuwarniger.com` affiche votre site, avec HTTPS activé automatiquement

> **Alternative** : héberger directement sur LWS via leur gestionnaire Node.js cPanel est possible (voir `README.md` du projet, section "Option B"), mais plus manuel. L'option Vercel ci-dessus est plus simple à maintenir.

---

## 5. Mettre à jour le site après le lancement

Chaque fois que vous modifiez le code (nouveau texte, nouvelle page, correction) :

```bash
git add .
git commit -m "Description de ce que vous avez changé"
git push
```

Vercel redéploie automatiquement le site en 1 à 2 minutes après chaque `push`.

---

## 6. Changer le mot de passe admin

Pour des raisons de sécurité, changez ce mot de passe avant un vrai lancement public.

1. Choisissez un nouveau mot de passe
2. Générez son empreinte (hash) — dans un terminal avec Node.js installé :

```bash
node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('VOTRE_NOUVEAU_MOT_DE_PASSE')).then(b=>console.log(Buffer.from(b).toString('hex')))"
```

3. Remplacez la valeur de `NEXT_PUBLIC_ADMIN_PASSWORD_HASH` :
   - dans votre fichier `.env.local` (pour le local)
   - dans Vercel → Settings → Environment Variables (pour le site en ligne, puis redéployez)

---

## 7. Prochaine étape recommandée

Ce site fonctionne réellement (navigation, panier, admin), mais reste un **front-end sans base de données centrale**. Pour que :
- vos ajouts admin soient visibles par tous vos clients,
- les commandes et paiements (Mobile Money, cash) soient réellement enregistrés,
- vous ayez un vrai système de comptes utilisateurs sécurisé,

il faut construire un backend (API + base de données). Le `README.md` du projet détaille précisément ce qu'il reste à faire et pourquoi. Dites-moi quand vous voulez avancer sur cette partie — on peut commencer par un seul module (par exemple Restaurants) pour avoir un premier flux de commande réel de bout en bout.
