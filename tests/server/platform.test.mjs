import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword } from '../../server/auth.js';
import {
  buildAdminOverview,
  buildVendorDashboard,
  getVendorOrders,
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

test('admin overview exposes high-level platform metrics', () => {
  const store = createNormalizedStore();
  const overview = buildAdminOverview(store, {
    assistantQueriesTotal: 4,
  });

  assert.equal(overview.usersCount, 3);
  assert.equal(overview.vendorsCount, store.platform.vendors.length);
  assert.equal(overview.aiRequestsToday, 4);
});

test('vendor dashboard only returns products and orders for that vendor', () => {
  const store = createNormalizedStore();
  const vendorUser = store.users.find((user) => user.role === 'vendor');
  const dashboard = buildVendorDashboard(store, vendorUser);

  assert.equal(dashboard.vendor?.id, 'vendor-green');
  assert.equal(dashboard.products.length, 3);
  assert.deepEqual(
    getVendorOrders(store, 'vendor-green').every((order) => Array.isArray(order.items)),
    true,
  );
});
