import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
});