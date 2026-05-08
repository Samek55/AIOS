import crypto from 'node:crypto';
import { config } from './config.js';

function toSmallestCurrencyUnit(amount) {
  return Math.round(Number(amount || 0) * 100);
}

export async function createCheckoutPayment({
  amount,
  currency = config.paymentCurrency,
  customerEmail,
  description,
  metadata = {},
}) {
  const normalizedAmount = toSmallestCurrencyUnit(amount);

  if (!config.stripeSecretKey || config.useMockPayments) {
    return {
      provider: 'mock',
      paymentIntentId: `pi_mock_${crypto.randomUUID().replaceAll('-', '')}`,
      clientSecret: `mock_secret_${crypto.randomUUID().replaceAll('-', '')}`,
      amount: normalizedAmount,
      currency,
      status: 'succeeded',
      metadata,
      description,
      customerEmail,
      isMock: true,
    };
  }

  const body = new URLSearchParams({
    amount: String(normalizedAmount),
    currency,
    'automatic_payment_methods[enabled]': 'true',
    description,
    receipt_email: customerEmail,
    metadata: JSON.stringify(metadata),
  });

  const response = await fetch(`${config.stripeBaseUrl}/payment_intents`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe checkout failed: ${response.status} ${text}`);
  }

  const paymentIntent = await response.json();

  return {
    provider: 'stripe',
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    metadata,
    description,
    customerEmail,
    isMock: false,
  };
}
