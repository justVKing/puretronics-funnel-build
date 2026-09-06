import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { siteConfig } from './src/config/site';

export default defineConfig({
  base: siteConfig.basePath,
  plugins: [
    react(),
    {
      name: 'puretronics-site-metadata',
      transformIndexHtml(html) {
        const canonical = siteConfig.canonicalUrl.endsWith('/') ? siteConfig.canonicalUrl : `${siteConfig.canonicalUrl}/`;
        return html.replaceAll('__CANONICAL_URL__', canonical).replaceAll('__OG_IMAGE_URL__', `${canonical}assets/social/capability-profile-review-og.png`);
      },
    },
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    css: true,
  },
});
