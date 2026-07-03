"use client";

/**
 * Lit un fichier image sélectionné par l'utilisateur, le redimensionne côté
 * navigateur (canvas) et retourne une chaîne base64 compressée, prête à être
 * stockée dans localStorage. Pas d'upload vers un serveur : tout reste local.
 */
export function fileToCompressedDataUrl(file: File, maxWidth = 900, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image invalide"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas non supporté"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const PLACEHOLDER_COLORS = [
  "#F5740F",
  "#129447",
  "#F2A93B",
  "#2C2C2A",
  "#0E7A3A",
  "#D9620A",
];

export function colorForId(id: number) {
  return PLACEHOLDER_COLORS[id % PLACEHOLDER_COLORS.length];
}
