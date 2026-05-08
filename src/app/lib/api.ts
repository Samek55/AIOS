import type {
  AdminOverview,
  AppBootstrap,
  AssistantReply,
  AuthSession,
  AuthUser,
  CheckoutResult,
  PaymentMethod,
  PaymentRecord,
  Product,
  Vendor,
  VendorDashboard,
} from '../types/aios';

type ApiEnvelope<T> = {
  data: T;
};

const AUTH_TOKEN_KEY = 'aios_auth_token';

function getStoredToken() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

export function setStoredToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken() {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getStoredToken();
  const response = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const errorBody = (await response.json()) as { data?: { error?: string } };
      if (errorBody?.data?.error) {
        message = errorBody.data.error;
      }
    } catch {
      // Fall back to the default message when the response body is not JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function fetchDemoCredentials() {
  const response = await requestJson<
    ApiEnvelope<{
      customer: { email: string; password: string };
      vendor: { email: string; password: string };
      admin: { email: string; password: string };
    }>
  >('/demo-credentials');
  return response.data;
}

export async function loginApi(email: string, password: string) {
  const response = await requestJson<ApiEnvelope<AuthSession>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(response.data.token);
  return response.data;
}

export async function registerApi(input: {
  name: string;
  email: string;
  password: string;
  city?: string;
  state?: string;
  street?: string;
}) {
  const response = await requestJson<ApiEnvelope<AuthSession>>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  setStoredToken(response.data.token);
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await requestJson<ApiEnvelope<AuthUser>>('/auth/me');
  return response.data;
}

export async function logoutApi() {
  try {
    await requestJson<ApiEnvelope<{ success: boolean }>>('/auth/logout', {
      method: 'POST',
    });
  } finally {
    clearStoredToken();
  }
}

export async function fetchBootstrap() {
  const response = await requestJson<ApiEnvelope<AppBootstrap>>('/bootstrap');
  return response.data;
}

export async function queryAssistantApi(query: string) {
  const response = await requestJson<ApiEnvelope<AssistantReply>>('/assistant/query', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
  return response.data;
}

export async function syncApiMutation(path: string, init?: RequestInit) {
  return requestJson<ApiEnvelope<unknown>>(path, init);
}

export async function checkoutApi(items?: Array<{
  productId: string;
  quantity: number;
  unitPrice: number;
}>, paymentMethod: PaymentMethod = 'card') {
  const response = await requestJson<ApiEnvelope<CheckoutResult>>('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ items, paymentMethod }),
  });
  return response.data;
}

export async function fetchPaymentsHistory() {
  const response = await requestJson<ApiEnvelope<PaymentRecord[]>>('/payments/history');
  return response.data;
}

export async function fetchAdminOverview() {
  const response = await requestJson<ApiEnvelope<AdminOverview>>('/admin/overview');
  return response.data;
}

export async function fetchAdminUsers() {
  const response = await requestJson<ApiEnvelope<AuthUser[]>>('/admin/users');
  return response.data;
}

export async function fetchAdminVendors() {
  const response = await requestJson<ApiEnvelope<Vendor[]>>('/admin/vendors');
  return response.data;
}

export async function fetchVendorDashboard() {
  const response = await requestJson<ApiEnvelope<VendorDashboard>>('/vendor/dashboard');
  return response.data;
}

export async function createVendorProductApi(input: Partial<Product>) {
  const response = await requestJson<ApiEnvelope<Product>>('/vendor/products', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updateVendorProductApi(productId: string, input: Partial<Product>) {
  const response = await requestJson<ApiEnvelope<Product>>(`/vendor/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return response.data;
}
