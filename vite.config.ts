import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Panini WC 2026 Tracker',
        short_name: 'Panini 2026',
        description: 'Track your FIFA World Cup 2026 Panini sticker album',
        theme_color: '#1a3c5e',
        background_color: '#f9fafb',
        display: 'standalone',
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
})
