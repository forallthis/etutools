import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        sidepanel: resolve(__dirname, 'src/sidepanel/sidepanel.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name === 'background' || name === 'content') {
            return `${name}.js`;
          }
          return `[name].js`;
        },
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          if (name.endsWith('.css')) {
            return '[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  }
})
