export type MobileBootstrap = {
  profile: {
    name: string;
    firstName: string;
    city: string;
  };
  mood: string;
  tasks: Array<{ id: string; title: string; completed: boolean }>;
  orders: Array<{ id: string; vendorName: string; status: string; etaLabel: string }>;
  health: {
    stepsToday: number;
    stepGoal: number;
    waterGlasses: number;
    waterGoal: number;
  };
};

const API_BASE = 'http://localhost:3001/api';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Unable to log in from mobile.');
  }

  const body = await response.json();
  return body.data as { token: string; user: { profile: { firstName: string } } };
}

export async function fetchBootstrap(token: string) {
  const response = await fetch(`${API_BASE}/bootstrap`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Unable to fetch bootstrap data.');
  }

  const body = await response.json();
  return body.data as MobileBootstrap;
}
