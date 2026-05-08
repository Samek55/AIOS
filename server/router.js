import { config } from './config.js';
import { buildAssistantResponse } from './ai.js';
import {
  addCartItem,
  addTask,
  buildDashboardBrief,
  clearCart,
  logWater,
  placeOrder,
  setMood,
  snapshotStore,
  toggleHabitToday,
  toggleMeal,
  toggleTask,
  toggleWorkout,
  updateCartItem,
} from './logic.js';
import { incrementMetric, snapshotMetrics } from './metrics.js';
import { createCheckoutPayment } from './payments.js';
import {
  buildAdminOverview,
  buildScopedStore,
  buildVendorDashboard,
  createBootstrap,
  findUserByEmail,
  getAuthenticatedUser,
  logAuditEvent,
  loginUser,
  normalizeOrderItems,
  persistScopedStore,
  registerUser,
} from './platform.js';
import {
  extractToken,
  getBaseHeaders,
  rateLimit,
  readRequestBody,
  sendJson,
} from './http-utils.js';
import { getStore, getStoreMode, resetStore, saveStore } from './store.js';

function requireAuth(store, request, response, roles = null) {
  const user = getAuthenticatedUser(store, extractToken(request));
  if (!user) {
    sendJson(request, response, 401, { error: 'Authentication required' });
    return null;
  }
  if (roles && !roles.includes(user.role)) {
    sendJson(request, response, 403, { error: 'Forbidden' });
    return null;
  }
  return user;
}

export async function handleApi(request, response, url) {
  const store = await getStore();
  const pathname = url.pathname;
  const method = request.method || 'GET';
  const ipKey = request.socket.remoteAddress || 'local';

  if (method === 'OPTIONS') {
    response.writeHead(204, getBaseHeaders(request));
    response.end();
    return;
  }

  if (method === 'GET' && pathname === '/api/health') {
    sendJson(request, response, 200, {
      status: 'ok',
      service: 'aios-api',
      port: config.port,
      databaseMode: getStoreMode(),
      features: {
        auth: true,
        payments: true,
        openai: Boolean(config.openaiApiKey),
        monitoring: true,
      },
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/demo-credentials') {
    sendJson(request, response, 200, {
      customer: { email: 'alex@aios.app', password: 'demo1234' },
      vendor: { email: 'vendor@aios.app', password: 'vendor1234' },
      admin: { email: 'admin@aios.app', password: 'admin1234' },
    });
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/register') {
    if (rateLimit(request, response, `register:${ipKey}`, 10, 15 * 60 * 1000)) {
      return;
    }

    const body = await readRequestBody(request);
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!name || !email || password.length < 6) {
      incrementMetric('authFailuresTotal');
      sendJson(request, response, 400, {
        error: 'Name, email, and a 6+ character password are required.',
      });
      return;
    }

    if (findUserByEmail(store, email)) {
      incrementMetric('authFailuresTotal');
      sendJson(request, response, 409, {
        error: 'An account with that email already exists.',
      });
      return;
    }

    const session = registerUser(store, body);
    logAuditEvent(store, session.record.id, 'auth', 'register', session.record.id, { email });
    await saveStore(store);
    sendJson(request, response, 201, session);
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/login') {
    if (rateLimit(request, response, `login:${ipKey}`, 12, 15 * 60 * 1000)) {
      return;
    }

    const body = await readRequestBody(request);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const session = loginUser(store, email, password);

    if (!session) {
      incrementMetric('authFailuresTotal');
      sendJson(request, response, 401, { error: 'Invalid email or password.' });
      return;
    }

    incrementMetric('authLoginsTotal');
    session.record.lastLoginAtLabel = 'Just now';
    logAuditEvent(store, session.record.id, 'auth', 'login', session.record.id, { email });
    await saveStore(store);
    sendJson(request, response, 200, session);
    return;
  }

  if (method === 'GET' && pathname === '/api/auth/me') {
    const user = requireAuth(store, request, response);
    if (!user) {
      return;
    }
    sendJson(request, response, 200, {
      id: user.id,
      email: user.email,
      role: user.role,
      vendorId: user.vendorId || null,
      profile: user.profile,
      membership: user.profile?.membership || null,
    });
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/logout') {
    sendJson(request, response, 200, { success: true });
    return;
  }

  const authenticatedUser = requireAuth(store, request, response);
  if (!authenticatedUser) {
    return;
  }

  const scopedStore = buildScopedStore(store, authenticatedUser.id);

  if (method === 'GET' && pathname === '/api/bootstrap') {
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  if (method === 'GET' && pathname === '/api/dashboard/brief') {
    sendJson(request, response, 200, buildDashboardBrief(scopedStore));
    return;
  }

  if (method === 'GET' && pathname === '/api/vendors') {
    const category = url.searchParams.get('category');
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const vendors = scopedStore.vendors.filter((vendor) => {
      if (vendor.active === false) {
        return false;
      }
      if (category && vendor.category !== category) {
        return false;
      }
      if (search && !`${vendor.name} ${vendor.subtitle}`.toLowerCase().includes(search)) {
        return false;
      }
      return true;
    });
    sendJson(request, response, 200, vendors);
    return;
  }

  if (method === 'GET' && pathname === '/api/products') {
    const category = url.searchParams.get('category');
    const vendorId = url.searchParams.get('vendorId');
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const products = scopedStore.products.filter((product) => {
      if (product.active === false) {
        return false;
      }
      if (category && product.category !== category) {
        return false;
      }
      if (vendorId && product.vendorId !== vendorId) {
        return false;
      }
      if (
        search &&
        !`${product.name} ${product.description} ${product.tags.join(' ')}`
          .toLowerCase()
          .includes(search)
      ) {
        return false;
      }
      return true;
    });
    sendJson(request, response, 200, products);
    return;
  }

  if (method === 'POST' && pathname === '/api/assistant/query') {
    if (rateLimit(request, response, `assistant:${authenticatedUser.id}`, 50, 60 * 1000)) {
      return;
    }
    incrementMetric('assistantQueriesTotal');
    const body = await readRequestBody(request);
    sendJson(request, response, 200, await buildAssistantResponse(scopedStore, body.query || ''));
    return;
  }

  if (method === 'POST' && pathname === '/api/cart/items') {
    const body = await readRequestBody(request);
    addCartItem(scopedStore, body.productId, Number(body.delta || 1));
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  const cartPatchMatch = pathname.match(/^\/api\/cart\/items\/([^/]+)$/);
  if (method === 'PATCH' && cartPatchMatch) {
    const body = await readRequestBody(request);
    updateCartItem(scopedStore, cartPatchMatch[1], Number(body.delta || 0));
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  if (method === 'DELETE' && pathname === '/api/cart') {
    clearCart(scopedStore);
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  if (method === 'POST' && pathname === '/api/orders') {
    const body = await readRequestBody(request);
    const items = normalizeOrderItems(body.items);
    const order = placeOrder(scopedStore, items);
    if (!order) {
      sendJson(request, response, 400, { error: 'No order items available.' });
      return;
    }
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    incrementMetric('ordersPlacedTotal');
    logAuditEvent(store, authenticatedUser.id, 'orders', 'place_order', order.id, {
      vendorName: order.vendorName,
      subtotal: order.subtotal,
    });
    await saveStore(store);
    sendJson(request, response, 200, order);
    return;
  }

  if (method === 'POST' && pathname === '/api/payments/checkout') {
    if (rateLimit(request, response, `checkout:${authenticatedUser.id}`, 20, 5 * 60 * 1000)) {
      return;
    }

    const body = await readRequestBody(request);
    const items = normalizeOrderItems(body.items);
    const paymentMethod = body.paymentMethod || 'card';
    const previewStore = snapshotStore(scopedStore);
    const previewOrder = placeOrder(previewStore, items);

    if (!previewOrder) {
      sendJson(request, response, 400, { error: 'Nothing to check out.' });
      return;
    }

    const totalAmount = previewOrder.subtotal + previewOrder.deliveryFee;
    incrementMetric('paymentsCreatedTotal');
    const payment = await createCheckoutPayment({
      amount: totalAmount,
      customerEmail: authenticatedUser.email,
      description: `${config.appName} order ${previewOrder.vendorName}`,
      metadata: {
        userId: authenticatedUser.id,
        vendorId: previewOrder.vendorId,
        paymentMethod,
      },
    });

    const paymentRecord = {
      id: `payment-${Date.now()}`,
      userId: authenticatedUser.id,
      orderId: previewOrder.id,
      provider: payment.provider,
      method: paymentMethod,
      amount: totalAmount,
      currency: payment.currency,
      status: payment.status,
      externalId: payment.paymentIntentId,
      createdAtLabel: 'Just now',
    };

    store.payments.unshift(paymentRecord);

    let committedOrder = null;
    if (paymentMethod === 'cash_on_delivery' || payment.status === 'succeeded') {
      committedOrder = placeOrder(scopedStore, items);
      persistScopedStore(store, authenticatedUser.id, scopedStore);
      incrementMetric('ordersPlacedTotal');
      incrementMetric('paymentsSucceededTotal');
    }

    logAuditEvent(store, authenticatedUser.id, 'payments', 'checkout', paymentRecord.id, {
      amount: totalAmount,
      provider: payment.provider,
      status: payment.status,
      committedOrderId: committedOrder?.id || null,
    });
    await saveStore(store);

    sendJson(request, response, 200, {
      payment: paymentRecord,
      order: committedOrder,
      clientSecret: payment.clientSecret,
      requiresClientConfirmation:
        payment.provider === 'stripe' &&
        payment.status !== 'succeeded' &&
        paymentMethod === 'card',
      bootstrap: createBootstrap(scopedStore),
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/payments/history') {
    sendJson(
      request,
      response,
      200,
      store.payments.filter((payment) => payment.userId === authenticatedUser.id),
    );
    return;
  }

  const taskToggleMatch = pathname.match(/^\/api\/tasks\/([^/]+)\/toggle$/);
  if (method === 'PATCH' && taskToggleMatch) {
    toggleTask(scopedStore, taskToggleMatch[1]);
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  if (method === 'POST' && pathname === '/api/tasks') {
    const body = await readRequestBody(request);
    addTask(scopedStore, body.section, body.title);
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  const habitToggleMatch = pathname.match(/^\/api\/habits\/([^/]+)\/toggle$/);
  if (method === 'PATCH' && habitToggleMatch) {
    toggleHabitToday(scopedStore, habitToggleMatch[1]);
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  if (method === 'POST' && pathname === '/api/health/water/log') {
    const body = await readRequestBody(request);
    logWater(scopedStore, Number(body.amount || 1));
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  const workoutToggleMatch = pathname.match(/^\/api\/workouts\/([^/]+)\/toggle$/);
  if (method === 'PATCH' && workoutToggleMatch) {
    toggleWorkout(scopedStore, workoutToggleMatch[1]);
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  const mealToggleMatch = pathname.match(/^\/api\/meals\/([^/]+)\/toggle$/);
  if (method === 'PATCH' && mealToggleMatch) {
    toggleMeal(scopedStore, mealToggleMatch[1]);
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  if (method === 'POST' && pathname === '/api/mood') {
    const body = await readRequestBody(request);
    setMood(scopedStore, body.mood);
    persistScopedStore(store, authenticatedUser.id, scopedStore);
    await saveStore(store);
    sendJson(request, response, 200, createBootstrap(scopedStore));
    return;
  }

  if (method === 'GET' && pathname === '/api/admin/overview') {
    const admin = requireAuth(store, request, response, ['admin']);
    if (!admin) {
      return;
    }
    sendJson(request, response, 200, buildAdminOverview(store, snapshotMetrics()));
    return;
  }

  if (method === 'GET' && pathname === '/api/admin/users') {
    const admin = requireAuth(store, request, response, ['admin']);
    if (!admin) {
      return;
    }
    sendJson(
      request,
      response,
      200,
      store.users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        vendorId: user.vendorId || null,
        profile: user.profile,
      })),
    );
    return;
  }

  if (method === 'GET' && pathname === '/api/admin/vendors') {
    const admin = requireAuth(store, request, response, ['admin']);
    if (!admin) {
      return;
    }
    sendJson(request, response, 200, store.platform.vendors);
    return;
  }

  if (method === 'GET' && pathname === '/api/vendor/dashboard') {
    const vendor = requireAuth(store, request, response, ['vendor']);
    if (!vendor) {
      return;
    }
    sendJson(request, response, 200, buildVendorDashboard(store, vendor));
    return;
  }

  if (method === 'POST' && pathname === '/api/vendor/products') {
    const vendor = requireAuth(store, request, response, ['vendor']);
    if (!vendor) {
      return;
    }

    const body = await readRequestBody(request);
    const product = {
      id: `product-${Date.now()}`,
      vendorId: vendor.vendorId,
      category: body.category || 'food',
      name: String(body.name || '').trim(),
      description: String(body.description || '').trim(),
      price: Number(body.price || 0),
      imageUrl: String(body.imageUrl || ''),
      emoji: String(body.emoji || 'N'),
      calories: body.calories ? Number(body.calories) : undefined,
      proteinGrams: body.proteinGrams ? Number(body.proteinGrams) : undefined,
      stockLabel: Number(body.stockCount || 0) > 0 ? 'In stock' : 'Low stock',
      stockCount: Number(body.stockCount || 0),
      featured: Boolean(body.featured),
      active: true,
      tags: Array.isArray(body.tags)
        ? body.tags.filter(Boolean)
        : String(body.tags || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
    };

    if (!product.name || product.price <= 0) {
      sendJson(request, response, 400, { error: 'Product name and price are required.' });
      return;
    }

    store.platform.products.unshift(product);
    logAuditEvent(store, vendor.id, 'vendor', 'create_product', product.id, {
      name: product.name,
      price: product.price,
    });
    await saveStore(store);
    sendJson(request, response, 201, product);
    return;
  }

  const vendorProductPatchMatch = pathname.match(/^\/api\/vendor\/products\/([^/]+)$/);
  if (method === 'PATCH' && vendorProductPatchMatch) {
    const vendor = requireAuth(store, request, response, ['vendor']);
    if (!vendor) {
      return;
    }

    const product = store.platform.products.find(
      (entry) =>
        entry.id === vendorProductPatchMatch[1] && entry.vendorId === vendor.vendorId,
    );

    if (!product) {
      sendJson(request, response, 404, { error: 'Product not found.' });
      return;
    }

    const body = await readRequestBody(request);
    product.name = body.name ? String(body.name) : product.name;
    product.description = body.description ? String(body.description) : product.description;
    product.price = body.price ? Number(body.price) : product.price;
    product.stockCount =
      body.stockCount !== undefined ? Number(body.stockCount) : product.stockCount;
    product.active = body.active !== undefined ? Boolean(body.active) : product.active;
    product.featured =
      body.featured !== undefined ? Boolean(body.featured) : product.featured;
    product.stockLabel = Number(product.stockCount || 0) > 0 ? 'In stock' : 'Low stock';

    logAuditEvent(store, vendor.id, 'vendor', 'update_product', product.id, {
      price: product.price,
      stockCount: product.stockCount,
      active: product.active,
    });
    await saveStore(store);
    sendJson(request, response, 200, product);
    return;
  }

  if (method === 'POST' && pathname === '/api/reset') {
    const admin = requireAuth(store, request, response, ['admin']);
    if (!admin) {
      return;
    }
    sendJson(request, response, 200, await resetStore());
    return;
  }

  sendJson(request, response, 404, { error: 'Route not found' });
}
