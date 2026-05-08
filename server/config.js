function parseOrigins(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3001),
  authSecret: process.env.AUTH_SECRET || 'aios-dev-secret-change-me',
  databaseUrl: process.env.DATABASE_URL || '',
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS || 'http://localhost:5173'),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeBaseUrl: process.env.STRIPE_BASE_URL || 'https://api.stripe.com/v1',
  paymentCurrency: process.env.PAYMENT_CURRENCY || 'usd',
  appName: process.env.APP_NAME || 'AIOS',
  useMockPayments: String(process.env.USE_MOCK_PAYMENTS || 'true') !== 'false',
};
