// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages (project site): https://sefaca.github.io/Portfolio/
  // Si algún día usas dominio propio: cambia `site` y elimina `base`.
  site: 'https://sefaca.github.io',
  base: '/Portfolio',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
