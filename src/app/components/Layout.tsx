import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  LayoutDashboard, ShoppingBag, Bot, Heart, CheckSquare,
  Wallet, Users, UserCircle, Settings, Bell, Search, Menu,
  X, Sparkles, ChevronRight, LogOut, Zap, Shield, Store
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAiosApp } from '../state/AiosAppContext';
import { useAuth } from '../state/AuthContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { path: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { path: '/health', icon: Heart, label: 'Health & Fitness' },
  { path: '/routine', icon: CheckSquare, label: 'Daily Routine' },
  { path: '/finance', icon: Wallet, label: 'Finance' },
  { path: '/social', icon: Users, label: 'Social' },
  { path: '/profile', icon: UserCircle, label: 'My Profile' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, unreadNotifications } = useAiosApp();
  const { user, logout } = useAuth();
  const roleItems = user?.role === 'admin'
    ? [{ path: '/admin', icon: Shield, label: 'Admin Console' }]
    : user?.role === 'vendor'
      ? [{ path: '/vendor', icon: Store, label: 'Vendor Portal' }]
      : [];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F8FB] text-[#17202E]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        w-[268px] h-full flex flex-col shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
        style={{
          background:
            'linear-gradient(180deg, #17202E 0%, #101823 58%, #0B111A 100%)',
        }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14B8A6] flex items-center justify-center shadow-lg shadow-[#14B8A6]/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 style={{fontSize:'17px', fontWeight:700, lineHeight:'1.2'}} className="text-white">AIOS</h1>
              <p style={{fontSize:'10px'}} className="text-[#8AA4B8] tracking-wide uppercase">Life OS</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p style={{fontSize:'10px'}} className="text-[#6D8196] uppercase tracking-widest px-3 py-2">Main Menu</p>
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/20'
                    : 'text-[#A7B5C6] hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-[#A7B5C6] group-hover:text-white'} />
                  <span style={{fontSize:'14px', fontWeight: isActive ? 600 : 400}}>{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-white/70" />}
                </>
              )}
            </NavLink>
          ))}

          <p style={{fontSize:'10px'}} className="text-[#6D8196] uppercase tracking-widest px-3 py-2 pt-4">Community</p>
          {navItems.slice(5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/20'
                    : 'text-[#A7B5C6] hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? 'text-white' : 'text-[#A7B5C6] group-hover:text-white'} />
                  <span style={{fontSize:'14px', fontWeight: isActive ? 600 : 400}}>{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-white/70" />}
                </>
              )}
            </NavLink>
          ))}

          {roleItems.length > 0 ? (
            <>
              <p style={{fontSize:'10px'}} className="text-[#6D8196] uppercase tracking-widest px-3 py-2 pt-4">Workspace</p>
              {roleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/20'
                        : 'text-[#A7B5C6] hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={18} className={isActive ? 'text-white' : 'text-[#A7B5C6] group-hover:text-white'} />
                      <span style={{fontSize:'14px', fontWeight: isActive ? 600 : 400}}>{item.label}</span>
                      {isActive && <ChevronRight size={14} className="ml-auto text-white/70" />}
                    </>
                  )}
                </NavLink>
              ))}
            </>
          ) : null}

          <div className="pt-3">
            <NavLink
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A7B5C6] hover:bg-white/10 hover:text-white transition-all"
            >
              <Settings size={18} />
              <span style={{fontSize:'14px'}}>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* AI Quick Chat bubble */}
        <div className="px-3 py-3">
          <button
            onClick={() => { navigate('/ai-assistant'); setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#14B8A6]/50 hover:bg-[#14B8A6]/10 transition-all group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#F97316] flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p style={{fontSize:'12px', fontWeight:600}} className="text-white truncate">Ask AIOS anything</p>
              <p style={{fontSize:'10px'}} className="text-[#8AA4B8] truncate">Your AI life assistant</p>
            </div>
          </button>
        </div>

        {/* User section */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <ImageWithFallback
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#14B8A6]/50"
            />
            <div className="flex-1 min-w-0">
              <p style={{fontSize:'13px', fontWeight:600}} className="text-white truncate">{profile.name}</p>
              <p style={{fontSize:'11px'}} className="text-[#14B8A6]/80 truncate">{user?.role === 'admin' ? 'Platform Admin' : user?.role === 'vendor' ? 'Vendor Partner' : profile.membership}</p>
            </div>
            <button
              onClick={() => {
                void logout();
                navigate('/login');
              }}
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header className="bg-white/90 backdrop-blur border-b border-[#D8E1EA] px-4 lg:px-6 py-3 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-[#E7EEF7] text-[#17202E] transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6D8196]" />
              <input
                type="text"
                placeholder="Search food, products, workouts..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#EEF3F8] border border-[#D8E1EA] text-[#17202E] placeholder:text-[#8AA4B8] outline-none focus:border-[#14B8A6] focus:bg-white transition-colors"
                style={{fontSize:'13px'}}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notification */}
            <button className="relative p-2 rounded-xl hover:bg-[#E7EEF7] transition-colors">
              <Bell size={19} className="text-[#44546A]" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#F97316] rounded-full flex items-center justify-center">
                  <span style={{fontSize:'9px', fontWeight:700}} className="text-white">{unreadNotifications}</span>
                </span>
              )}
            </button>

            {/* Profile avatar */}
            <button
              onClick={() => navigate('/profile')}
              className="hidden sm:block"
            >
              <ImageWithFallback
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#14B8A6]"
              />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
