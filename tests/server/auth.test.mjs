import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyToken } from '../../server/auth.js';
import { loginUser, registerUser } from '../../server/platform.js';
import { createSeedStore } from '../../server/seed-data.js';

function createNormalizedStore() {
  const store = createSeedStore();
  store.users = store.users.map((user) => ({
    ...user,
    passwordHash: hashPassword(user.password),
  }));
  return store;
}

test('seed customer can log in and receive a valid token', () => {
  const store = createNormalizedStore();
  const session = loginUser(store, 'alex@aios.app', 'demo1234');

  assert.ok(session);
  assert.equal(session.user.role, 'customer');
  assert.ok(session.token);
  assert.equal(verifyToken(session.token)?.email, 'alex@aios.app');
});

test('registerUser creates a new customer account and user state', () => {
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
