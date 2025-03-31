import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx', // Your entry point for React
            refresh: true,
        }),
        react(),
    ],
    build: {
        outDir: 'public/build', // Ensure Vite outputs to the correct directory
        emptyOutDir: true, // Clear the build folder before building
    }
});
