import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

import { defineConfig } from 'vite';

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
        host: '0.0.0.0',
        strictPort: true,
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
