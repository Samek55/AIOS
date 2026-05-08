import { sanitizeUser, verifyPassword, createToken, verifyToken, hashPassword } from './auth.js';
import { createUserState } from './seed-data.js';

export function findUserById(store, userId) {
  return store.users.find((user) => user.id === userId) || null;
}

export function findUserByEmail(store, email) {
  return store.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase()) || null;
}

export function buildScopedStore(rootStore, userId) {
  const userState = JSON.parse(JSON.stringify(rootStore.userStates[userId]));
  return {
    ...userState,
    vendors: JSON.parse(JSON.stringify(rootStore.platform.vendors)),
    products: JSON.parse(JSON.stringify(rootStore.platform.products)),
  };
}

export function persistScopedStore(rootStore, userId, scopedStore) {
  const { vendors, products, ...nextUserState } = JSON.parse(JSON.stringify(scopedStore));
  rootStore.userStates[userId] = nextUserState;

  const user = findUserById(rootStore, userId);
  if (user) {
    user.profile = JSON.parse(JSON.stringify(nextUserState.profile));
  }
}

export function logAuditEvent(store, actorUserId, scope, action, targetId, detail = {}) {
  store.auditEvents.unshift({
    id: `audit-${Date.now()}`,
    actorUserId,
    scope,
    action,
    targetId,
    createdAtLabel: 'Just now',
    detail,
  });
  store.auditEvents = store.auditEvents.slice(0, 50);
}

export function getAuthenticatedUser(store, token) {
  const payload = verifyToken(token);
  if (!payload?.sub) {
    return null;
  }
  return findUserById(store, payload.sub);
}

export function loginUser(store, email, password) {
  const user = findUserByEmail(store, email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return {
    token: createToken(user),
    user: sanitizeUser(user),
    record: user,
  };
}

export function registerUser(store, input) {
  const userId = `user-${Date.now()}`;
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const firstName = name.split(' ')[0] || name;
  const profile = {
    id: userId,
    name,
    firstName,
    username: email.split('@')[0],
    avatarUrl: store.userStates['user-alex'].profile.avatarUrl,
    membership: 'Starter Member',
    city: String(input.city || 'New York'),
    state: String(input.state || 'NY'),
    address: {
      label: 'Home',
      street: String(input.street || '123 Main St'),
      city: String(input.city || 'New York'),
      state: String(input.state || 'NY'),
    },
    bio: 'New to AIOS and ready to build better routines.',
  };

  const userRecord = {
    id: userId,
    email,
    passwordHash: hashPassword(String(input.password || '')),
    role: 'customer',
    vendorId: null,
    profile,
    createdAtLabel: 'Just now',
  };

  store.users.push(userRecord);
  store.userStates[userId] = createUserState(profile);
  return {
    token: createToken(userRecord),
    user: sanitizeUser(userRecord),
    record: userRecord,
  };
}

export function getStoreOrders(store) {
  return Object.entries(store.userStates).flatMap(([userId, state]) =>
    state.orders.map((order) => ({ ...order, userId })),
  );
}

export function getVendorOrders(store, vendorId) {
  return getStoreOrders(store).filter((order) => {
    if (order.vendorId === vendorId) {
      return true;
    }
    return order.items.some((item) => {
      const product = store.platform.products.find((entry) => entry.id === item.productId);
      return product?.vendorId === vendorId;
    });
  });
}

export function buildAdminOverview(store, metrics) {
  const orders = getStoreOrders(store);
  const payments = store.payments;
  const succeededPayments = payments.filter((payment) => payment.status === 'succeeded');
  const monthlyGmv = succeededPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    usersCount: store.users.length,
    vendorsCount: store.platform.vendors.length,
    productsCount: store.platform.products.length,
    activeOrders: orders.filter((order) => order.status !== 'delivered').length,
    monthlyGmv,
    paymentSuccessRate: payments.length
      ? Math.round((succeededPayments.length / payments.length) * 100)
      : 100,
    aiRequestsToday: metrics.assistantQueriesTotal,
    recentAuditEvents: store.auditEvents.slice(0, 8).map((event) => ({
      ...event,
      actor: sanitizeUser(
        findUserById(store, event.actorUserId) || {
          id: 'system',
          email: 'system@aios.app',
          role: 'admin',
          profile: { name: 'System' },
        },
      ),
    })),
    vendors: store.platform.vendors,
  };
}

export function buildVendorDashboard(store, user) {
  const vendorId = user.vendorId;
  const vendor = store.platform.vendors.find((entry) => entry.id === vendorId) || null;
  const products = store.platform.products.filter((entry) => entry.vendorId === vendorId);
  const orders = getVendorOrders(store, vendorId);
  const revenue = orders.reduce((sum, order) => sum + order.subtotal + order.deliveryFee, 0);

  return {
    vendor,
    products,
    orders: orders.slice(0, 10),
    revenue,
    lowStockProducts: products.filter((product) => Number(product.stockCount || 0) <= 10),
  };
}

export function normalizeOrderItems(items) {
  if (!Array.isArray(items)) {
    return null;
  }
  return items.map((item) => ({
    productId: item.productId,
    quantity: Number(item.quantity || 1),
    unitPrice: Number(item.unitPrice || 0),
  }));
}

export function createBootstrap(scopedStore) {
  return {
    profile: scopedStore.profile,
    mood: scopedStore.mood,
    vendors: scopedStore.vendors,
    products: scopedStore.products,
    tasks: scopedStore.tasks,
    habits: scopedStore.habits,
    workouts: scopedStore.workouts,
    meals: scopedStore.meals,
    health: scopedStore.health,
    finance: scopedStore.finance,
    notifications: scopedStore.notifications,
    orders: scopedStore.orders,
    cart: scopedStore.cart,
  };
}
