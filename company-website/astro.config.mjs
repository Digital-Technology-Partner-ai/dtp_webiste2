import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://digitaltechnologypartner.ai', // Production domain for absolute URLs
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/news/review/'),
    }),
  ],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});