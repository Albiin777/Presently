import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Real-time signaling plugin for devices on the same Wi-Fi / Hotspot
function presentlySignalingPlugin(): Plugin {
  const messageQueue: Array<{ id: number; data: any }> = [];
  let nextId = 1;

  return {
    name: 'presently-signaling',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        // 1. Post a sync event (broadcast from phone or laptop)
        if (req.method === 'POST' && req.url.startsWith('/api/sync/send')) {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              messageQueue.push({ id: nextId++, data: parsed });
              if (messageQueue.length > 200) {
                messageQueue.shift();
              }
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true, id: nextId - 1 }));
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        // 2. Poll for new sync events since given id
        if (req.method === 'GET' && req.url.startsWith('/api/sync/poll')) {
          const url = new URL(req.url, 'http://localhost');
          const since = parseInt(url.searchParams.get('since') || '0', 10);
          const newMessages = messageQueue.filter((m) => m.id > since);

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          });
          res.end(JSON.stringify({ messages: newMessages, latestId: nextId - 1 }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), presentlySignalingPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
