import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Deployed to amyleesterling.github.io/flywire-neuron-gallery/ — paths must
// be prefixed in production. Dev server stays at '/'.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/flywire-neuron-gallery/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split heavyweight vendors so the initial chunk stays small.
        // - `three` is only needed when a 3D viewer mounts (~600 KB).
        // - `motion` is used across both routes but isolating it lets the
        //   browser cache it across navigations.
        // - `react-vendor` rarely changes, maximizing long-term cache hits.
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('/three/')) return 'three';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('react-router')) {
              return 'react-vendor';
            }
          }
        },
      },
    },
  },
}))
