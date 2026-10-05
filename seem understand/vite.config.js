import { defineConfig } from 'vite';

console.log('>>> vite.config.js loaded <<<');

export default defineConfig({
    server: {
        port: 5173,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    build: { outDir: 'dist' }
});