import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Plugin to ensure private backup files (85MB source zip & invitation JSON) are strictly excluded from production dist
function excludeBackupFilesFromDist(): Plugin {
  return {
    name: 'exclude-backup-files-from-dist',
    apply: 'build',
    closeBundle: {
      sequential: true,
      order: 'post',
      handler() {
        const distDir = path.resolve(process.cwd(), 'dist');
        const filesToExclude = [
          'Shubh_Nimantran_v30_SOURCE.zip',
          'Shubh_Nimantran_v30_DATA_BACKUP.json',
          'v29-download.html',
          'v30-download.html',
          'v31-download.html',
          'worker-v31.js'
        ];
        for (const file of filesToExclude) {
          const target = path.join(distDir, file);
          if (fs.existsSync(target)) {
            try {
              fs.unlinkSync(target);
              console.log(`[security-filter] Excluded private backup file from production dist: ${file}`);
            } catch (err) {
              console.warn(`[security-filter] Could not remove ${file}:`, err);
            }
          }
        }
      }
    }
  };
}

export default defineConfig(() => {
  return {
    // Relative base path allows static hosting on root domains, custom domains, or any GitHub Pages subpath
    base: process.env.VITE_BASE_PATH || './',
    plugins: [
      excludeBackupFilesFromDist(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: './',
          name: 'शुभ निमंत्रण - डिजिटल कार्ड मेकर',
          short_name: 'शुभ निमंत्रण',
          description: 'हिंदू शादी, मुस्लिम शादी और जन्मदिन के लिए इंटरैक्टिव डिजिटल निमंत्रण पत्र मेकर',
          theme_color: '#87091f',
          background_color: '#7a0c1e',
          display: 'standalone',
          orientation: 'portrait',
          start_url: './',
          scope: './',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.')
      }
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/shorten': {
          target: 'https://shubh-nimantran-shortener.goluraj1995.workers.dev',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/shorten/, '/shorten'),
          headers: {
            'Origin': 'https://goluraj1995.github.io'
          }
        }
      }
    }
  };
});
