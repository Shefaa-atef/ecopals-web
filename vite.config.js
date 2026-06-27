import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.riv'],
  base: '/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/phaser'))                    return 'vendor-phaser'
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom'))                 return 'vendor-react'
          if (id.includes('node_modules/three') ||
              id.includes('node_modules/@react-three') ||
              id.includes('node_modules/@react-three/fiber') ||
              id.includes('node_modules/@react-three/drei') ||
              id.includes('node_modules/postprocessing') ||
              id.includes('node_modules/maath'))                     return 'vendor-three'
          if (id.includes('node_modules/gsap') ||
              id.includes('node_modules/@gsap'))                     return 'vendor-gsap'
          if (id.includes('node_modules/framer-motion'))             return 'vendor-framer'
          if (id.includes('node_modules/@rive-app'))                 return 'vendor-rive'
          if (id.includes('node_modules/lenis') ||
              id.includes('node_modules/swiper') ||
              id.includes('node_modules/split-type') ||
              id.includes('node_modules/slot-text') ||
              id.includes('node_modules/culori') ||
              id.includes('node_modules/simplex-noise'))             return 'vendor-misc'
        },
      },
    },
  },
})
