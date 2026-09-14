import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  BatteryCharging, Cpu, ShieldCheck, Globe, Lock,
  Layers, LayoutDashboard, LogOut, Building2,
  ChevronDown, UserCircle, Search
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

export const AppLayout: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<string>('BUYER');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.MARKETPLACE}?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* ── HEADER ── */}
      <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link to={ROUTES.MARKETPLACE} className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-9 h-9 rounded bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm shadow-amber-500/20">
              <BatteryCharging className="w-5 h-5 fill-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-none">REBATT</span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold uppercase tracking-widest border border-emerald-200 leading-none">ENTERPRISE B2B</span>
              </div>
            </div>
          </Link>
        </div>

        {/* ── SEARCH BAR ON NAVBAR ── */}
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
        <div className="flex items-center gap-4">
          {/* User Profile / Role Switcher */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md py-1.5 px-3 transition">
                <UserCircle className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{ROLES.find(r => r.value === currentRole)?.label}</span>
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
        </div>
      </header>

      <div className="flex-1 flex max-w-[1400px] w-full mx-auto">
        {/* ── SIDEBAR ── */}
        <aside className="w-[268px] shrink-0 hidden md:flex flex-col border-r border-slate-200 p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-white">
          <div className="space-y-2.5">
            <p className="px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4 mt-1">Điều Hướng Hệ Thống</p>
            {NAV_ITEMS.filter(item => item.allowedRoles.includes(currentRole)).map((item) => (
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

          {/* ── SLEEK SHA-256 STATUS WIDGET (SPACIOUS & BALANCED) ── */}
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
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet context={{ currentRole }} />
        </main>
      </div>
    </div>
  );
};
