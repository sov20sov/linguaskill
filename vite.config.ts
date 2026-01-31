import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
      server: {
        port: 3000,
        host: '0.0.0.0',
        // في التطوير المحلي، استخدم proxy للاتصال بـ Backend
        // في الإنتاج على Vercel، سيتم استخدام /api مباشرة
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
            timeout: 10000,
            configure: (proxy, _options) => {
              proxy.on('error', (err, _req, res) => {
                console.error('⚠️  Proxy error - Backend server may not be running');
                console.error('   Start backend with: npm run dev:server');
                if (res && !res.headersSent) {
                  res.writeHead(503, {
                    'Content-Type': 'application/json',
                  });
                  res.end(JSON.stringify({
                    success: false,
                    message: 'الخادم غير متاح حالياً. يرجى التأكد من تشغيل Backend.',
                    error: 'ECONNREFUSED',
                    hint: 'Run: npm run dev:server'
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
      // لا نعرّف أي مفاتيح سرية هنا — الأسرار (مثل GEMINI_API_KEY) تُستخدم فقط على الخادم
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // تحسينات الأداء
        target: 'esnext',
        minify: 'esbuild',
        cssMinify: true,
        sourcemap: false,
        rollupOptions: {
          output: {
            // Code splitting - تقسيم الكود
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'ogl-vendor': ['ogl'],
            },
            // تحسين أسماء الملفات
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name.split('.');
              const ext = info[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                return `assets/images/[name]-[hash][extname]`;
              }
              if (/woff2?|eot|ttf|otf/i.test(ext)) {
                return `assets/fonts/[name]-[hash][extname]`;
              }
              return `assets/${ext}/[name]-[hash][extname]`;
            },
          },
        },
        // تحسين حجم الحزمة
        chunkSizeWarningLimit: 1000,
      },
      // تحسين الأداء في التطوير
      optimizeDeps: {
        include: ['react', 'react-dom', 'ogl'],
        exclude: [],
      },
}));
