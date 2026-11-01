import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Otomatis pakai /Quizzy/ saat build di GitHub Pages, dan / saat lokal/VPS
  base: process.env.GITHUB_ACTIONS ? '/Quizzy/' : '/',
})

