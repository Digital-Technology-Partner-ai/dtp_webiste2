import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://digitaltechnologypartner.ai', // Production domain for absolute URLs
  // public/sitemap.xml is the reviewed canonical inventory. Do not publish a
  // second generated sitemap with internal, preview or utility routes.
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
