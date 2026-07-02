// Serveur Node personnalisé, utilisé uniquement pour l'hébergement LWS (cPanel Node.js
// App Manager / Phusion Passenger). Non nécessaire pour un déploiement sur Vercel ou Netlify,
// qui gèrent Next.js nativement — voir README.md, section "Déploiement sur www.kassuwarniger.com".

const { createServer } = require("http");
const next = require("next");

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(process.env.PORT || 3000, () => {
    console.log("Kasuwar Niger — serveur démarré sur le port", process.env.PORT || 3000);
  });
});
