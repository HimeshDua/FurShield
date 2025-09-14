import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
// import typography from '@tailwindcss/typography';

export default defineConfig({
       server: {
        host: '127.0.0.1',  // Add this to force IPv4 only
    },
    plugins: [
        laravel({
            input: ['resources/js/css/global.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
    },
});
