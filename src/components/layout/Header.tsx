import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Lock, LogOut, User } from 'lucide-react';
import { ROUTES } from '../../config/routes';

interface HeaderProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to={ROUTES.HOME} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm shadow-amber-500/20">
            <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900">RE-BATTERY</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-bold">MARKET B2B</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Nền Tảng Giao Dịch Pin Second-Life & Hộ Chiếu Số</p>
          </div>
        </Link>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          {/* Role Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500 hidden sm:inline">Tài khoản / Vai trò:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="BUYER">NGƯỜI MUA (SME / Solar EPC)</option>
              <option value="SELLER">NGƯỜI BÁN (Garage / Đội Xe)</option>
              <option value="TESTING_LAB">TRUNG TÂM KIỂM ĐỊNH (Testing Lab)</option>
              <option value="SYSTEM_INTEGRATOR">NHÀ TÍCH HỢP HỆ THỐNG (SI)</option>
              <option value="LOGISTICS">VẬN CHUYỂN (Logistics)</option>
              <option value="ADMIN">QUẢN TRỊ VIÊN (Sàn RE-BATTERY)</option>
            </select>
          </div>

          <button
            onClick={() => navigate(ROUTES.ESCROW)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 transition"
          >
            <Lock className="w-3.5 h-3.5" /> Cổng Escrow
          </button>

          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

