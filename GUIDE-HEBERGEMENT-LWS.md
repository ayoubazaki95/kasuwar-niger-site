# Héberger Kasuwar Niger sur kassuwarniger.com avec LWS

Guide basé sur la documentation officielle LWS pour le déploiement d'applications Node.js/Next.js sur cPanel.

## Prérequis côté LWS

- Une formule cPanel qui inclut l'outil **"Setup Node.js App"** (disponible à partir de la formule cPanel M2 chez LWS ; confirmé par LWS que Next.js y est pris en charge)
- Accès à votre cPanel LWS (identifiants dans votre espace client LWS)
- Le nom de domaine `kassuwarniger.com` déjà associé à votre hébergement LWS

Si vous avez un doute sur votre formule, ouvrez un ticket auprès du support LWS pour confirmer que "Setup Node.js App" est disponible sur votre compte.

---

## Étape 1 — Préparer le projet en local

Sur votre ordinateur, dans le dossier du projet :

```bash
npm install
npm run build
```

Cela crée un dossier `.next` contenant le site compilé. Vérifiez qu'aucune erreur n'apparaît dans le terminal.

Ensuite, créez une archive ZIP du projet **en excluant `node_modules`** (il sera réinstallé directement sur le serveur LWS, plus fiable que de le transférer) :

- Sur Windows/Mac : sélectionnez tous les fichiers du projet sauf le dossier `node_modules`, clic droit → "Compresser"
- Ou en ligne de commande :
  ```bash
  zip -r kasuwar-niger-lws.zip . -x "node_modules/*" ".next/*"
  ```

---

## Étape 2 — Créer l'application Node.js dans cPanel

1. Connectez-vous à votre **cPanel LWS**
2. Dans la section **Logiciel**, cliquez sur **"Setup Node.js App"**
3. Cliquez sur **"Create Application"**
4. Remplissez les champs :

| Champ | Valeur à indiquer |
|---|---|
| **Node.js version** | 20.x (recommandée par LWS) |
| **Application mode** | Development pour les premiers tests, puis **Production** une fois validé |
| **Application root** | ex. `kasuwarniger-app` — **important : ce dossier ne doit PAS être dans `public_html`**, sinon votre code source et vos dépendances deviennent accessibles publiquement. LWS le précise explicitement dans sa documentation |
| **Application URL** | sélectionnez `kassuwarniger.com` (et `www` si proposé séparément) |
| **Application startup file** | `server.js` |

5. Cliquez sur **Create**

À ce stade, LWS crée un environnement Node.js isolé pour votre application (visible dans l'interface avec une commande `source /home/VOTRE_LOGIN/nodevenv/kasuwarniger-app/20/bin/activate` — gardez cette commande, vous en aurez besoin à l'étape 4).

---

## Étape 3 — Envoyer les fichiers du projet

1. Dans cPanel, ouvrez le **Gestionnaire de fichiers** (File Manager)
2. Naviguez jusqu'au dossier **Application root** que vous avez indiqué à l'étape précédente (ex. `/home/VOTRE_LOGIN/kasuwarniger-app`)
3. Cliquez sur **Upload**, envoyez votre fichier ZIP, puis **extrayez-le** dans ce dossier une fois l'envoi terminé
4. Vérifiez que `package.json` et `server.js` se trouvent bien directement dans ce dossier (pas dans un sous-dossier imbriqué)

---

## Étape 4 — Installer les dépendances et configurer les variables

### Installer les dépendances

Retournez dans **Setup Node.js App**, ouvrez votre application, et cliquez sur **"Run NPM Install"**. LWS installe automatiquement tout ce qui est listé dans `package.json`.

*(Alternative si le bouton échoue ou reste bloqué : utilisez le Terminal cPanel, collez la commande `source .../bin/activate` fournie par l'interface pour votre app, puis `cd` vers le dossier de l'application et lancez `npm install` manuellement.)*

### Ajouter les variables d'environnement

Toujours dans l'interface de votre application Node.js, section **Environment Variables**, cliquez sur **Add Variable** et ajoutez ces deux entrées :

| Nom | Valeur |
|---|---|
| `NEXT_PUBLIC_ADMIN_EMAIL` | `ayoubazaki@gmail.com` |
| `NEXT_PUBLIC_ADMIN_PASSWORD_HASH` | `a16141e04b8d0b6f9e9c1d98e795d717a3151f18ee2157260f6d2204c41ac184` |

Cliquez sur **Save**.

### Construire le site sur le serveur

Si vous n'avez pas déjà envoyé le dossier `.next` généré en local, lancez le build directement sur LWS : dans le Terminal cPanel (après avoir activé l'environnement avec la commande `source .../activate` mentionnée plus haut) :

```bash
npm run build
```

---

## Étape 5 — Démarrer l'application

Retournez dans **Setup Node.js App** → votre application → cliquez sur **Restart**.

Visitez ensuite `https://kassuwarniger.com` — votre site doit s'afficher.

Si vous obtenez une page d'erreur ou "Cannot GET /" :
- Vérifiez que **Application startup file** est bien `server.js`
- Vérifiez dans les logs (accessibles depuis la même interface, "Passenger log file") s'il y a une erreur précise
- Vérifiez que `npm run build` s'est terminé sans erreur (relancez-le depuis le terminal pour voir le message complet)

---

## Étape 6 — Activer HTTPS

Dans cPanel, section **Sécurité → SSL/TLS Status** (ou **AutoSSL**), activez le certificat gratuit Let's Encrypt pour `kassuwarniger.com` et `www.kassuwarniger.com`, si ce n'est pas déjà fait automatiquement par LWS.

---

## Mettre à jour le site après une modification

À chaque changement de code :

1. Repassez par `npm run build` en local (ou directement sur le serveur via le terminal)
2. Renvoyez les fichiers modifiés via le Gestionnaire de fichiers (ou remplacez l'archive ZIP et réextrayez)
3. Retournez dans **Setup Node.js App** → **Restart**

---

## Résumé des points de vigilance LWS

- **Ne jamais** placer le dossier de l'application dans `public_html` — sécurité
- Le fichier de démarrage doit être **`server.js`** (déjà inclus dans votre projet), pas `page.tsx` ni `next.config.mjs`
- Passenger (le moteur utilisé par LWS) détecte automatiquement l'appel à `.listen()` dans `server.js` — ne changez pas cette partie du fichier
- En cas de blocage technique (permissions, port, erreur au build), le support LWS peut vérifier votre configuration Node.js — n'hésitez pas à les contacter avec le message d'erreur exact affiché dans les logs Passenger

Si une étape précise coince une fois que vous y êtes (message d'erreur, bouton qui ne répond pas, etc.), montrez-le-moi et je vous aide à débloquer.
