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
            // Bundle mermaid and its heavy deps together (prevents splitting)
            if (id.includes('node_modules/mermaid') || id.includes('node_modules/d3')) {
              return 'mermaid-vendor';
            }
            // Bundle KaTeX separately (large but rarely used)
            if (id.includes('node_modules/katex')) {
              return 'katex-vendor';
            }
            // Let Rollup handle React, base-ui, and components naturally
            // to avoid circular dependency issues
          },
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
