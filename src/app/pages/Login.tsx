import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowRight, Bot, ShieldCheck, Store, UserRound } from 'lucide-react';
import { useAuth } from '../state/AuthContext';

const demoAccounts = [
  {
    label: 'Customer Demo',
    email: 'alex@aios.app',
    password: 'demo1234',
    icon: UserRound,
    description: 'Full marketplace, routine, health, and finance experience.',
  },
  {
    label: 'Vendor Demo',
    email: 'vendor@aios.app',
    password: 'vendor1234',
    icon: Store,
    description: 'Open the vendor dashboard and manage Green Kitchen.',
  },
  {
    label: 'Admin Demo',
    email: 'admin@aios.app',
    password: 'admin1234',
    icon: ShieldCheck,
    description: 'See platform metrics, users, vendors, and audit activity.',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex@aios.app');
  const [password, setPassword] = useState('demo1234');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [street, setStreet] = useState('123 Main St');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = useMemo(() => {
    const from = (location.state as { from?: string } | null)?.from;
    return from || '/';
  }, [location.state]);

  const handleSubmit = async () => {
    setBusy(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, city, state, street });
      }
      navigate(redirectTo, { replace: true });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const loginWithDemo = async (account: (typeof demoAccounts)[number]) => {
    setBusy(true);
    setError('');
    setMode('login');
    setEmail(account.email);
    setPassword(account.password);
    try {
      await login(account.email, account.password);
      navigate(redirectTo, { replace: true });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Demo login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAF5] px-4 py-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[32px] bg-[#222222] p-6 text-white lg:p-10">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C2DBC4]">
              <Bot size={20} className="text-[#222222]" />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 700 }}>AIOS</h1>
              <p style={{ fontSize: '12px' }} className="text-white/50">
                One app for your everyday life.
              </p>
            </div>
          </div>

          <p
            style={{ fontSize: '11px', fontWeight: 700 }}
            className="mb-2 uppercase tracking-[0.25em] text-[#C2DBC4]"
          >
            Production-style prototype
          </p>
          <h2 style={{ fontSize: '34px', fontWeight: 700, lineHeight: '1.1' }}>
            Local marketplace, AI assistant, payments, routines, and health in one platform.
          </h2>
          <p style={{ fontSize: '14px' }} className="mt-4 max-w-xl text-white/65">
            This build now includes auth, role-based dashboards, payment flows, monitoring,
            and a backend that can run with file storage or PostgreSQL.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {demoAccounts.map((account) => (
              <button
                key={account.label}
                onClick={() => void loginWithDemo(account)}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-[#C2DBC4]/40 hover:bg-white/10"
              >
                <account.icon size={18} className="text-[#C2DBC4]" />
                <p style={{ fontSize: '13px', fontWeight: 700 }} className="mt-3">
                  {account.label}
                </p>
                <p style={{ fontSize: '11px' }} className="mt-1 text-white/50">
                  {account.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-[#C2DBC4]/30 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex gap-2 rounded-2xl bg-[#F5FAF5] p-1">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`flex-1 rounded-xl px-4 py-2.5 transition-all ${
                  mode === tab
                    ? 'bg-[#222222] text-white'
                    : 'text-[#666] hover:text-[#222222]'
                }`}
                style={{ fontSize: '13px', fontWeight: 700 }}
              >
                {tab === 'login' ? 'Login' : 'Create account'}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {mode === 'register' ? (
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#444]">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none transition-colors focus:border-[#C2DBC4]"
                />
              </div>
            ) : null}

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#444]">
                Email
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none transition-colors focus:border-[#C2DBC4]"
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#444]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                className="mt-2 w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none transition-colors focus:border-[#C2DBC4]"
              />
            </div>

            {mode === 'register' ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#444]">
                    City
                  </label>
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none transition-colors focus:border-[#C2DBC4]"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#444]">
                    State
                  </label>
                  <input
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none transition-colors focus:border-[#C2DBC4]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#444]">
                    Street
                  </label>
                  <input
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none transition-colors focus:border-[#C2DBC4]"
                  />
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                <p style={{ fontSize: '12px', fontWeight: 700 }}>{error}</p>
              </div>
            ) : null}

            <button
              onClick={() => void handleSubmit()}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#222222] px-4 py-3 text-white transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-70"
              style={{ fontSize: '14px', fontWeight: 700 }}
            >
              {busy ? 'Please wait...' : mode === 'login' ? 'Login to AIOS' : 'Create AIOS account'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
