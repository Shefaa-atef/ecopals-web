import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.riv'],
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing', 'maath'],
          'vendor-gsap': ['gsap', '@gsap/react'],
          'vendor-framer': ['framer-motion'],
          'vendor-rive': ['@rive-app/react-canvas'],
          'vendor-misc': ['lenis', 'swiper', 'split-type', 'slot-text', 'culori', 'simplex-noise'],
          'vendor-phaser': ['phaser'],
        },
      },
    },
  },
})
