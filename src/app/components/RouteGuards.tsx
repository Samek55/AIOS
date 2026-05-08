import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../state/AuthContext';
import type { UserRole } from '../types/aios';

export function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5FAF5] text-[#222222]">
        <div className="rounded-2xl border border-[#C2DBC4]/30 bg-white px-6 py-5 shadow-sm">
          <p style={{ fontSize: '15px', fontWeight: 700 }}>Loading AIOS...</p>
          <p style={{ fontSize: '12px' }} className="mt-1 text-[#777]">
            Restoring your session and syncing your data.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function RequireRole({ roles }: { roles: UserRole[] }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function RequireAdmin() {
  return <RequireRole roles={['admin']} />;
}

export function RequireVendor() {
  return <RequireRole roles={['vendor']} />;
}
