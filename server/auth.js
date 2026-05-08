import crypto from 'node:crypto';
import { config } from './config.js';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function decodeBase64url(input) {
  const normalized = input.replaceAll('-', '+').replaceAll('_', '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, 'base64').toString('utf8');
}

function constantTimeEqual(left, right, encoding = 'utf8') {
  const leftBuffer = Buffer.from(left || '', encoding);
  const rightBuffer = Buffer.from(right || '', encoding);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, passwordHash) {
  if (!passwordHash || !passwordHash.includes(':')) {
    return false;
  }
  const [salt, storedHash] = passwordHash.split(':');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return constantTimeEqual(storedHash, derived, 'hex');
}

export function createToken(user, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
    vendorId: user.vendorId || null,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', config.authSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyToken(token) {
  if (!token) {
    return null;
  }

  const segments = token.split('.');
  if (segments.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = segments;
  const expectedSignature = crypto
    .createHmac('sha256', config.authSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

  if (!constantTimeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64url(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    vendorId: user.vendorId || null,
    profile: user.profile,
    membership: user.profile?.membership || null,
  };
}
