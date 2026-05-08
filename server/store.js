import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { hashPassword } from './auth.js';
import { config } from './config.js';
import { createSeedStore } from './seed-data.js';

const dataDir = path.resolve(process.cwd(), 'server', 'data');
const storeFile = path.join(dataDir, 'store.json');
const documentTable = 'app_documents';
const documentKey = 'root';

let store = null;
let pool = null;
let initialized = false;

function snapshot(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureUsersAreHashed(storeValue) {
  storeValue.users = (storeValue.users || []).map((user) => {
    if (user.passwordHash || !user.password) {
      return user;
    }

    const nextUser = { ...user, passwordHash: hashPassword(user.password) };
    delete nextUser.password;
    return nextUser;
  });
}

function normalizeStore(storeValue) {
  const seed = createSeedStore();
  const merged = {
    schemaVersion: storeValue.schemaVersion || seed.schemaVersion,
    platform: storeValue.platform || seed.platform,
    users: Array.isArray(storeValue.users) ? storeValue.users : seed.users,
    userStates: storeValue.userStates || seed.userStates,
    payments: Array.isArray(storeValue.payments) ? storeValue.payments : seed.payments,
    auditEvents: Array.isArray(storeValue.auditEvents) ? storeValue.auditEvents : seed.auditEvents,
  };

  ensureUsersAreHashed(merged);
  return merged;
}

function ensureStoreFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(storeFile)) {
    const initial = normalizeStore(createSeedStore());
    fs.writeFileSync(storeFile, JSON.stringify(initial, null, 2), 'utf8');
  }
}

function readStoreFile() {
  ensureStoreFile();
  const raw = fs.readFileSync(storeFile, 'utf8');
  return normalizeStore(JSON.parse(raw));
}

function writeStoreFile(nextStore) {
  ensureStoreFile();
  fs.writeFileSync(storeFile, JSON.stringify(normalizeStore(nextStore), null, 2), 'utf8');
}

async function getPool() {
  if (!config.databaseUrl) {
    return null;
  }

  if (!pool) {
    pool = new pg.Pool({ connectionString: config.databaseUrl });
  }

  return pool;
}

async function ensurePostgresReady() {
  const db = await getPool();
  if (!db) {
    return;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS ${documentTable} (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const existing = await db.query(`SELECT id FROM ${documentTable} WHERE id = $1`, [documentKey]);
  if (existing.rowCount === 0) {
    const initial = normalizeStore(createSeedStore());
    await db.query(
      `INSERT INTO ${documentTable} (id, payload) VALUES ($1, $2::jsonb)`,
      [documentKey, JSON.stringify(initial)],
    );
  }
}

async function readPostgresStore() {
  const db = await getPool();
  if (!db) {
    return null;
  }

  await ensurePostgresReady();
  const result = await db.query(
    `SELECT payload FROM ${documentTable} WHERE id = $1 LIMIT 1`,
    [documentKey],
  );

  if (result.rowCount === 0) {
    return normalizeStore(createSeedStore());
  }

  return normalizeStore(result.rows[0].payload);
}

async function writePostgresStore(nextStore) {
  const db = await getPool();
  if (!db) {
    return;
  }

  await ensurePostgresReady();
  await db.query(
    `
      INSERT INTO ${documentTable} (id, payload, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET
        payload = EXCLUDED.payload,
        updated_at = NOW()
    `,
    [documentKey, JSON.stringify(normalizeStore(nextStore))],
  );
}

export function getStoreMode() {
  return config.databaseUrl ? 'postgres' : 'file';
}

async function initializeStore() {
  if (initialized) {
    return;
  }

  store = getStoreMode() === 'postgres' ? await readPostgresStore() : readStoreFile();
  initialized = true;
}

export async function getStore() {
  if (!initialized) {
    await initializeStore();
  }

  if (!store) {
    store = normalizeStore(createSeedStore());
  }

  return store;
}

export async function saveStore(nextStore) {
  const normalized = normalizeStore(nextStore);
  store = normalized;
  initialized = true;

  if (getStoreMode() === 'postgres') {
    await writePostgresStore(normalized);
  } else {
    writeStoreFile(normalized);
  }

  return snapshot(normalized);
}

export async function resetStore() {
  const nextStore = normalizeStore(createSeedStore());
  return saveStore(nextStore);
}
