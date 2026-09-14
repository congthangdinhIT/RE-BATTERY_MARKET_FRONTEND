import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BatteryCharging, Cpu, ShieldCheck, Globe, Lock, Layers, LayoutDashboard
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

export const Sidebar: React.FC = () => {
  const navItems = [
    { path: ROUTES.MARKETPLACE, label: 'Chợ Giao Dịch B2B', icon: BatteryCharging },
    { path: ROUTES.SMART_MATCHING, label: 'Ghép Nối Thông Minh', icon: Cpu },
    { path: ROUTES.BATTERY_PACKS, label: 'Quản Lý Lô Pin', icon: Layers },
    { path: ROUTES.PASSPORTS, label: 'Hộ Chiếu Pin', icon: ShieldCheck },
    { path: ROUTES.ESCROW, label: 'Tài Khoản Escrow', icon: Lock },
    { path: ROUTES.DASHBOARD, label: 'Bảng Điều Khiển', icon: LayoutDashboard },
    { path: ROUTES.EPR_COMPLIANCE, label: 'Tuân Thủ EPR & ESG', icon: Globe },
  ];

  return (
    <aside className="w-[268px] bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-5 hidden md:block shrink-0">
      <div className="space-y-2.5">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">DANH MỤC HỆ THỐNG</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-amber-500/15 text-amber-900 font-bold border-l-4 border-amber-500 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-200/80 rounded-2xl text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Sổ Cái SHA-256
          </span>
          <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200">ACTIVE</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          Mọi sự kiện được ghi vết theo chuỗi mã hóa không thể thay đổi.
        </p>
      </div>
    </aside>
  );
};
