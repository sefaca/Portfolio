// Optimiza las imágenes pesadas a WebP y genera la imagen social (OG).
// Uso: node scripts/optimize-images.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, "..", "public", "assets");
const LEGACY = join(__dirname, "..", "assets"); // originales del sitio antiguo

const jobs = [
  { in: "Photo-personal.jpeg", out: "Photo-personal.webp", width: 900 },
  { in: "FoodSaver.png", out: "FoodSaver.webp", width: 760 },
  { in: "CookMate.png", out: "CookMate.webp", width: 760 },
  { in: "WeatherAI.png", out: "WeatherAI.webp", width: 800 },
  { in: "ExpenseTracker.png", out: "ExpenseTracker.webp", width: 760 },
  { in: "PadelMatch.png", out: "PadelMatch.webp", width: 1100 },
  { in: "820shots_so.png", out: "820shots_so.webp", width: 1100 },
  { in: "RestaurantWeb.jpeg", out: "RestaurantWeb.webp", width: 1100 },
  { in: "dfs.jpeg", out: "dfs.webp", width: 1100 },
];

for (const j of jobs) {
  // Busca el original en public/assets o en la carpeta legacy; si no está, salta.
  const src = [join(ASSETS, j.in), join(LEGACY, j.in)].find(existsSync);
  if (!src) {
    console.log(`${j.out.padEnd(24)} (fuente no encontrada, saltado)`);
    continue;
  }
  const dest = join(ASSETS, j.out);
  const info = await sharp(src)
    .resize({ width: j.width, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(dest);
  console.log(`${j.out.padEnd(24)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

// ---- Imagen social (OG) 1200x630 — paleta mono + acento ----
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="smoke" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#050505"/>
  <circle cx="950" cy="300" r="300" fill="url(#smoke)"/>
  <g transform="translate(810 160) scale(2.8)">
    <g stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M 65 27 H 47 C 40 27 38 30 38 36 V 44 C 38 48 39 50.5 42 53 L 51.5 58.5"/>
      <path d="M 65 27 H 47 C 40 27 38 30 38 36 V 44 C 38 48 39 50.5 42 53 L 51.5 58.5" transform="rotate(180 50 50)"/>
    </g>
  </g>
  <text x="90" y="290" font-family="'Arial Narrow','Inter',sans-serif" font-size="110" font-weight="700" fill="#ffffff" letter-spacing="2" style="text-transform:uppercase">SERGIO FALCÓN</text>
  <text x="92" y="355" font-family="'Courier New',monospace" font-size="30" fill="#9c9c9c" letter-spacing="4">CREATIVE DEVELOPER — REACT NATIVE · WEB · 3D</text>
  <rect x="92" y="400" width="150" height="6" fill="#ff4400"/>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(join(__dirname, "..", "public", "og.png"));
console.log("og.png                   1200x630");
