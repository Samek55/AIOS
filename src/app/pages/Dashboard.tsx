import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Footprints, ShoppingBag, CheckSquare, Flame, Brain, MapPin,
  ArrowRight, TrendingUp, Cloud, Sun, Clock, Star, Plus,
  ChevronRight, Zap, Bell, ThumbsUp, Coffee, Moon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const FOOD_IMG = 'https://images.unsplash.com/photo-1666819691716-827f78d892f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const PIZZA_IMG = 'https://images.unsplash.com/photo-1727198826083-6693684e4fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const PROFILE_IMG = 'https://images.unsplash.com/photo-1723189038268-3ef8fd518ad9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200';
const RUNNING_IMG = 'https://images.unsplash.com/photo-1773681823208-7f3657c0688f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';

const weeklyActivity = [
  { day: 'Mon', steps: 8200, calories: 1800 },
  { day: 'Tue', steps: 6500, calories: 1600 },
  { day: 'Wed', steps: 10200, calories: 2100 },
  { day: 'Thu', steps: 9100, calories: 1950 },
  { day: 'Fri', steps: 7800, calories: 1750 },
  { day: 'Sat', steps: 11500, calories: 2300 },
  { day: 'Sun', steps: 7842, calories: 1450 },
];

const schedule = [
  { time: '8:00 AM', title: 'Morning Workout', tag: 'fitness', done: true, icon: '💪' },
  { time: '9:30 AM', title: 'Team Standup', tag: 'work', done: true, icon: '💼' },
  { time: '12:30 PM', title: 'Healthy Lunch', tag: 'food', done: false, icon: '🥗' },
  { time: '3:00 PM', title: 'Deep Work Session', tag: 'work', done: false, icon: '🎯' },
  { time: '6:00 PM', title: 'Evening Jog', tag: 'fitness', done: false, icon: '🏃' },
  { time: '8:00 PM', title: 'Meditation', tag: 'wellness', done: false, icon: '🧘' },
];

const quickOrders = [
  { name: 'Healthy Bowl', shop: 'Green Kitchen', time: '20 min', price: '$12.99', img: FOOD_IMG, rating: 4.8 },
  { name: 'Pepperoni Pizza', shop: 'Pizza Palace', time: '28 min', price: '$14.50', img: PIZZA_IMG, rating: 4.6 },
];

const aiInsights = [
  { icon: '💧', text: "You're 500ml behind on water intake. Drink a glass now!", action: 'Log Water' },
  { icon: '🧠', text: 'You\'ve been sitting for 2 hours. A 5-min walk will boost focus by 20%.', action: 'Start Walk' },
  { icon: '🍎', text: 'Based on your last 3 meals, add more protein tonight.', action: 'See Meal Plan' },
];

const tagColors: Record<string, string> = {
  fitness: 'bg-[#E8F3E9] text-[#5A9E60]',
  work: 'bg-blue-50 text-blue-600',
  food: 'bg-orange-50 text-orange-500',
  wellness: 'bg-purple-50 text-purple-600',
};

const moods = ['😴', '😕', '😐', '🙂', '😄'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(3);
  const [insightIdx, setInsightIdx] = useState(0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetingIcon = hour < 12 ? '☀️' : hour < 17 ? '🌤️' : '🌙';

  const stats = [
    { label: 'Steps Today', value: '7,842', goal: '10,000', icon: Footprints, color: '#C2DBC4', pct: 78 },
    { label: 'Calories', value: '1,450', goal: '2,000 kcal', icon: Flame, color: '#F4A261', pct: 73 },
    { label: 'Tasks Done', value: '5 / 8', goal: '3 remaining', icon: CheckSquare, color: '#7BA7DC', pct: 63 },
    { label: 'Active Order', value: '12 min', goal: 'Pizza arriving', icon: ShoppingBag, color: '#C77DFF', pct: 60 },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-5">

      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-[#222222] p-6 flex items-center justify-between">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, #C2DBC4 0%, transparent 60%)'}} />
        </div>
        <div className="relative z-10">
          <p style={{fontSize:'13px'}} className="text-[#C2DBC4]/80 mb-1">{greetingIcon} {greeting},</p>
          <h1 style={{fontSize:'26px', fontWeight:700, lineHeight:'1.2'}} className="text-white">Alex Johnson!</h1>
          <p style={{fontSize:'13px'}} className="text-white/50 mt-1">Sunday, April 5, 2026 · <span className="text-[#C2DBC4]">Productivity Score: 78/100</span></p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => navigate('/ai-assistant')}
              className="flex items-center gap-2 px-4 py-2 bg-[#C2DBC4] text-[#222222] rounded-xl hover:bg-[#A8C9AB] transition-colors"
              style={{fontSize:'13px', fontWeight:600}}
            >
              <Zap size={14} /> Ask AIOS
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              style={{fontSize:'13px', fontWeight:600}}
            >
              <ShoppingBag size={14} /> Order Now
            </button>
          </div>
        </div>
        <div className="hidden sm:block relative z-10">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <Sun size={14} className="text-yellow-400" />
                <span style={{fontSize:'13px'}} className="text-white/70">28°C · Sunny</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-[#C2DBC4]" />
                <span style={{fontSize:'12px'}} className="text-[#C2DBC4]">New York, NY</span>
              </div>
            </div>
            <ImageWithFallback src={PROFILE_IMG} alt="Alex" className="w-14 h-14 rounded-full object-cover border-2 border-[#C2DBC4]" />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-[#C2DBC4]/20 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{backgroundColor: stat.color + '20'}}>
                <stat.icon size={17} style={{color: stat.color}} />
              </div>
              <span style={{fontSize:'11px'}} className="text-[#888]">{stat.goal}</span>
            </div>
            <p style={{fontSize:'20px', fontWeight:700}} className="text-[#222222]">{stat.value}</p>
            <p style={{fontSize:'12px'}} className="text-[#888] mt-0.5">{stat.label}</p>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{width: `${stat.pct}%`, backgroundColor: stat.color}}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-[#222222] to-[#333333] rounded-2xl p-4 flex items-center gap-4 border border-[#C2DBC4]/10">
        <div className="w-10 h-10 rounded-xl bg-[#C2DBC4] flex items-center justify-center shrink-0">
          <Brain size={20} className="text-[#222222]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span style={{fontSize:'11px', fontWeight:600}} className="text-[#C2DBC4] uppercase tracking-wide">AIOS Insight</span>
            <span style={{fontSize:'11px'}} className="text-white/40">#{insightIdx + 1} of {aiInsights.length}</span>
          </div>
          <p style={{fontSize:'14px'}} className="text-white/90">{aiInsights[insightIdx].icon} {aiInsights[insightIdx].text}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setInsightIdx((insightIdx + 1) % aiInsights.length)}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
          <button
            className="px-3 py-1.5 bg-[#C2DBC4] text-[#222222] rounded-lg hover:bg-[#A8C9AB] transition-colors"
            style={{fontSize:'12px', fontWeight:600}}
          >
            {aiInsights[insightIdx].action}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Today's Schedule */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-[#C2DBC4]/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{fontSize:'15px', fontWeight:700}} className="text-[#222222]">Today's Schedule</h3>
            <button
              onClick={() => navigate('/routine')}
              className="flex items-center gap-1 text-[#7BAF80] hover:text-[#222222] transition-colors"
              style={{fontSize:'12px', fontWeight:600}}
            >
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {schedule.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${item.done ? 'opacity-50' : 'hover:bg-[#F5FAF5]'}`}>
                <div className="text-center w-14 shrink-0">
                  <p style={{fontSize:'10px'}} className="text-[#888]">{item.time}</p>
                </div>
                <div className={`w-0.5 h-8 rounded-full ${item.done ? 'bg-[#C2DBC4]' : 'bg-gray-200'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <p style={{fontSize:'13px', fontWeight: item.done ? 400 : 600}} className={`truncate ${item.done ? 'line-through text-[#aaa]' : 'text-[#222222]'}`}>
                      {item.title}
                    </p>
                  </div>
                  <span style={{fontSize:'10px', fontWeight:600}} className={`px-1.5 py-0.5 rounded-md ${tagColors[item.tag]}`}>
                    {item.tag}
                  </span>
                </div>
                {!item.done && <div className="w-2 h-2 rounded-full bg-[#C2DBC4] shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#C2DBC4]/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{fontSize:'15px', fontWeight:700}} className="text-[#222222]">Weekly Activity</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#C2DBC4]" />
                <span style={{fontSize:'11px'}} className="text-[#888]">Steps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#F4A261]" />
                <span style={{fontSize:'11px'}} className="text-[#888]">Calories</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyActivity} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{fontSize:11, fill:'#999'}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{fontSize:'12px', borderRadius:'10px', border:'1px solid #E8F3E9', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}
                cursor={{fill: '#F5FAF5'}}
              />
              <Bar dataKey="steps" fill="#C2DBC4" radius={[5, 5, 0, 0]} maxBarSize={28} />
              <Bar dataKey="calories" fill="#F4A261" radius={[5, 5, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>

          {/* Quick Stats below chart */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#C2DBC4]/20">
            <div className="text-center">
              <p style={{fontSize:'17px', fontWeight:700}} className="text-[#222222]">63,882</p>
              <p style={{fontSize:'11px'}} className="text-[#888]">Steps This Week</p>
            </div>
            <div className="text-center border-x border-[#C2DBC4]/20">
              <p style={{fontSize:'17px', fontWeight:700}} className="text-[#222222]">13,050</p>
              <p style={{fontSize:'11px'}} className="text-[#888]">Calories Burned</p>
            </div>
            <div className="text-center">
              <p style={{fontSize:'17px', fontWeight:700}} className="text-[#222]">5 🔥</p>
              <p style={{fontSize:'11px'}} className="text-[#888]">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Quick Order */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#C2DBC4]/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{fontSize:'15px', fontWeight:700}} className="text-[#222222]">Quick Order Nearby</h3>
            <button
              onClick={() => navigate('/marketplace')}
              className="flex items-center gap-1 text-[#7BAF80] hover:text-[#222222] transition-colors"
              style={{fontSize:'12px', fontWeight:600}}
            >
              Browse All <ArrowRight size={13} />
            </button>
          </div>

          {/* Active order tracking */}
          <div className="mb-4 p-3 bg-[#E8F3E9] rounded-xl border border-[#C2DBC4]/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C2DBC4] flex items-center justify-center">
              <Clock size={15} className="text-[#222222]" />
            </div>
            <div className="flex-1">
              <p style={{fontSize:'13px', fontWeight:600}} className="text-[#222222]">🍕 Pizza Palace order arriving in 12 min</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#7BAF80] rounded-full" style={{width:'70%'}} />
                </div>
                <span style={{fontSize:'11px'}} className="text-[#666]">On the way</span>
              </div>
            </div>
            <button className="text-[#7BAF80]" style={{fontSize:'12px', fontWeight:600}}>Track →</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickOrders.map((order) => (
              <div key={order.name} className="flex items-center gap-3 p-3 border border-[#C2DBC4]/20 rounded-xl hover:border-[#C2DBC4] hover:bg-[#F5FAF5] transition-all cursor-pointer group">
                <ImageWithFallback src={order.img} alt={order.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p style={{fontSize:'13px', fontWeight:600}} className="text-[#222222] truncate">{order.name}</p>
                  <p style={{fontSize:'11px'}} className="text-[#888] truncate">{order.shop}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span style={{fontSize:'11px'}} className="text-[#666]">{order.rating}</span>
                    </div>
                    <span style={{fontSize:'11px'}} className="text-[#888]">· {order.time}</span>
                    <span style={{fontSize:'11px', fontWeight:600}} className="text-[#222222] ml-auto">{order.price}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-7 h-7 rounded-lg bg-[#222222] group-hover:bg-[#C2DBC4] flex items-center justify-center transition-all shrink-0"
                >
                  <Plus size={13} className="text-white group-hover:text-[#222222]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mood + Notifications */}
        <div className="space-y-4">
          {/* Mood Check */}
          <div className="bg-white rounded-2xl border border-[#C2DBC4]/20 p-5">
            <h3 style={{fontSize:'15px', fontWeight:700}} className="text-[#222222] mb-1">How are you feeling?</h3>
            <p style={{fontSize:'12px'}} className="text-[#888] mb-3">AIOS adapts to your mood ✨</p>
            <div className="flex justify-between">
              {moods.map((mood, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMood(i)}
                  className={`text-2xl transition-all hover:scale-125 p-1 rounded-lg ${selectedMood === i ? 'bg-[#E8F3E9] scale-125' : ''}`}
                >
                  {mood}
                </button>
              ))}
            </div>
            {selectedMood !== null && (
              <div className="mt-3 p-2.5 bg-[#F5FAF5] rounded-xl">
                <p style={{fontSize:'12px'}} className="text-[#555]">
                  {selectedMood === 0 && "😴 Rest mode: Ordering comfort food + relaxing playlist"}
                  {selectedMood === 1 && "😕 Boost mode: Light workout + energizing meal suggested"}
                  {selectedMood === 2 && "😐 Neutral: Regular routine + balanced meal plan"}
                  {selectedMood === 3 && "🙂 Great! Keeping your momentum with a light jog tonight"}
                  {selectedMood === 4 && "😄 Amazing energy! Perfect day for a challenging workout!"}
                </p>
              </div>
            )}
          </div>

          {/* Smart Notifications */}
          <div className="bg-white rounded-2xl border border-[#C2DBC4]/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 style={{fontSize:'15px', fontWeight:700}} className="text-[#222222]">Smart Alerts</h3>
              <Bell size={15} className="text-[#C2DBC4]" />
            </div>
            <div className="space-y-2.5">
              {[
                { icon: '🌧️', text: 'Rain at 6 PM — order dinner early!', time: '2m ago' },
                { icon: '💪', text: 'You haven\'t worked out in 2 days', time: '1h ago' },
                { icon: '🎯', text: 'Almost at step goal! 2,158 more', time: '3h ago' },
              ].map((notif, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 hover:bg-[#F5FAF5] rounded-xl transition-colors cursor-pointer">
                  <span className="text-lg shrink-0">{notif.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{fontSize:'12px'}} className="text-[#333] leading-snug">{notif.text}</p>
                    <p style={{fontSize:'10px'}} className="text-[#999] mt-0.5">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Promo Banner */}
      <div className="relative rounded-2xl overflow-hidden h-36" style={{background: 'linear-gradient(135deg, #222222 0%, #3a3a3a 100%)'}}>
        <ImageWithFallback src={RUNNING_IMG} alt="Fitness" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 p-5 flex items-center justify-between h-full">
          <div>
            <p style={{fontSize:'11px', fontWeight:600}} className="text-[#C2DBC4] uppercase tracking-widest mb-1">Today's Challenge</p>
            <h3 style={{fontSize:'20px', fontWeight:700}} className="text-white">Complete your 10k steps</h3>
            <p style={{fontSize:'13px'}} className="text-white/60 mt-1">You need <span className="text-[#C2DBC4] font-semibold">2,158 more steps</span> to hit your goal</p>
          </div>
          <button
            onClick={() => navigate('/health')}
            className="px-5 py-2.5 bg-[#C2DBC4] text-[#222222] rounded-xl hover:bg-[#A8C9AB] transition-colors shrink-0"
            style={{fontSize:'13px', fontWeight:600}}
          >
            View Health
          </button>
        </div>
      </div>
    </div>
  );
}
