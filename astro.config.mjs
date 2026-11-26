// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Public URL of the site. Override with SITE_URL in Cloudflare Pages
// (Settings > Environment variables) once the final domain is known.
const SITE = process.env.SITE_URL ?? 'https://bchhal.pages.dev';

export default defineConfig({
  site: SITE,
  // Fully static output: every page is pre-rendered at build time.
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // The root "/" only redirects to /fr/, keep it out of the sitemap.
      filter: (page) => page !== `${SITE}/`,
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
