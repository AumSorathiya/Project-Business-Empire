import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

const DEFAULT_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D6AD58">
  <polygon points="12 2 2 7 12 12 22 7 12 2"/>
  <polyline points="2 17 12 22 22 17"/>
  <polyline points="2 12 12 17 22 12"/>
</svg>`;

function openBrowser(url) {
  const platform = process.platform;
  let cmd = '';
  if (platform === 'win32') {
    cmd = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    cmd = `open "${url}"`;
  } else {
    cmd = `xdg-open "${url}"`;
  }
  exec(cmd, (err) => {
    if (err) {
      console.log(`[Browser] Could not auto-launch browser automatically: ${err.message}`);
      console.log(`[Browser] Please open your browser and navigate to: ${url}`);
    }
  });
}

function createServer(startPort = 8080, shouldOpen = true) {
  let port = startPort;
  const maxAttempts = 20;
  let attempts = 0;

  function tryListen() {
    const server = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      if (reqPath === '/' || reqPath === '') {
        reqPath = '/index.html';
      }

      // Handle favicon fallback cleanly
      if (reqPath === '/favicon.ico' || reqPath === '/favicon.svg') {
        const potentialFavicon = path.resolve(ROOT_DIR, '.' + reqPath);
        if (!fs.existsSync(potentialFavicon)) {
          res.writeHead(200, {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
          });
          res.end(DEFAULT_FAVICON_SVG);
          return;
        }
      }

      const filePath = path.resolve(ROOT_DIR, '.' + reqPath);

      // Security check: restrict requests to workspace root directory
      if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Forbidden');
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          // If directory, check if index.html exists
          if (stats && stats.isDirectory()) {
            const indexFile = path.join(filePath, 'index.html');
            if (fs.existsSync(indexFile)) {
              serveFile(indexFile, res);
              return;
            }
          }
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
          return;
        }

        serveFile(filePath, res);
      });
    });

    function serveFile(targetFilePath, res) {
      const ext = path.extname(targetFilePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      const headers = {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
      };

      // If serving index.html, clear browser cache for localhost to evict any old project caches
      if (ext === '.html') {
        headers['Clear-Site-Data'] = '"cache"';
      }

      res.writeHead(200, headers);

      const stream = fs.createReadStream(targetFilePath);
      stream.pipe(res);
      stream.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('500 Internal Server Error');
        }
      });
    }

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        attempts++;
        if (attempts < maxAttempts) {
          port++;
          server.close();
          tryListen();
        } else {
          console.error(`Error: Could not find an available port after ${maxAttempts} attempts.`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', err);
      }
    });

    server.listen(port, '127.0.0.1', () => {
      const url = `http://localhost:${port}`;
      console.log('======================================================================');
      console.log('  👑 EMPIRE ARCHITECT — Idle Tycoon & Business Simulation');
      console.log('======================================================================');
      console.log(`  ▶ Local Server : ${url}`);
      console.log(`  ▶ Status       : Online and ready`);
      if (shouldOpen) {
        console.log(`  ▶ Browser      : Opening default browser to ${url}...`);
        openBrowser(url);
      } else {
        console.log(`  ▶ Play Game    : Open ${url} in your browser`);
      }
      console.log('----------------------------------------------------------------------');
      console.log('  [Tips] Press Ctrl+C in this console window to exit anytime.');
      console.log('======================================================================\n');
    });
  }

  tryListen();
}

process.on('SIGINT', () => {
  console.log('\nStopping Empire Architect server... Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

const args = process.argv.slice(2);
const shouldOpen = !args.includes('--no-open');
const portArg = args.find((a) => a.startsWith('--port='));
const startPort = portArg ? parseInt(portArg.split('=')[1], 10) : (parseInt(process.env.PORT, 10) || 8080);

createServer(startPort, shouldOpen);
