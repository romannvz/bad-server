import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [svgr(), react(), tsconfigPaths({ root: __dirname })],
    resolve: {
        alias: {
            $fonts: resolve('./src/vendor/fonts'),
            $assets: resolve('./src/assets'),
            $scss: resolve('./src/scss'),
        },
    },
    // server: {
    //     headers: {
    //         'Content-Security-Policy':
    //             "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'",
    //     },
    // },
    build: {
        assetsInlineLimit: 0,
        rollupOptions: {
            output: {
                manualChunks: undefined,
                entryFileNames: `[name].[hash].js`,
                chunkFileNames: `[name].[hash].js`,
                assetFileNames: `[name].[hash].[ext]`,
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
          @use "$scss/variables" as *;
          @use "$scss/mixins";
        `,
            },
        },
    },
})
