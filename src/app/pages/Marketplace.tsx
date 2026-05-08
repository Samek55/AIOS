import { useState } from 'react';
import {
  Search, ShoppingCart, Star, Clock, ChevronRight, Plus, Minus,
  MapPin, Filter, X, CheckCircle, Bike, Package, ArrowLeft, Heart
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const BURGER_IMG = 'https://images.unsplash.com/photo-1674876105548-520cc1e2c82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const PIZZA_IMG = 'https://images.unsplash.com/photo-1727198826083-6693684e4fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const SUSHI_IMG = 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const SALAD_IMG = 'https://images.unsplash.com/photo-1576402187658-44ca7d2c2c52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const FASHION_IMG = 'https://images.unsplash.com/photo-1524282745852-a463fa495a7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const MENS_IMG = 'https://images.unsplash.com/photo-1763610452349-11f2f9ab3767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const DRESS_IMG = 'https://images.unsplash.com/photo-1557771551-634f8d68b0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const GROCERIES_IMG = 'https://images.unsplash.com/photo-1610636996379-4d184e2ef20a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const DESSERT_IMG = 'https://images.unsplash.com/photo-1759426016293-1b8be5849a72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';

const categories = [
  { id: 'food', label: '🍔 Food', color: '#F97316' },
  { id: 'fashion', label: '👗 Fashion', color: '#C77DFF' },
  { id: 'groceries', label: '🛒 Groceries', color: '#0F766E' },
  { id: 'pharmacy', label: '💊 Pharmacy', color: '#2563EB' },
  { id: 'electronics', label: '📱 Electronics', color: '#F4C430' },
];

const restaurants = [
  { id: 1, name: 'Burger Republic', cuisine: 'American', rating: 4.8, time: '20-30 min', fee: '$1.99', img: BURGER_IMG, promo: '20% OFF', tag: 'Popular' },
  { id: 2, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.6, time: '25-35 min', fee: 'Free', img: PIZZA_IMG, promo: null, tag: 'Fast' },
  { id: 3, name: 'Tokyo Bites', cuisine: 'Japanese', rating: 4.9, time: '30-40 min', fee: '$2.50', img: SUSHI_IMG, promo: 'NEW', tag: 'Top Rated' },
  { id: 4, name: 'Green Kitchen', cuisine: 'Healthy', rating: 4.7, time: '15-25 min', fee: 'Free', img: SALAD_IMG, promo: null, tag: 'Healthy' },
];

const foodMenus: Record<number, { name: string; desc: string; price: number; emoji: string }[]> = {
  1: [
    { name: 'Classic Burger', desc: 'Beef patty, lettuce, tomato, special sauce', price: 12.99, emoji: '🍔' },
    { name: 'Cheese Deluxe', desc: 'Double patty, extra cheese, jalapeños', price: 15.99, emoji: '🧀' },
    { name: 'Crispy Chicken', desc: 'Fried chicken, coleslaw, pickles', price: 11.99, emoji: '🍗' },
    { name: 'Veggie Burger', desc: 'Plant-based patty, avocado, sprouts', price: 13.50, emoji: '🥑' },
    { name: 'Loaded Fries', desc: 'Crispy fries with cheese sauce & bacon', price: 7.99, emoji: '🍟' },
    { name: 'Milkshake', desc: 'Thick vanilla/chocolate/strawberry', price: 5.99, emoji: '🥤' },
  ],
  2: [
    { name: 'Margherita', desc: 'San Marzano tomato, fresh mozzarella, basil', price: 13.99, emoji: '🍕' },
    { name: 'Pepperoni', desc: 'Rich tomato sauce, pepperoni, mozzarella', price: 14.99, emoji: '🍕' },
    { name: 'BBQ Chicken', desc: 'BBQ sauce, grilled chicken, red onion', price: 15.99, emoji: '🍕' },
    { name: 'Four Cheese', desc: 'Mozzarella, parmesan, gorgonzola, brie', price: 16.99, emoji: '🍕' },
    { name: 'Tiramisu', desc: 'Classic Italian dessert, espresso soaked', price: 6.99, emoji: '🍰' },
    { name: 'Garlic Bread', desc: 'Toasted with herb butter and parmesan', price: 4.99, emoji: '🥖' },
  ],
  3: [
    { name: 'Salmon Nigiri (x2)', desc: 'Fresh Atlantic salmon over seasoned rice', price: 8.99, emoji: '🍣' },
    { name: 'Dragon Roll', desc: 'Shrimp tempura, avocado, tobiko', price: 16.99, emoji: '🍱' },
    { name: 'Miso Ramen', desc: 'Rich miso broth, soft egg, chashu pork', price: 14.50, emoji: '🍜' },
    { name: 'Edamame', desc: 'Steamed salted soybeans', price: 4.50, emoji: '🫛' },
    { name: 'Mochi Ice Cream', desc: 'Assorted flavors: matcha, mango, strawberry', price: 7.99, emoji: '🍡' },
    { name: 'Green Tea', desc: 'Premium Japanese sencha tea', price: 3.50, emoji: '🍵' },
  ],
  4: [
    { name: 'Power Bowl', desc: 'Quinoa, roasted veggies, tahini dressing', price: 13.99, emoji: '🥗' },
    { name: 'Avocado Toast', desc: 'Sourdough, smashed avo, poached egg', price: 11.50, emoji: '🥑' },
    { name: 'Açaí Bowl', desc: 'Açaí blend, banana, granola, berries', price: 12.99, emoji: '🫐' },
    { name: 'Smoothie', desc: 'Choose: Green Boost / Berry Blast / Mango Turmeric', price: 7.99, emoji: '🥤' },
    { name: 'Protein Wrap', desc: 'Grilled chicken, hummus, veggies, whole wheat', price: 10.99, emoji: '🌯' },
    { name: 'Energy Balls', desc: 'Oats, peanut butter, chocolate chips (x4)', price: 5.99, emoji: '🍪' },
  ],
};

const fashionItems = [
  { id: 'f1', name: 'Minimal White Tee', brand: 'Urban Style', price: 29.99, img: MENS_IMG, rating: 4.7, tag: 'Bestseller' },
  { id: 'f2', name: 'Floral Summer Dress', brand: 'Bloom Co.', price: 59.99, img: DRESS_IMG, rating: 4.8, tag: 'Trending' },
  { id: 'f3', name: 'Premium Denim Jacket', brand: 'Denim Lab', price: 89.99, img: FASHION_IMG, rating: 4.6, tag: 'New' },
  { id: 'f4', name: 'Striped Linen Shirt', brand: 'Coastal Wear', price: 45.99, img: MENS_IMG, rating: 4.5, tag: 'Sale -20%' },
  { id: 'f5', name: 'Maxi Boho Dress', brand: 'Bloom Co.', price: 79.99, img: DRESS_IMG, rating: 4.9, tag: 'New' },
  { id: 'f6', name: 'Classic Chinos', brand: 'Classic Co.', price: 55.99, img: FASHION_IMG, rating: 4.6, tag: 'Popular' },
];

const groceryItems = [
  { name: 'Organic Strawberries', weight: '400g', price: 4.99, emoji: '🍓', stock: 'In Stock', category: 'Fruits' },
  { name: 'Whole Grain Bread', weight: '500g', price: 3.49, emoji: '🍞', stock: 'In Stock', category: 'Bakery' },
  { name: 'Free Range Eggs', weight: 'x12', price: 5.99, emoji: '🥚', stock: 'In Stock', category: 'Dairy' },
  { name: 'Almond Milk', weight: '1L', price: 4.29, emoji: '🥛', stock: 'In Stock', category: 'Dairy' },
  { name: 'Fresh Avocados', weight: 'x3', price: 3.99, emoji: '🥑', stock: 'In Stock', category: 'Vegetables' },
  { name: 'Organic Spinach', weight: '200g', price: 2.99, emoji: '🥬', stock: 'Low Stock', category: 'Vegetables' },
  { name: 'Cherry Tomatoes', weight: '300g', price: 2.49, emoji: '🍅', stock: 'In Stock', category: 'Vegetables' },
  { name: 'Greek Yogurt', weight: '500g', price: 3.79, emoji: '🫙', stock: 'In Stock', category: 'Dairy' },
  { name: 'Mixed Nuts', weight: '250g', price: 7.99, emoji: '🥜', stock: 'In Stock', category: 'Snacks' },
  { name: 'Banana Bunch', weight: '5 pcs', price: 1.99, emoji: '🍌', stock: 'In Stock', category: 'Fruits' },
  { name: 'Sweet Potatoes', weight: '1kg', price: 3.29, emoji: '🍠', stock: 'In Stock', category: 'Vegetables' },
  { name: 'Sourdough Loaf', weight: '600g', price: 5.49, emoji: '🥨', stock: 'In Stock', category: 'Bakery' },
];

type CartItem = { name: string; price: number; qty: number; emoji?: string; img?: string };

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('food');
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addToCart = (item: { name: string; price: number; emoji?: string }) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name);
      if (existing) return prev.map(c => c.name === item.name ? {...c, qty: c.qty + 1} : c);
      return [...prev, { name: item.name, price: item.price, qty: 1, emoji: item.emoji }];
    });
  };

  const removeFromCart = (name: string) => {
    setCart(prev => prev.map(c => c.name === name && c.qty > 1 ? {...c, qty: c.qty - 1} : c).filter(c => c.qty > 0));
  };

  const placeOrder = () => {
    setOrderPlaced(true);
    setCart([]);
    setCartOpen(false);
    setTimeout(() => setOrderPlaced(false), 5000);
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const restaurant = selectedRestaurant ? restaurants.find(r => r.id === selectedRestaurant) : null;

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Order Placed Success */}
      {orderPlaced && (
        <div className="fixed top-4 right-4 z-50 bg-[#17202E] text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#14B8A6]/30">
          <CheckCircle size={20} className="text-[#14B8A6]" />
          <div>
            <p style={{fontSize:'14px', fontWeight:600}}>Order Placed! 🎉</p>
            <p style={{fontSize:'12px', color:'#14B8A6'}}>Estimated delivery: 25-30 min</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h1 style={{fontSize:'24px', fontWeight:700}} className="text-[#17202E] mb-1">Marketplace</h1>
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-[#14B8A6]" />
          <span style={{fontSize:'13px'}} className="text-[#888]">Delivering to: 123 Main St, New York, NY</span>
        </div>
      </div>

      {/* Search + Cart */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeCategory === 'food' ? 'restaurants, dishes' : activeCategory === 'fashion' ? 'clothes, brands' : 'products'}...`}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-[#14B8A6]/30 text-[#222] placeholder:text-[#bbb] outline-none focus:border-[#14B8A6] transition-colors"
            style={{fontSize:'14px'}}
          />
        </div>
        <button className="p-2.5 bg-white rounded-xl border border-[#14B8A6]/30 hover:bg-[#E0F7F3] transition-colors">
          <Filter size={18} className="text-[#666]" />
        </button>
        <button
          onClick={() => setCartOpen(true)}
          className="relative p-2.5 bg-[#17202E] rounded-xl text-white hover:bg-[#333] transition-colors"
        >
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#14B8A6] text-[#222] rounded-full flex items-center justify-center" style={{fontSize:'10px', fontWeight:700}}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSelectedRestaurant(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? 'bg-[#17202E] text-white border-[#17202E]'
                : 'bg-white text-[#666] border-[#14B8A6]/30 hover:border-[#14B8A6]'
            }`}
            style={{fontSize:'13px', fontWeight: activeCategory === cat.id ? 600 : 400}}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FOOD TAB */}
      {activeCategory === 'food' && !selectedRestaurant && (
        <div>
          {/* Featured promo */}
          <div className="relative rounded-2xl overflow-hidden mb-5 h-32 bg-[#17202E] flex items-center px-6">
            <ImageWithFallback src={DESSERT_IMG} alt="Promo" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="relative z-10">
              <p style={{fontSize:'11px', fontWeight:600}} className="text-[#14B8A6] uppercase tracking-widest mb-1">Limited Time</p>
              <h3 style={{fontSize:'20px', fontWeight:700}} className="text-white">Free Delivery All Day</h3>
              <p style={{fontSize:'13px'}} className="text-white/60">On orders above $20 · Use code: <span className="text-[#14B8A6] font-semibold">FREEAIOS</span></p>
            </div>
          </div>

          {/* Cuisine filters */}
          <div className="flex gap-2 overflow-x-auto mb-4 scrollbar-hide">
            {['All', '🍔 Burgers', '🍕 Pizza', '🍣 Sushi', '🥗 Healthy', '🍜 Noodles', '🌮 Mexican'].map(c => (
              <button key={c} className="px-3 py-1.5 bg-white border border-[#14B8A6]/30 rounded-full text-[#666] hover:bg-[#E0F7F3] hover:border-[#14B8A6] transition-all whitespace-nowrap" style={{fontSize:'12px'}}>
                {c}
              </button>
            ))}
          </div>

          <h3 style={{fontSize:'15px', fontWeight:700}} className="text-[#17202E] mb-3">Restaurants Near You</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurants.map(r => (
              <div
                key={r.id}
                onClick={() => setSelectedRestaurant(r.id)}
                className="bg-white rounded-2xl border border-[#14B8A6]/20 overflow-hidden hover:shadow-md hover:border-[#14B8A6] transition-all cursor-pointer group"
              >
                <div className="relative h-40">
                  <ImageWithFallback src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {r.promo && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#17202E] text-[#14B8A6] rounded-lg" style={{fontSize:'11px', fontWeight:700}}>
                      {r.promo}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-lg" style={{fontSize:'11px', fontWeight:600, color:'#555'}}>
                    {r.tag}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 style={{fontSize:'15px', fontWeight:700}} className="text-[#17202E]">{r.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span style={{fontSize:'13px', fontWeight:600}} className="text-[#333]">{r.rating}</span>
                    </div>
                  </div>
                  <p style={{fontSize:'12px'}} className="text-[#888] mb-2">{r.cuisine}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[#666]">
                      <Clock size={12} />
                      <span style={{fontSize:'12px'}}>{r.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#666]">
                      <Bike size={12} />
                      <span style={{fontSize:'12px'}}>{r.fee} delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restaurant Menu */}
      {activeCategory === 'food' && selectedRestaurant && restaurant && (
        <div>
          <button
            onClick={() => setSelectedRestaurant(null)}
            className="flex items-center gap-2 mb-4 text-[#666] hover:text-[#222] transition-colors"
            style={{fontSize:'14px'}}
          >
            <ArrowLeft size={16} /> Back to Restaurants
          </button>

          {/* Restaurant header */}
          <div className="relative rounded-2xl overflow-hidden h-44 mb-4 bg-[#17202E]">
            <ImageWithFallback src={restaurant.img} alt={restaurant.name} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <h2 style={{fontSize:'22px', fontWeight:700}} className="text-white">{restaurant.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span style={{fontSize:'13px'}} className="text-white/80">{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-white/60" />
                  <span style={{fontSize:'13px'}} className="text-white/60">{restaurant.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bike size={12} className="text-white/60" />
                  <span style={{fontSize:'13px'}} className="text-white/60">{restaurant.fee}</span>
                </div>
              </div>
            </div>
          </div>

          <h3 style={{fontSize:'16px', fontWeight:700}} className="text-[#17202E] mb-3">Menu</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {foodMenus[selectedRestaurant]?.map((item) => {
              const cartItem = cart.find(c => c.name === item.name);
              return (
                <div key={item.name} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#14B8A6]/20 hover:border-[#14B8A6] transition-all">
                  <span className="text-3xl shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{fontSize:'14px', fontWeight:600}} className="text-[#17202E]">{item.name}</p>
                    <p style={{fontSize:'11px'}} className="text-[#888] truncate">{item.desc}</p>
                    <p style={{fontSize:'14px', fontWeight:700}} className="text-[#17202E] mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  {cartItem ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => removeFromCart(item.name)} className="w-7 h-7 rounded-lg bg-[#17202E] flex items-center justify-center text-white">
                        <Minus size={13} />
                      </button>
                      <span style={{fontSize:'14px', fontWeight:600}} className="text-[#222] w-4 text-center">{cartItem.qty}</span>
                      <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-lg bg-[#17202E] flex items-center justify-center text-white">
                        <Plus size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="w-7 h-7 rounded-lg bg-[#14B8A6] hover:bg-[#0F766E] flex items-center justify-center transition-colors shrink-0"
                    >
                      <Plus size={13} className="text-[#17202E]" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FASHION TAB */}
      {activeCategory === 'fashion' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{fontSize:'15px', fontWeight:700}} className="text-[#17202E]">Trending Fashion</h3>
            <div className="flex gap-2">
              {['All', 'Men', 'Women', 'Kids'].map(f => (
                <button key={f} className="px-3 py-1 bg-white border border-[#14B8A6]/30 rounded-lg text-[#666] hover:bg-[#E0F7F3] transition-all" style={{fontSize:'12px'}}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fashionItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#14B8A6]/20 overflow-hidden hover:shadow-md hover:border-[#14B8A6] transition-all group">
                <div className="relative h-48">
                  <ImageWithFallback src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow"
                  >
                    <Heart size={15} className={wishlist.includes(item.id) ? 'text-red-500 fill-red-500' : 'text-[#888]'} />
                  </button>
                  <span className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-white`} style={{fontSize:'10px', fontWeight:700, backgroundColor: item.tag.includes('Sale') ? '#E63946' : item.tag === 'New' ? '#0F766E' : '#17202E'}}>
                    {item.tag}
                  </span>
                </div>
                <div className="p-3">
                  <p style={{fontSize:'13px', fontWeight:600}} className="text-[#17202E]">{item.name}</p>
                  <p style={{fontSize:'11px'}} className="text-[#888]">{item.brand}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p style={{fontSize:'15px', fontWeight:700}} className="text-[#17202E]">${item.price}</p>
                    <button
                      onClick={() => addToCart({ name: item.name, price: item.price })}
                      className="px-3 py-1.5 bg-[#17202E] text-white rounded-lg hover:bg-[#14B8A6] hover:text-[#222] transition-all"
                      style={{fontSize:'11px', fontWeight:600}}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GROCERIES TAB */}
      {activeCategory === 'groceries' && (
        <div>
          <div className="relative rounded-2xl overflow-hidden h-28 mb-5 bg-[#E0F7F3] flex items-center px-6 border border-[#14B8A6]/30">
            <ImageWithFallback src={GROCERIES_IMG} alt="Groceries" className="absolute inset-0 w-full h-full object-cover opacity-15" />
            <div className="relative z-10">
              <p style={{fontSize:'13px', fontWeight:700}} className="text-[#0F766E]">🌿 Fresh & Organic</p>
              <p style={{fontSize:'20px', fontWeight:700}} className="text-[#17202E]">Daily Essentials</p>
              <p style={{fontSize:'12px'}} className="text-[#666]">Delivered in 1 hour · Free above $30</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {groceryItems.map(item => {
              const cartItem = cart.find(c => c.name === item.name);
              return (
                <div key={item.name} className="bg-white rounded-2xl border border-[#14B8A6]/20 p-3 hover:border-[#14B8A6] hover:shadow-sm transition-all">
                  <div className="text-center text-3xl mb-2">{item.emoji}</div>
                  <p style={{fontSize:'13px', fontWeight:600}} className="text-[#17202E] text-center truncate">{item.name}</p>
                  <p style={{fontSize:'11px'}} className="text-[#888] text-center">{item.weight}</p>
                  <div className={`text-center mt-1 text-xs font-medium ${item.stock === 'Low Stock' ? 'text-orange-500' : 'text-[#0F766E]'}`}>
                    {item.stock}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span style={{fontSize:'14px', fontWeight:700}} className="text-[#17202E]">${item.price}</span>
                    {cartItem ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => removeFromCart(item.name)} className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><Minus size={11} /></button>
                        <span style={{fontSize:'12px', fontWeight:600}} className="w-4 text-center">{cartItem.qty}</span>
                        <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-md bg-[#14B8A6] flex items-center justify-center"><Plus size={11} /></button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-lg bg-[#14B8A6] flex items-center justify-center hover:bg-[#0F766E] transition-colors">
                        <Plus size={13} className="text-[#17202E]" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PHARMACY + ELECTRONICS placeholder */}
      {(activeCategory === 'pharmacy' || activeCategory === 'electronics') && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">{activeCategory === 'pharmacy' ? '💊' : '📱'}</div>
          <h3 style={{fontSize:'20px', fontWeight:700}} className="text-[#17202E] mb-2">
            {activeCategory === 'pharmacy' ? 'Pharmacy' : 'Electronics'} Coming Soon
          </h3>
          <p style={{fontSize:'14px'}} className="text-[#888]">We're partnering with local {activeCategory === 'pharmacy' ? 'pharmacies' : 'electronics stores'} in your area</p>
          <button className="mt-4 px-6 py-2.5 bg-[#14B8A6] text-[#17202E] rounded-xl hover:bg-[#0F766E] transition-colors" style={{fontSize:'14px', fontWeight:600}}>
            Notify Me When Ready
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl">
            <div className="p-5 border-b border-[#14B8A6]/20 flex items-center justify-between">
              <h2 style={{fontSize:'18px', fontWeight:700}} className="text-[#17202E]">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="p-1.5 hover:bg-[#E0F7F3] rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart size={40} className="text-[#ccc] mb-3" />
                  <p style={{fontSize:'14px'}} className="text-[#888]">Your cart is empty</p>
                  <p style={{fontSize:'12px'}} className="text-[#bbb] mt-1">Browse and add items!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.name} className="flex items-center gap-3 p-3 bg-[#EEF3F8] rounded-xl">
                      <span className="text-2xl">{item.emoji || '🛍️'}</span>
                      <div className="flex-1 min-w-0">
                        <p style={{fontSize:'13px', fontWeight:600}} className="text-[#17202E] truncate">{item.name}</p>
                        <p style={{fontSize:'12px'}} className="text-[#888]">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => removeFromCart(item.name)} className="w-6 h-6 rounded-md bg-white border border-[#ddd] flex items-center justify-center">
                          <Minus size={11} />
                        </button>
                        <span style={{fontSize:'13px', fontWeight:600}} className="w-5 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-md bg-[#17202E] flex items-center justify-center text-white">
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#14B8A6]/20">
                <div className="flex justify-between mb-3">
                  <span style={{fontSize:'14px'}} className="text-[#666]">Subtotal</span>
                  <span style={{fontSize:'14px', fontWeight:600}} className="text-[#17202E]">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span style={{fontSize:'14px'}} className="text-[#666]">Delivery</span>
                  <span style={{fontSize:'14px', fontWeight:600}} className="text-[#0F766E]">FREE</span>
                </div>
                <div className="flex justify-between mb-4 pt-3 border-t border-[#14B8A6]/20">
                  <span style={{fontSize:'16px', fontWeight:700}} className="text-[#17202E]">Total</span>
                  <span style={{fontSize:'16px', fontWeight:700}} className="text-[#17202E]">${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={placeOrder}
                  className="w-full py-3.5 bg-[#17202E] text-white rounded-xl hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
                  style={{fontSize:'15px', fontWeight:600}}
                >
                  <Package size={16} /> Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
