/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLint n'est pas installé comme dépendance dans ce projet (pour garder l'installation
  // légère). On désactive donc le lint automatique pendant "next build" afin d'éviter tout
  // blocage sur les plateformes de déploiement (Vercel, etc.). Le code reste fonctionnel ;
  // pour activer le lint, installez `eslint` et `eslint-config-next` puis retirez cette ligne.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
