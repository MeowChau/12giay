import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_BGM_AVAILABLE': JSON.stringify(String(existsSync(new URL('./public/audio/theme.mp3', import.meta.url)))),
  },
})
