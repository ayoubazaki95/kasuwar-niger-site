// Service worker minimal — assure l'installabilité (condition requise pour générer un APK).
// Ne met rien en cache de façon agressive : laisse le réseau gérer les données à jour
// (restaurants, produits, commandes viennent de Supabase et changent souvent).

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Passthrough réseau — pas de cache offline pour l'instant, pour éviter d'afficher
  // des données périmées (prix, disponibilité, statut des commandes).
});
