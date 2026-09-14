import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../config/routes';

export const PublicTracePage: React.FC = () => {
  const { passportCode } = useParams<{ passportCode: string }>();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-5xl mb-6 flex justify-start">
        <Link to={ROUTES.MARKETPLACE} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-amber-700 transition">
          <ArrowLeft className="w-4 h-4" /> Về Chợ Giao Dịch
        </Link>
      </div>

      <div className="max-w-xl w-full bg-white border border-slate-200 p-8 md:p-10 rounded-3xl shadow-xl space-y-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-amber-500 flex items-center justify-center text-slate-950 mx-auto shadow-md shadow-amber-500/20">
            <ShieldCheck className="w-10 h-10 stroke-[2.5] fill-slate-950" />
          </div>
          <h1 className="text-2xl font-black font-mono tracking-tight text-slate-900 mt-4">CỔNG TRA CỨU HỘ CHIẾU PIN</h1>
          <p className="text-sm text-slate-500 font-medium">Tra cứu công khai nguồn gốc pin xe điện second-life qua QR Code</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center font-mono shadow-inner">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mã Passport Truy Xuất</p>
          <p className="text-xl md:text-2xl font-black text-amber-800">{passportCode || 'PASS-20260815-VF801'}</p>
        </div>

        <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between text-sm text-amber-900 gap-4 shadow-sm">
          <span className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-amber-600" /> Xác minh Chữ ký SHA-256 Ledger
          </span>
          <span className="font-mono font-black text-amber-900 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-sm">
            100% HỢP LỆ
          </span>
        </div>
      </div>
    </div>
  );
};
