import { useEffect, useMemo, useState } from 'react';
import { Box, DollarSign, PackagePlus, Save, Store } from 'lucide-react';
import {
  createVendorProductApi,
  fetchVendorDashboard,
  updateVendorProductApi,
} from '../lib/api';
import type { Product, VendorDashboard } from '../types/aios';
import { formatCurrency } from '../lib/formatters';

const emptyProduct = {
  name: '',
  description: '',
  price: '0',
  stockCount: '0',
  tags: 'healthy, fresh',
};

export default function VendorPortal() {
  const [dashboard, setDashboard] = useState<VendorDashboard | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refreshDashboard = async () => {
    const nextDashboard = await fetchVendorDashboard();
    setDashboard(nextDashboard);
  };

  useEffect(() => {
    void (async () => {
      try {
        await refreshDashboard();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Revenue', value: formatCurrency(dashboard?.revenue || 0), icon: DollarSign },
      { label: 'Products', value: dashboard?.products.length || 0, icon: Box },
      { label: 'Low Stock', value: dashboard?.lowStockProducts.length || 0, icon: Store },
    ],
    [dashboard],
  );

  const saveNewProduct = async () => {
    setSaving(true);
    try {
      await createVendorProductApi({
        category: 'food',
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stockCount: Number(form.stockCount),
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      } as Partial<Product>);
      setForm(emptyProduct);
      await refreshDashboard();
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = async (product: Product) => {
    await updateVendorProductApi(product.id, { active: !(product.active ?? true) });
    await refreshDashboard();
  };

  if (loading) {
    return <div className="p-6 text-[#666]">Loading vendor portal...</div>;
  }

  if (!dashboard) {
    return <div className="p-6 text-[#666]">Vendor dashboard is unavailable.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-6">
      <div className="mb-6 rounded-3xl bg-[#222222] p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C2DBC4]">
            <Store size={20} className="text-[#222222]" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>
              {dashboard.vendor?.name || 'Vendor Portal'}
            </h1>
            <p style={{ fontSize: '13px' }} className="text-white/55">
              Manage products, watch inventory, and track orders.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
            <stat.icon size={18} className="text-[#7BAF80]" />
            <p style={{ fontSize: '24px', fontWeight: 700 }} className="mt-3 text-[#222222]">
              {stat.value}
            </p>
            <p style={{ fontSize: '12px' }} className="text-[#888]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <PackagePlus size={18} className="text-[#7BAF80]" />
            <h2 style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
              Add Product
            </h2>
          </div>
          <div className="space-y-3">
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Product name"
              className="w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none"
            />
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Description"
              className="min-h-28 w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({ ...current, price: event.target.value }))
                }
                placeholder="Price"
                className="w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none"
              />
              <input
                value={form.stockCount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, stockCount: event.target.value }))
                }
                placeholder="Stock count"
                className="w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none"
              />
            </div>
            <input
              value={form.tags}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
              placeholder="Tags, comma separated"
              className="w-full rounded-2xl border border-[#C2DBC4]/30 bg-[#F5FAF5] px-4 py-3 outline-none"
            />
            <button
              onClick={() => void saveNewProduct()}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#222222] px-4 py-3 text-white transition-colors hover:bg-[#333333] disabled:opacity-70"
              style={{ fontSize: '14px', fontWeight: 700 }}
            >
              {saving ? 'Saving...' : 'Publish Product'}
              <Save size={15} />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[#C2DBC4]/20 bg-white p-5">
          <h2 style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
            Catalog
          </h2>
          <div className="mt-4 space-y-3">
            {dashboard.products.map((product) => (
              <div key={product.id} className="rounded-2xl bg-[#F5FAF5] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#222222]">
                      {product.name}
                    </p>
                    <p style={{ fontSize: '11px' }} className="text-[#888]">
                      {formatCurrency(product.price)} • {product.stockCount ?? 0} in stock
                    </p>
                  </div>
                  <button
                    onClick={() => void toggleProduct(product)}
                    className={`rounded-full px-3 py-1.5 ${
                      product.active === false
                        ? 'bg-[#222222] text-white'
                        : 'bg-white text-[#666]'
                    }`}
                    style={{ fontSize: '11px', fontWeight: 700 }}
                  >
                    {product.active === false ? 'Activate' : 'Active'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
