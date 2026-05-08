import { CreditCard, MapPin, Shield, Sparkles, UserCircle, Wallet } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAiosApp } from '../state/AiosAppContext';
import { useAuth } from '../state/AuthContext';
import { formatCurrency } from '../lib/formatters';

export default function AccountPage() {
  const { user } = useAuth();
  const {
    profile,
    paymentHistory,
    recentOrders,
    healthScore,
    productivityScore,
    savingsRate,
    notifications,
  } = useAiosApp();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 lg:p-6">
      <div className="rounded-[32px] bg-[#222222] p-6 text-white lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-20 w-20 rounded-3xl border-4 border-[#C2DBC4]/30 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 style={{ fontSize: '28px', fontWeight: 700 }}>{profile.name}</h1>
                <span
                  style={{ fontSize: '10px', fontWeight: 700 }}
                  className="rounded-full bg-[#C2DBC4]/15 px-2.5 py-1 uppercase tracking-[0.18em] text-[#C2DBC4]"
                >
                  {user.role}
                </span>
              </div>
              <p style={{ fontSize: '13px' }} className="mt-1 text-white/55">
                @{profile.username || user.email.split('@')[0]} • {profile.city}, {profile.state}
              </p>
              <p style={{ fontSize: '13px' }} className="mt-2 max-w-xl text-white/70">
                {profile.bio || 'AIOS account synced with your daily life, orders, and routines.'}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p style={{ fontSize: '11px', fontWeight: 700 }} className="uppercase tracking-[0.2em] text-[#C2DBC4]">
              Membership
            </p>
            <p style={{ fontSize: '18px', fontWeight: 700 }} className="mt-2">
              {profile.membership}
            </p>
            <p style={{ fontSize: '12px' }} className="mt-1 text-white/50">
              Auth, payments, AI, and role-aware access are active in this prototype.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Health Score', value: `${healthScore.toFixed(0)}/100`, icon: Sparkles },
          { label: 'Productivity', value: `${productivityScore}%`, icon: UserCircle },
          { label: 'Savings Rate', value: `${savingsRate}%`, icon: Wallet },
          { label: 'Unread Alerts', value: notifications.filter((item) => item.unread).length, icon: Shield },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <card.icon size={18} className="text-[#7BAF80]" />
            <p style={{ fontSize: '24px', fontWeight: 700 }} className="mt-3 text-[#222222]">
              {card.value}
            </p>
            <p style={{ fontSize: '12px' }} className="text-[#888]">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-[#7BAF80]" />
              <h2 style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
                Address
              </h2>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#222222]">
              {profile.address.label}
            </p>
            <p style={{ fontSize: '13px' }} className="mt-1 text-[#666]">
              {profile.address.street}, {profile.address.city}, {profile.address.state}
            </p>
            <p style={{ fontSize: '12px' }} className="mt-4 text-[#999]">
              This is the address used by the marketplace checkout flow.
            </p>
          </div>

          <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-[#7BAF80]" />
              <h2 style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
                Payment History
              </h2>
            </div>
            <div className="space-y-3">
              {paymentHistory.length === 0 ? (
                <p style={{ fontSize: '13px' }} className="text-[#888]">
                  No payment records yet.
                </p>
              ) : (
                paymentHistory.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="rounded-2xl bg-[#F5FAF5] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
                          {payment.provider} • {payment.method.replaceAll('_', ' ')}
                        </p>
                        <p style={{ fontSize: '11px' }} className="text-[#888]">
                          {payment.createdAtLabel}
                        </p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p style={{ fontSize: '11px' }} className="text-[#888]">
                          {payment.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
          <h2 style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
            Recent Orders
          </h2>
          <div className="mt-4 space-y-3">
            {recentOrders.length === 0 ? (
              <p style={{ fontSize: '13px' }} className="text-[#888]">
                No orders yet.
              </p>
            ) : (
              recentOrders.slice(0, 6).map((order) => (
                <div key={order.id} className="rounded-2xl bg-[#F5FAF5] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
                        {order.vendorName}
                      </p>
                      <p style={{ fontSize: '11px' }} className="text-[#888]">
                        {order.status} • {order.etaLabel}
                      </p>
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
                      {formatCurrency(order.subtotal + order.deliveryFee)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
