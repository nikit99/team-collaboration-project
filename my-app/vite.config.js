import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       jsxImportSource: '@emotion/react',
//       babel: {
//         plugins: ['@emotion/babel-plugin'],
//       },
//     }),
//   ],
//   optimizeDeps: {
//     include: [
//       '@mui/material',
//       '@mui/icons-material',
//       '@emotion/react',
//       '@emotion/styled',
//     ],
//   },
//   esbuild: {
//     jsxInject: `import React from 'react'`,
//   },
// });