import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/\.js$/) || id.includes('node_modules')) return null;
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
  ],
  resolve: {
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: [
      { find: /^react-native\/Libraries\/Utilities\/codegenNativeComponent$/, replacement: 'react-native-web/dist/cjs/modules/codegenNativeComponent' },
      { find: 'react-native', replacement: 'react-native-web' },
    ],
  },
  define: {
    global: 'window',
  },
  server: {
    port: 3000,
    open: true,
  },
});



