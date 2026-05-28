import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

import { defineConfig } from 'vite';

const host = process.env['TAURI_DEV_HOST'];

export default defineConfig(async() => ({

    root: './src',
    clearScreen: false,

    plugins:
    [
        react(),
        tailwind()
    ],

    server:
    {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host ? { port: 1421, protocol: 'ws', host } : false,
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
