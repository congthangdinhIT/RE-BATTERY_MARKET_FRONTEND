import React from 'react';
import { ShieldAlert, ArrowLeft, RefreshCw, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROLE_CONFIGS, getFirstAllowedRoute } from '../lib/permissions';
import type { UserRole } from '../lib/permissions';

interface AccessDeniedProps {
  currentRole: string;
  onChangeRole?: (newRole: string) => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ currentRole, onChangeRole }) => {
  const navigate = useNavigate();
  const roleConfig = ROLE_CONFIGS[currentRole as UserRole];
  const firstAllowed = getFirstAllowedRoute(currentRole);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white border-2 border-red-200 rounded-3xl shadow-xl max-w-lg w-full p-8 text-center space-y-6 relative overflow-hidden">
        {/* Top Warning Banner */}
        <div className="w-16 h-16 rounded-2xl bg-red-100 border border-red-200 text-red-600 mx-auto flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-9 h-9 stroke-[2.2]" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-mono font-bold uppercase tracking-wider border border-red-200 mb-3">
            <Lock className="w-3.5 h-3.5" /> 403 FORBIDDEN — CHẶN TRUY CẬP
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Không Có Quyền Truy Cập Trang Này</h2>
          <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
            Tài khoản hiện tại của bạn đang dưới vai trò <span className="font-bold text-slate-900">[{roleConfig?.label || currentRole}]</span>. 
            Hệ thống REBATT đã phân quyền bảo mật và giới hạn quyền hạn đối với mô-đun này.
          </p>
        </div>

        {/* Current Role Permissions Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Mô tả vai trò</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${roleConfig?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
              {currentRole}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {roleConfig?.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => navigate(firstAllowed)}
            className="w-full sm:flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Về Trang Được Phép
          </button>
          {onChangeRole && (
            <button
              onClick={() => onChangeRole('Admin')}
              className="w-full sm:flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Đổi Sang Quyền Admin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
