import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearStoredToken,
  fetchCurrentUser,
  loginApi,
  logoutApi,
  registerApi,
} from '../lib/api';
import type { AuthUser } from '../types/aios';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  city?: string;
  state?: string;
  street?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const nextUser = await fetchCurrentUser();
      setUser(nextUser);
    } catch {
      clearStoredToken();
      setUser(null);
    }
  };

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const nextUser = await fetchCurrentUser();
        if (active) {
          setUser(nextUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: async (email, password) => {
        const session = await loginApi(email, password);
        setUser(session.user);
        return session.user;
      },
      register: async (input) => {
        const session = await registerApi(input);
        setUser(session.user);
        return session.user;
      },
      logout: async () => {
        await logoutApi();
        setUser(null);
      },
      refreshUser: async () => {
        await refreshUser();
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
