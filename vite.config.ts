import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
            timeout: 10000,
            configure: (proxy, _options) => {
              proxy.on('error', (err, _req, res) => {
                console.error('Proxy error:', err);
                if (res && !res.headersSent) {
                  res.writeHead(500, {
                    'Content-Type': 'application/json',
                  });
                  res.end(JSON.stringify({
                    success: false,
                    message: 'Backend server is not running. Please start it with: npm run dev:server',
                    error: 'ECONNREFUSED'
                  }));
                }
              });
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:3001${req.url}`);
              });
            },
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
