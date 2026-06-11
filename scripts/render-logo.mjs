// Renderiza el logo SVG a PNG para revisión visual. Uso: node scripts/render-logo.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svg = readFileSync(join(__dirname, "..", "public", "brand", "logo-s.svg"));

await sharp(svg, { density: 300 })
  .resize(512, 512, { fit: "contain", background: "#050505" })
  .flatten({ background: "#050505" })
  .png()
  .toFile(join(__dirname, "..", "public", "brand", "logo-preview.png"));

console.log("logo-preview.png generado");
