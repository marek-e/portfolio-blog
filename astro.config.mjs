// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://melmayan.fr',
  output: 'static',
  prefetch: true,
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Bundle all React/React-DOM together
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            // Bundle Base-UI components together
            if (id.includes('@base-ui')) {
              return 'base-ui-vendor';
            }
            // Bundle mermaid and its deps to prevent splitting
            if (id.includes('node_modules/mermaid')) {
              return 'mermaid-vendor';
            }
            // Bundle your UI components together
            if (id.includes('/src/components/')) {
              return 'ui-components';
            }
          },
          // Increase chunk size warning limit
          chunkFileNames: '_astro/[name].[hash].js',
        },
      },
      // Increase chunk size limits to reduce splitting
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'dracula',
      },
    },
  },
});
