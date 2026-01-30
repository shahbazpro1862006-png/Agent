import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// Replit-friendly Vite config:
// - host 0.0.0.0
// - port from $PORT (fallback 5000)
// - allow all hosts (Replit uses dynamic hostnames)
// - HMR via 443
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: false
    })
  ],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5000,
    strictPort: true,
    allowedHosts: true,
    hmr: { clientPort: 443 }
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5000,
    strictPort: true
  }
})
