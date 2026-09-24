import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  BatteryCharging, Cpu, ShieldCheck, Globe, Lock,
  Layers, LayoutDashboard, LogOut, Building2,
  ChevronDown, UserCircle, Search, Menu, X, ChevronRight
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

const NAV_ITEMS = [
  { path: ROUTES.MARKETPLACE,    label: 'Chợ Giao Dịch',      icon: BatteryCharging,  desc: 'Listings & Niêm yết', allowedRoles: ['BUYER', 'SYSTEM_INTEGRATOR', 'Admin', 'MANAGER_STAFF'] },
  { path: ROUTES.SMART_MATCHING, label: 'Ghép Nối Thông Minh',  icon: Cpu,              desc: 'Ghép nối tối ưu 40/40/20', allowedRoles: ['BUYER', 'SYSTEM_INTEGRATOR', 'Admin', 'MANAGER_STAFF'] },
  { path: ROUTES.BATTERY_PACKS,  label: 'Quản Lý Pin',          icon: Layers,           desc: 'Vòng đời & Form Factor', allowedRoles: ['SUPPLIER', 'TESTING_LAB', 'Admin', 'MANAGER_STAFF'] },
  { path: ROUTES.PASSPORTS,      label: 'Hộ Chiếu Pin',         icon: ShieldCheck,      desc: 'SHA-256 Hash Chain', allowedRoles: ['BUYER', 'SUPPLIER', 'TESTING_LAB', 'SYSTEM_INTEGRATOR', 'LOGISTICS', 'Admin', 'MANAGER_STAFF'] },
  { path: ROUTES.ESCROW,         label: 'Giao Dịch Ký Quỹ',     icon: Lock,             desc: 'Giao dịch ký quỹ', allowedRoles: ['BUYER', 'SUPPLIER', 'SYSTEM_INTEGRATOR', 'LOGISTICS', 'Admin', 'MANAGER_STAFF'] },
  { path: ROUTES.BESS_PROJECTS,  label: 'Dự Án BESS',           icon: Building2,        desc: 'Vòng đời BESS §5.7', allowedRoles: ['BUYER', 'SYSTEM_INTEGRATOR', 'Admin', 'MANAGER_STAFF'] },
  { path: ROUTES.DASHBOARD,      label: 'Bảng Điều Khiển',      icon: LayoutDashboard,  desc: 'Báo cáo theo Vai trò', allowedRoles: ['BUYER', 'SUPPLIER', 'TESTING_LAB', 'SYSTEM_INTEGRATOR', 'LOGISTICS', 'Admin', 'MANAGER_STAFF'] },
  { path: ROUTES.EPR_COMPLIANCE, label: 'Tuân Thủ EPR & ESG',   icon: Globe,            desc: 'Báo cáo môi trường', allowedRoles: ['BUYER', 'SUPPLIER', 'TESTING_LAB', 'SYSTEM_INTEGRATOR', 'LOGISTICS', 'Admin', 'MANAGER_STAFF'] },
];

const ROLES = [
  { value: 'BUYER',             label: 'Người Mua (Solar EPC / SME)' },
  { value: 'SUPPLIER',          label: 'Nhà Cung Cấp (Thu hồi Pin)' },
  { value: 'TESTING_LAB',       label: 'Trung Tâm Kiểm Định (Lab)' },
  { value: 'SYSTEM_INTEGRATOR', label: 'Nhà Tích Hợp (SI BESS)' },
  { value: 'LOGISTICS',         label: 'Đơn Vị Vận Chuyển Class 9' },
  { value: 'MANAGER_STAFF',     label: 'Quản Lý Sàn REBATT' },
  { value: 'Admin',             label: 'Quản Trị Hệ Thống (Admin)' },
];

// Bottom nav shows first 4 allowed items + "More" button
const BOTTOM_NAV_MAX = 4;

export const AppLayout: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<string>('BUYER');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const allowedNavItems = NAV_ITEMS.filter(item => item.allowedRoles.includes(currentRole));
  const bottomNavItems = allowedNavItems.slice(0, BOTTOM_NAV_MAX);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.MARKETPLACE}?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  const handleNavClick = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">

      {/* ── HEADER ── */}
      <header className="h-14 md:h-16 border-b border-slate-200 bg-white sticky top-0 z-40 flex items-center justify-between px-3 md:px-6">

        {/* Logo */}
        <Link to={ROUTES.MARKETPLACE} className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition shrink-0">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-500/20">
            <BatteryCharging className="w-4 h-4 md:w-5 md:h-5 fill-slate-950" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base md:text-lg font-black tracking-tight text-slate-900 leading-none">REBATT</span>
              <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold uppercase tracking-widest border border-emerald-200 leading-none">ENTERPRISE B2B</span>
            </div>
          </div>
        </Link>

        {/* ── SEARCH BAR — Desktop only ── */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh lô pin, VIN, SOH, model (VD: VF8 Eco, LFP)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-16 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-extrabold tracking-wide transition shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-3 h-3 stroke-[3]" /> Tìm
            </button>
          </form>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 md:gap-4">

          {/* Mobile: Search icon */}
          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            onClick={() => setMobileSearchOpen(v => !v)}
            aria-label="Tìm kiếm"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Desktop: Role Switcher dropdown */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md py-1.5 px-3 transition">
                <UserCircle className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 max-w-[160px] truncate">{ROLES.find(r => r.value === currentRole)?.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  Chuyển Góc Nhìn Vai Trò
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setCurrentRole(r.value)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 transition flex items-center justify-between ${
                      currentRole === r.value ? 'text-amber-800 font-bold bg-amber-50' : 'text-slate-700'
                    }`}
                  >
                    {r.label}
                    {currentRole === r.value && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="p-1.5 text-slate-400 hover:text-slate-900 transition"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile: Hamburger menu */}
          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── MOBILE SEARCH BAR (dropdown) ── */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-3 py-2.5 z-30">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm lô pin, VIN, SOH, model..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-14 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-extrabold"
            >
              Tìm
            </button>
          </form>
        </div>
      )}

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative ml-auto w-[280px] max-w-[85vw] h-full bg-white flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
              <span className="text-sm font-bold text-slate-900">Menu</span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role switcher in drawer */}
            <div className="px-4 py-3 border-b border-slate-100 shrink-0">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Vai Trò Hiện Tại</p>
              <div className="space-y-0.5">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => { setCurrentRole(r.value); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                      currentRole === r.value
                        ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r.label}
                    {currentRole === r.value && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Nav items in drawer */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">Điều Hướng</p>
              <div className="space-y-1">
                {allowedNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        isActive
                          ? 'bg-amber-500/15 border border-amber-300 text-amber-950 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-800' : 'text-slate-400'}`} />
                        <div className="flex-1 min-w-0">
                          <span className="tracking-tight block">{item.label}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{item.desc}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Drawer footer */}
            <div className="border-t border-slate-200 p-4 shrink-0">
              <button
                onClick={() => { setMobileDrawerOpen(false); navigate(ROUTES.LOGIN); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BODY: Sidebar + Main ── */}
      <div className="flex-1 flex w-full">

        {/* ── SIDEBAR — Desktop only ── */}
        <aside className="w-[268px] shrink-0 hidden md:flex flex-col border-r border-slate-200 p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-white">
          <div className="space-y-2.5">
            <p className="px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4 mt-1">Điều Hướng Hệ Thống</p>
            {allowedNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-amber-500/15 border border-amber-300 text-amber-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-800' : 'text-slate-400'}`} />
                    <span className="tracking-tight">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* SHA-256 Status Widget */}
          <div className="mt-8 p-4 bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-200/80 rounded-2xl text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Sổ Cái SHA-256
              </span>
              <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200">ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Mọi sự kiện & chứng nhận SOH được mã hóa theo chuỗi khối không thể chỉnh sửa.
            </p>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
          <Outlet context={{ currentRole }} />
        </main>
      </div>

      {/* ── BOTTOM NAVIGATION BAR — Mobile only ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-stretch h-[60px] safe-area-inset-bottom shadow-[0_-2px_12px_rgba(0,0,0,0.07)]">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-amber-700 bg-amber-50/70'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="leading-tight text-center px-0.5 line-clamp-1">{item.label.split(' ')[0]}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* "More" button */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-400" />
          <span className="leading-tight">Thêm</span>
        </button>
      </nav>
    </div>
  );
};
