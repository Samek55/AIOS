function parseOrigins(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function parseNumber(value, defaultValue) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseNumber(process.env.PORT, 3001),
  authSecret: process.env.AUTH_SECRET || 'aios-dev-secret-change-me',
  databaseUrl: process.env.DATABASE_URL || '',
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS || 'http://localhost:5173'),
  maxRequestBodyBytes: parseNumber(process.env.MAX_REQUEST_BODY_BYTES, 1024 * 1024),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeBaseUrl: process.env.STRIPE_BASE_URL || 'https://api.stripe.com/v1',
  paymentCurrency: process.env.PAYMENT_CURRENCY || 'usd',
  appName: process.env.APP_NAME || 'AIOS',
  useMockPayments: parseBoolean(process.env.USE_MOCK_PAYMENTS, true),
  allowFileStorageInProduction: parseBoolean(process.env.ALLOW_FILE_STORAGE_IN_PRODUCTION, false),
  allowMockPaymentsInProduction: parseBoolean(process.env.ALLOW_MOCK_PAYMENTS_IN_PRODUCTION, false),
};

export function validateProductionConfig(currentConfig = config) {
  if (currentConfig.env !== 'production') {
    return [];
  }

  const errors = [];
  const localhostOrigin = currentConfig.allowedOrigins.find((origin) =>
    /localhost|127\.0\.0\.1|\*/i.test(origin),
  );

  if (
    !currentConfig.authSecret ||
    currentConfig.authSecret === 'aios-dev-secret-change-me' ||
    currentConfig.authSecret.length < 32
  ) {
    errors.push('AUTH_SECRET must be set to a unique 32+ character secret in production.');
  }

  if (!currentConfig.allowedOrigins.length || localhostOrigin) {
    errors.push('ALLOWED_ORIGINS must contain only deployed HTTPS origins in production.');
  }

  if (!currentConfig.databaseUrl && !currentConfig.allowFileStorageInProduction) {
    errors.push('DATABASE_URL is required in production unless ALLOW_FILE_STORAGE_IN_PRODUCTION=true.');
  }

  if (
    (currentConfig.useMockPayments || !currentConfig.stripeSecretKey) &&
    !currentConfig.allowMockPaymentsInProduction
  ) {
    errors.push('Stripe must be configured for production payments, or explicitly allow mock payments.');
  }

  if (errors.length) {
    throw new Error(`Invalid production configuration:\n- ${errors.join('\n- ')}`);
  }

  return errors;
}
