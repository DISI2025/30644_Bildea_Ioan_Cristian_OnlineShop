import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    plugins: [react()],
    define: {
        global: 'globalThis',
    },
    server: {
        watch: {usePolling: true,},
        proxy: {
            '^/api': {
                target: 'http://localhost:8080',
                rewrite: (path) => path.replace('/api', ''),
            },
            '/ws-notifications': {
                target: 'http://localhost:8084',
                changeOrigin: true,
                ws: true
            },
        },
    },
})
