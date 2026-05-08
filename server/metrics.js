function createInitialCounters() {
  return {
    httpRequestsTotal: 0,
    authLoginsTotal: 0,
    authFailuresTotal: 0,
    assistantQueriesTotal: 0,
    ordersPlacedTotal: 0,
    paymentsCreatedTotal: 0,
    paymentsSucceededTotal: 0,
  };
}

const counters = createInitialCounters();

export function incrementMetric(name, amount = 1) {
  if (!(name in counters)) {
    counters[name] = 0;
  }
  counters[name] += amount;
}

export function snapshotMetrics() {
  return { ...counters };
}

export function formatPrometheusMetrics() {
  return [
    '# HELP aios_http_requests_total Total HTTP requests handled by AIOS.',
    '# TYPE aios_http_requests_total counter',
    `aios_http_requests_total ${counters.httpRequestsTotal}`,
    '# HELP aios_auth_logins_total Successful login attempts.',
    '# TYPE aios_auth_logins_total counter',
    `aios_auth_logins_total ${counters.authLoginsTotal}`,
    '# HELP aios_auth_failures_total Failed login or register attempts.',
    '# TYPE aios_auth_failures_total counter',
    `aios_auth_failures_total ${counters.authFailuresTotal}`,
    '# HELP aios_assistant_queries_total AI assistant requests.',
    '# TYPE aios_assistant_queries_total counter',
    `aios_assistant_queries_total ${counters.assistantQueriesTotal}`,
    '# HELP aios_orders_placed_total Orders placed by customers.',
    '# TYPE aios_orders_placed_total counter',
    `aios_orders_placed_total ${counters.ordersPlacedTotal}`,
    '# HELP aios_payments_created_total Payment checkout requests created.',
    '# TYPE aios_payments_created_total counter',
    `aios_payments_created_total ${counters.paymentsCreatedTotal}`,
    '# HELP aios_payments_succeeded_total Successful payments.',
    '# TYPE aios_payments_succeeded_total counter',
    `aios_payments_succeeded_total ${counters.paymentsSucceededTotal}`,
    '',
  ].join('\n');
}
