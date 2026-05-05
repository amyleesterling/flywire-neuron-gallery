import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Deployed to amyleesterling.github.io/flywire-neuron-gallery/ — paths must
// be prefixed in production. Dev server stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/flywire-neuron-gallery/' : '/',
  plugins: [react(), tailwindcss()],
}))
