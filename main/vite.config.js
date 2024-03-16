// vite.config.js in /dev/vwrap/main
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.join(__dirname, 'static/html'), // Pointing to your index.html location
  build: {
    outDir: '../../dist', // Adjust the output directory relative to vite.config.js
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'static/html/index.html'),
        // Add other entry points if necessary
      }
    }
  },
  resolve: {
    alias: {
      // Resolve paths for your JS and other static files
      '/static/': path.resolve(__dirname, 'static/')
    }
  }
  // other configurations...
});
