import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';


export default defineConfig({
  // depending on your application, base can also be "/"
  
    plugins: [react(), jsconfigPaths()],
    base: '/comrel',
    assetsInclude: ['**/*.PNG'],
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      // this sets a default port to 3000
      port: 3005,
      host: true
    },
    build: {
      chunkSizeWarningLimit: 1600
    },
    preview: {
      open: true,
      port: 3005,
      host: true
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1')
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1')
      }
    ]
  }
});
