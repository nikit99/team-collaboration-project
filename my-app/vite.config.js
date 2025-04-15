// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // Critical for Amplify routing
  server: {
    host: true,  // Needed for Amplify health checks
  },
  build: {
    outDir: 'dist',  // Explicitly set output directory
    emptyOutDir: true,  // Clear the directory before build
  },
  optimizeDeps: {
    include: [  // Add your specific dependencies if needed
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
  }
})