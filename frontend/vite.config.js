import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ZigmasWebDev',
        short_name: 'ZWD',
        description: 'Kuriu modernias svetaines ir programas',
        theme_color: '#0093E9',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: false, // Išjungti source maps production aplinkoje
    minify: 'esbuild', // Naudoti esbuild minifikaciją
    chunkSizeWarningLimit: 500, // Nustatyti chunk dydžio įspėjimo ribą
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Privalomai įtraukti dažniausiai naudojamus modulius
  },
});
