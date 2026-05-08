import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';

const rateLimitState = new Map();

function getRequestOrigin(request) {
  return request.headers.origin || '';
}

function buildCorsHeaders(request) {
  const origin = getRequestOrigin(request);
  const allowedOrigin = config.allowedOrigins.includes(origin)
    ? origin
    : config.allowedOrigins[0] || '*';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function getBaseHeaders(request) {
  return {
    ...buildCorsHeaders(request),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
    'Content-Security-Policy':
      "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; connect-src 'self' http: https:;",
  };
}

export function sendJson(request, response, statusCode, data) {
  response.writeHead(statusCode, {
    ...getBaseHeaders(request),
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify({ data }, null, 2));
}

export function sendText(
  request,
  response,
  statusCode,
  content,
  contentType = 'text/plain; charset=utf-8',
) {
  response.writeHead(statusCode, {
    ...getBaseHeaders(request),
    'Content-Type': contentType,
  });
  response.end(content);
}

export function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk;
    });
    request.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function contentTypeFor(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

export function serveStatic(request, requestPath, response, distDir) {
  const safePath = requestPath === '/' ? '/index.html' : requestPath;
  const target = path.normalize(path.join(distDir, safePath));
  if (!target.startsWith(distDir)) {
    sendText(request, response, 403, 'Forbidden');
    return;
  }

  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    sendText(request, response, 200, fs.readFileSync(target), contentTypeFor(target));
    return;
  }

  const indexFile = path.join(distDir, 'index.html');
  if (fs.existsSync(indexFile)) {
    sendText(request, response, 200, fs.readFileSync(indexFile), 'text/html; charset=utf-8');
    return;
  }

  sendText(request, response, 404, 'Not found');
}

export function rateLimit(request, response, key, limit, windowMs) {
  const now = Date.now();
  const existing = rateLimitState.get(key);
  if (!existing || now > existing.resetAt) {
    rateLimitState.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  existing.count += 1;
  if (existing.count > limit) {
    sendJson(request, response, 429, {
      error: 'Rate limit exceeded',
      retryAfterMs: existing.resetAt - now,
    });
    return true;
  }

  return false;
}

export function extractToken(request) {
  const header = request.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice('Bearer '.length);
}
