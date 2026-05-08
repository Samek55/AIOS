import assert from 'node:assert/strict';
import { hashPassword, verifyToken } from '../../server/auth.js';
import {
  buildAdminOverview,
  buildVendorDashboard,
  getVendorOrders,
  loginUser,
  registerUser,
} from '../../server/platform.js';
import { createSeedStore } from '../../server/seed-data.js';

function createNormalizedStore() {
  const store = createSeedStore();
  store.users = store.users.map((user) => ({
    ...user,
    passwordHash: hashPassword(user.password),
  }));
  return store;
}

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run('seed customer can log in and receive a valid token', () => {
  const store = createNormalizedStore();
  const session = loginUser(store, 'alex@aios.app', 'demo1234');

  assert.ok(session);
  assert.equal(session.user.role, 'customer');
  assert.ok(session.token);
  assert.equal(verifyToken(session.token)?.email, 'alex@aios.app');
});

run('registerUser creates a new customer account and user state', () => {
  const store = createNormalizedStore();
  const session = registerUser(store, {
    name: 'Taylor Rivera',
    email: 'taylor@example.com',
    password: 'secret123',
    city: 'Boston',
    state: 'MA',
  });

  assert.equal(session.user.email, 'taylor@example.com');
  assert.equal(session.user.role, 'customer');
  assert.ok(store.userStates[session.user.id]);
  assert.equal(store.userStates[session.user.id].profile.city, 'Boston');
});

run('admin overview exposes high-level platform metrics', () => {
  const store = createNormalizedStore();
  const overview = buildAdminOverview(store, {
    assistantQueriesTotal: 4,
  });

  assert.equal(overview.usersCount, 3);
  assert.equal(overview.vendorsCount, store.platform.vendors.length);
  assert.equal(overview.aiRequestsToday, 4);
});

run('vendor dashboard only returns products and orders for that vendor', () => {
  const store = createNormalizedStore();
  const vendorUser = store.users.find((user) => user.role === 'vendor');
  const dashboard = buildVendorDashboard(store, vendorUser);

  assert.equal(dashboard.vendor?.id, 'vendor-green');
  assert.equal(dashboard.products.length, 3);
  assert.equal(
    getVendorOrders(store, 'vendor-green').every((order) => Array.isArray(order.items)),
    true,
  );
});

console.log('All server checks passed.');
