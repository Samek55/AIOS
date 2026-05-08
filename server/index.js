import http from 'node:http';
import path from 'node:path';
import { URL } from 'node:url';
import { config } from './config.js';
import { sendJson, sendText, serveStatic } from './http-utils.js';
import { incrementMetric, formatPrometheusMetrics } from './metrics.js';
import { handleApi } from './router.js';
import { getStoreMode } from './store.js';
import { validateProductionConfig } from './config.js';

const distDir = path.resolve(process.cwd(), 'dist');
validateProductionConfig();

const server = http.createServer(async (request, response) => {
  incrementMetric('httpRequestsTotal');
  const url = new URL(request.url || '/', `http://${request.headers.host}`);

  try {
    if (url.pathname === '/metrics') {
      sendText(request, response, 200, formatPrometheusMetrics(), 'text/plain; version=0.0.4');
      return;
    }

    if (url.pathname.startsWith('/api/')) {
      await handleApi(request, response, url);
      return;
    }

    serveStatic(request, url.pathname, response, distDir);
  } catch (error) {
    const statusCode = Number(error?.statusCode || 500);
    if (statusCode >= 500) {
      console.error(error);
    }
    sendJson(request, response, statusCode, {
      error:
        error?.publicMessage ||
        (statusCode >= 500 ? 'Internal server error' : error.message || 'Request failed'),
    });
  }
});

server.listen(config.port, () => {
  console.log(
    `AIOS backend listening on http://localhost:${config.port} using ${getStoreMode()} storage`,
  );
});
