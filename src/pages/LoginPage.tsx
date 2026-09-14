import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, Mail, ArrowRight } from 'lucide-react';
import { ROUTES } from '../config/routes';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('buyer@re-battery.vn');
  const [password, setPassword] = useState('MatKhau123!');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(ROUTES.MARKETPLACE);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-md space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 mx-auto shadow-md shadow-amber-500/20">
            <Zap className="w-7 h-7 stroke-[2.5] fill-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">CHỢ GIAO DỊCH PIN REBATT</h1>
          <p className="text-sm text-slate-500 font-medium">Hệ thống Quản lý B2B Pin Second-Life</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Email Doanh Nghiệp</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow shadow-inner"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Mật Khẩu</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow shadow-inner"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-md"
          >
            ĐĂNG NHẬP HỆ THỐNG <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        <div className="pt-6 border-t border-slate-100 text-center text-xs font-semibold text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
          Tài khoản Doanh nghiệp: <span className="text-amber-800 font-bold">buyer@re-battery.vn</span>
        </div>
      </div>
    </div>
  );
};
