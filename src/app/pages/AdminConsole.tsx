import { useEffect, useState } from 'react';
import { Activity, Shield, Store, Users } from 'lucide-react';
import { fetchAdminOverview, fetchAdminUsers } from '../lib/api';
import type { AdminOverview, AuthUser } from '../types/aios';
import { formatCurrency } from '../lib/formatters';

export default function AdminConsole() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const [nextOverview, nextUsers] = await Promise.all([
          fetchAdminOverview(),
          fetchAdminUsers(),
        ]);
        if (active) {
          setOverview(nextOverview);
          setUsers(nextUsers);
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

  if (loading) {
    return <div className="p-6 text-[#666]">Loading admin console...</div>;
  }

  if (!overview) {
    return <div className="p-6 text-[#666]">Admin data is unavailable.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-6">
      <div className="mb-6 rounded-3xl bg-[#222222] p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C2DBC4]">
            <Shield size={20} className="text-[#222222]" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Admin Console</h1>
            <p style={{ fontSize: '13px' }} className="text-white/55">
              Platform analytics, operational health, and audit visibility.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Users', value: overview.usersCount, icon: Users },
          { label: 'Vendors', value: overview.vendorsCount, icon: Store },
          { label: 'Active Orders', value: overview.activeOrders, icon: Activity },
          { label: 'Monthly GMV', value: formatCurrency(overview.monthlyGmv), icon: Shield },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <card.icon size={18} className="text-[#7BAF80]" />
            <p style={{ fontSize: '25px', fontWeight: 700 }} className="mt-3 text-[#222222]">
              {card.value}
            </p>
            <p style={{ fontSize: '12px' }} className="text-[#888]">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
              Recent Audit Events
            </h2>
            <span style={{ fontSize: '12px' }} className="text-[#888]">
              Payment success rate {overview.paymentSuccessRate}%
            </span>
          </div>
          <div className="space-y-3">
            {overview.recentAuditEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-[#F0F4F0] bg-[#FAFCFA] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
                      {event.action.replaceAll('_', ' ')}
                    </p>
                    <p style={{ fontSize: '11px' }} className="text-[#888]">
                      {event.actor.profile.name} • {event.scope}
                    </p>
                  </div>
                  <span style={{ fontSize: '11px' }} className="text-[#999]">
                    {event.createdAtLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
          <h2 style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
            User Accounts
          </h2>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl bg-[#F5FAF5] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
                      {user.profile.name}
                    </p>
                    <p style={{ fontSize: '11px' }} className="text-[#777]">
                      {user.email}
                    </p>
                  </div>
                  <span
                    style={{ fontSize: '11px', fontWeight: 700 }}
                    className="rounded-full bg-white px-2.5 py-1 text-[#666]"
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
