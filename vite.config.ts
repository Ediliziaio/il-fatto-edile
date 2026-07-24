import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  base: '/',
  // inspectAttr() inietta attributi `code-path` nel DOM: utile in dev, va escluso
  // dalla build di produzione (altrimenti finisce nell'HTML prerenderizzato servito ai crawler).
  plugins: [...(mode === 'development' ? [inspectAttr()] : []), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      // manualChunks solo per il bundle client: nel build SSR React è esterno e non è splittabile
      output: isSsrBuild
        ? {}
        : {
            // separa il runtime React e le librerie pesanti dal codice applicativo
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router'],
              'ui-vendor': ['lucide-react', 'recharts', 'embla-carousel-react'],
            },
          },
    },
  },
}));
