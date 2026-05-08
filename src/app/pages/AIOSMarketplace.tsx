import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Filter,
  Heart,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAiosApp } from '../state/AiosAppContext';
import type { PaymentMethod, VendorCategory } from '../types/aios';
import { formatCurrency } from '../lib/formatters';

const categories: Array<{ id: VendorCategory; label: string; description: string }> = [
  { id: 'food', label: 'Food', description: 'Meals and drinks' },
  { id: 'fashion', label: 'Fashion', description: 'Style nearby' },
  { id: 'groceries', label: 'Groceries', description: 'Daily essentials' },
  { id: 'pharmacy', label: 'Pharmacy', description: 'Health needs' },
  { id: 'electronics', label: 'Electronics', description: 'Quick tech' },
];

export default function AIOSMarketplace() {
  const {
    activeOrder,
    addCartItem,
    cartCount,
    cartItems,
    cartSubtotal,
    checkoutCart,
    products,
    profile,
    updateCartQuantity,
    vendors,
  } = useAiosApp();
  const [activeCategory, setActiveCategory] = useState<VendorCategory>('food');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const selectedVendor = vendors.find((vendor) => vendor.id === selectedVendorId) ?? null;
  const categoryVendors = vendors.filter((vendor) => vendor.category === activeCategory);
  const visibleVendors = categoryVendors.filter((vendor) =>
    `${vendor.name} ${vendor.subtitle}`.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const categoryProducts = products.filter((product) => product.category === activeCategory);
  const visibleProducts = categoryProducts.filter((product) =>
    `${product.name} ${product.description} ${product.tags.join(' ')}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );
  const vendorProducts = selectedVendor
    ? products.filter((product) => product.vendorId === selectedVendor.id)
    : [];

  const checkout = async () => {
    setCheckoutBusy(true);
    setCheckoutMessage('');
    const result = await checkoutCart(paymentMethod);
    setCheckoutBusy(false);
    if (!result) {
      setCheckoutMessage('Checkout failed. Make sure the backend is running and try again.');
      return;
    }
    setCartOpen(false);
    setShowSuccess(true);
    if (result.requiresClientConfirmation) {
      setCheckoutMessage(
        'PaymentIntent created. Add Stripe Elements on the client to confirm live card payments.',
      );
    }
    window.setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-6">
      {showSuccess ? (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-2xl border border-[#C2DBC4]/30 bg-[#222222] px-5 py-4 text-white shadow-2xl">
          <CheckCircle2 size={20} className="text-[#C2DBC4]" />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700 }}>Order placed</p>
            <p style={{ fontSize: '12px' }} className="text-[#C2DBC4]">
              Marketplace, finance, and health are now updated.
            </p>
          </div>
        </div>
      ) : null}

      {checkoutMessage ? (
        <div className="mb-4 rounded-2xl border border-[#C2DBC4]/30 bg-white px-4 py-3 text-[#555]">
          <p style={{ fontSize: '12px', fontWeight: 700 }}>{checkoutMessage}</p>
        </div>
      ) : null}

      <div className="mb-5">
        <h1 style={{ fontSize: '24px', fontWeight: 700 }} className="text-[#222222]">
          Marketplace
        </h1>
        <div className="mt-1 flex items-center gap-2 text-[#888]">
          <MapPin size={13} className="text-[#C2DBC4]" />
          <span style={{ fontSize: '13px' }}>
            Delivering to {profile.address.street}, {profile.address.city}, {profile.address.state}
          </span>
        </div>
      </div>

      <div className="mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]"
          />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={`Search ${activeCategory} nearby...`}
            className="w-full rounded-xl border border-[#C2DBC4]/30 bg-white py-2.5 pl-9 pr-4 text-[#222222] outline-none transition-colors placeholder:text-[#bbb] focus:border-[#C2DBC4]"
            style={{ fontSize: '14px' }}
          />
        </div>
        <button className="rounded-xl border border-[#C2DBC4]/30 bg-white p-2.5 transition-colors hover:bg-[#E8F3E9]">
          <Filter size={18} className="text-[#666]" />
        </button>
        <button
          onClick={() => setCartOpen(true)}
          className="relative rounded-xl bg-[#222222] p-2.5 text-white transition-colors hover:bg-[#333333]"
        >
          <ShoppingCart size={18} />
          {cartCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#C2DBC4] text-[#222222]">
              <span style={{ fontSize: '10px', fontWeight: 700 }}>{cartCount}</span>
            </span>
          ) : null}
        </button>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setSelectedVendorId(null);
            }}
            className={`rounded-xl border px-4 py-2 text-left transition-all ${
              activeCategory === category.id
                ? 'border-[#222222] bg-[#222222] text-white'
                : 'border-[#C2DBC4]/30 bg-white text-[#666] hover:border-[#C2DBC4]'
            }`}
          >
            <p style={{ fontSize: '13px', fontWeight: 700 }}>{category.label}</p>
            <p style={{ fontSize: '10px' }} className="opacity-70">
              {category.description}
            </p>
          </button>
        ))}
      </div>

      {activeOrder ? (
        <div className="mb-5 rounded-2xl border border-[#C2DBC4]/30 bg-[#E8F3E9] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C2DBC4]">
              <Truck size={16} className="text-[#222222]" />
            </div>
            <div className="min-w-0 flex-1">
              <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#222222]">
                Active order: {activeOrder.vendorName}
              </p>
              <p style={{ fontSize: '11px' }} className="text-[#666]">
                {activeOrder.etaLabel} • {activeOrder.status}
              </p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#7BAF80]"
              style={{ width: `${activeOrder.progressPct}%` }}
            />
          </div>
        </div>
      ) : null}

      {activeCategory === 'food' && !selectedVendor ? (
        <div>
          <div className="mb-5 rounded-3xl bg-[#222222] p-6 text-white">
            <p
              style={{ fontSize: '11px', fontWeight: 700 }}
              className="mb-1 uppercase tracking-[0.2em] text-[#C2DBC4]"
            >
              Smart nearby food
            </p>
            <h2 style={{ fontSize: '22px', fontWeight: 700 }}>
              Order dinner, lunch, or a fast healthy fix.
            </h2>
            <p style={{ fontSize: '13px' }} className="mt-2 text-white/60">
              AIOS keeps vendors, ETA, and budget in the same flow.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visibleVendors.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => setSelectedVendorId(vendor.id)}
                className="group overflow-hidden rounded-2xl border border-[#C2DBC4]/20 bg-white text-left transition-all hover:border-[#C2DBC4] hover:shadow-md"
              >
                <div className="relative h-40">
                  <ImageWithFallback
                    src={vendor.imageUrl}
                    alt={vendor.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-lg bg-[#222222] px-2.5 py-1 text-[#C2DBC4]">
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>
                      {vendor.badge ?? vendor.tag}
                    </span>
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222]">
                      {vendor.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[#333]">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>{vendor.rating}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px' }} className="mb-2 text-[#888]">
                    {vendor.subtitle}
                  </p>
                  <div className="flex items-center gap-3 text-[#666]">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span style={{ fontSize: '12px' }}>{vendor.etaLabel}</span>
                    </div>
                    <span style={{ fontSize: '12px' }}>
                      {vendor.deliveryFee === 0 ? 'Free delivery' : formatCurrency(vendor.deliveryFee)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {activeCategory === 'food' && selectedVendor ? (
        <div>
          <button
            onClick={() => setSelectedVendorId(null)}
            className="mb-4 flex items-center gap-2 text-[#666] transition-colors hover:text-[#222222]"
            style={{ fontSize: '14px' }}
          >
            <ArrowLeft size={16} />
            Back to restaurants
          </button>

          <div className="relative mb-5 overflow-hidden rounded-3xl bg-[#222222]">
            <ImageWithFallback
              src={selectedVendor.imageUrl}
              alt={selectedVendor.name}
              className="h-52 w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h2 style={{ fontSize: '26px', fontWeight: 700 }} className="text-white">
                {selectedVendor.name}
              </h2>
              <p style={{ fontSize: '13px' }} className="mt-1 text-white/60">
                {selectedVendor.subtitle}
              </p>
              <div className="mt-3 flex items-center gap-3 text-white/70">
                <span style={{ fontSize: '12px' }}>{selectedVendor.etaLabel}</span>
                <span style={{ fontSize: '12px' }}>{selectedVendor.distanceKm} km away</span>
                <span style={{ fontSize: '12px' }}>{selectedVendor.rating} rating</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {vendorProducts.map((product) => {
              const cartItem = cartItems.find((item) => item.product.id === product.id);
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl border border-[#C2DBC4]/20 bg-white p-3"
                >
                  <ImageWithFallback
                    src={product.imageUrl ?? selectedVendor.imageUrl}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#222222]">
                      {product.name}
                    </p>
                    <p style={{ fontSize: '11px' }} className="text-[#888]">
                      {product.description}
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: 700 }} className="mt-1 text-[#222222]">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  {cartItem ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(product.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#222222] text-white"
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 700 }} className="w-4 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => addCartItem(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C2DBC4] text-[#222222]"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addCartItem(product.id)}
                      className="rounded-lg bg-[#C2DBC4] px-3 py-2 text-[#222222] transition-colors hover:bg-[#a7c9aa]"
                      style={{ fontSize: '12px', fontWeight: 700 }}
                    >
                      Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {activeCategory !== 'food' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => {
            const vendor = vendors.find((entry) => entry.id === product.vendorId);
            const cartItem = cartItems.find((item) => item.product.id === product.id);
            if (!vendor) {
              return null;
            }
            return (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border border-[#C2DBC4]/20 bg-white transition-all hover:border-[#C2DBC4] hover:shadow-md"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={product.imageUrl ?? vendor.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
                  >
                    <Heart
                      size={15}
                      className={
                        wishlist.includes(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-[#888]'
                      }
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#222222]">
                      {product.name}
                    </p>
                    <span
                      style={{ fontSize: '10px', fontWeight: 700 }}
                      className="rounded-full bg-[#F5FAF5] px-2 py-1 text-[#666]"
                    >
                      {vendor.name}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px' }} className="text-[#888]">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#222222]">
                        {formatCurrency(product.price)}
                      </p>
                      <p style={{ fontSize: '10px' }} className="text-[#aaa]">
                        {product.stockLabel ?? vendor.etaLabel}
                      </p>
                    </div>
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(product.id, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#222222] text-white"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 700 }} className="w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => addCartItem(product.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C2DBC4] text-[#222222]"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addCartItem(product.id)}
                        className="rounded-lg bg-[#222222] px-3 py-2 text-white transition-colors hover:bg-[#333333]"
                        style={{ fontSize: '12px', fontWeight: 700 }}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {cartOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#C2DBC4]/20 p-5">
              <h2 style={{ fontSize: '18px', fontWeight: 700 }} className="text-[#222222]">
                Your Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-1.5 transition-colors hover:bg-[#E8F3E9]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart size={40} className="mb-3 text-[#ccc]" />
                  <p style={{ fontSize: '14px' }} className="text-[#888]">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 rounded-xl bg-[#F5FAF5] p-3"
                  >
                    <ImageWithFallback
                      src={item.product.imageUrl ?? item.vendor.imageUrl}
                      alt={item.product.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p style={{ fontSize: '13px', fontWeight: 700 }} className="truncate text-[#222222]">
                        {item.product.name}
                      </p>
                      <p style={{ fontSize: '11px' }} className="truncate text-[#888]">
                        {item.vendor.name}
                      </p>
                      <p style={{ fontSize: '12px' }} className="text-[#666]">
                        {formatCurrency(item.product.price)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-[#ddd] bg-white"
                      >
                        <Minus size={11} />
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 700 }} className="w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addCartItem(item.product.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-[#222222] text-white"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 ? (
              <div className="border-t border-[#C2DBC4]/20 p-5">
                <div className="mb-4 rounded-2xl bg-[#F5FAF5] p-3">
                  <p style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#222222]">
                    Payment Method
                  </p>
                  <div className="mt-2 grid gap-2">
                    {([
                      { id: 'card', label: 'Card / online payment' },
                      { id: 'cash_on_delivery', label: 'Cash on delivery' },
                    ] as const).map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setPaymentMethod(option.id)}
                        className={`rounded-xl border px-3 py-2 text-left transition-all ${
                          paymentMethod === option.id
                            ? 'border-[#222222] bg-[#222222] text-white'
                            : 'border-[#C2DBC4]/30 bg-white text-[#666]'
                        }`}
                        style={{ fontSize: '12px', fontWeight: 700 }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3 flex justify-between">
                  <span style={{ fontSize: '14px' }} className="text-[#666]">
                    Subtotal
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#222222]">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
                <div className="mb-3 flex justify-between">
                  <span style={{ fontSize: '14px' }} className="text-[#666]">
                    Delivery
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700 }} className="text-[#222222]">
                    Calculated at checkout
                  </span>
                </div>
                <button
                  onClick={() => void checkout()}
                  disabled={checkoutBusy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#222222] px-4 py-3 text-white transition-colors hover:bg-[#333333]"
                  style={{ fontSize: '15px', fontWeight: 700 }}
                >
                  <Package size={16} />
                  {checkoutBusy ? 'Processing...' : 'Checkout with AIOS'}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
