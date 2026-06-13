import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(() => ({

    root: 'src',
    clearScreen: false,

    plugins:
    [
        react(),
        tailwind()
    ],

    build:
    {
        outDir: '../dist',
        chunkSizeWarningLimit: 1024
    },

    server:
    {
        port: 1420,
        strictPort: true,
        host: host ?? false,
        hmr: (host === undefined) ? false : { port: 1421, protocol: 'ws', host },
        watch:
        {
            ignored:
            [
                '**/dist/**',
                '**/src-tauri/**'
            ]
        }
    }
}));
