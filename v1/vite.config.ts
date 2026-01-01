import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Port configuration - must match electron/config.js DEV_SERVER_PORT
const DEV_SERVER_PORT = 5173;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    outDir: 'docs',
  },
  base: './',
  server: {
    port: DEV_SERVER_PORT,
  },
})
