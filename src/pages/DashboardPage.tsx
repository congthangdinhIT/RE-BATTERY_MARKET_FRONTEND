import React from 'react';
import { Activity, ShieldCheck, Users, Zap, TrendingUp, Battery, Package, CheckCircle2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { MOCK_BATTERY_PACKS, MOCK_PASSPORTS, MOCK_LISTINGS, MOCK_ESCROW_TRANSACTIONS, MOCK_BESS_PROJECTS, MOCK_ORGS } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const { currentRole } = useOutletContext<{ currentRole: string }>();

  // Compute stats from mock data
  const totalPacks = MOCK_BATTERY_PACKS.length;
  const verifiedPacks = MOCK_BATTERY_PACKS.filter(p => p.status === 'VERIFIED' || p.status === 'LISTED').length;
  const avgSoh = (MOCK_BATTERY_PACKS.reduce((s, p) => s + p.currentSohPercent, 0) / totalPacks).toFixed(1);
  const totalCapacityKwh = MOCK_BATTERY_PACKS.reduce((s, p) => s + p.currentCapacityKwh, 0).toFixed(1);
  const totalOrgs = MOCK_ORGS.length;
  const activeListings = MOCK_LISTINGS.filter(l => l.isActive && !l.isSold).length;
  const lockedEscrow = MOCK_ESCROW_TRANSACTIONS.filter(e => e.status === 'LOCKED').length;
  const escrowValue = MOCK_ESCROW_TRANSACTIONS.filter(e => e.status === 'LOCKED').reduce((s, e) => s + e.amount, 0);

  const STATS = [
    { label: 'Tổng Pin Đăng Ký', value: totalPacks, unit: 'Bộ/Pack', icon: Battery, color: 'text-emerald-600', bg: 'bg-white border-slate-200' },
    { label: 'Đã Xác Thực / Lên Sàn', value: verifiedPacks, unit: 'Bộ/Pack', icon: ShieldCheck, color: 'text-cyan-600', bg: 'bg-white border-slate-200' },
    { label: 'SOH Trung Bình', value: `${avgSoh}%`, unit: '', icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-white border-slate-200' },
    { label: 'Tổng Năng Lượng', value: totalCapacityKwh, unit: 'kWh', icon: Zap, color: 'text-purple-600', bg: 'bg-white border-slate-200' },
    { label: 'Tổ Chức Đăng Ký', value: totalOrgs, unit: 'Tổ chức', icon: Users, color: 'text-blue-600', bg: 'bg-white border-slate-200' },
    { label: 'Tin Đăng (Listings)', value: activeListings, unit: 'Đang mở', icon: Package, color: 'text-teal-600', bg: 'bg-white border-slate-200' },
    { label: 'Passport SHA-256', value: MOCK_PASSPORTS.length, unit: 'Đã cấp', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-white border-slate-200' },
    { label: 'Đang Khóa Escrow', value: `${(escrowValue / 1_000_000).toFixed(0)}M ₫`, unit: `${lockedEscrow} giao dịch`, icon: Activity, color: 'text-orange-600', bg: 'bg-white border-slate-200' },
  ];

  return (
    <div className="space-y-6 fade-in-up max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bảng Điều Khiển Tổng Quan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Hiển thị giao diện và dữ liệu theo vai trò:&nbsp;
            <span className="font-mono text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-300">{currentRole}</span>
          </p>
        </div>
        <span className="flex items-center gap-2 text-[11px] font-mono font-bold text-amber-900 bg-amber-50 border border-amber-300 px-3 py-2 rounded-xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          DỮ LIỆU THỜI GIAN THỰC
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow ${stat.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className={`text-3xl font-black font-mono ${stat.color}`}>{stat.value}</p>
              {stat.unit && <p className="text-[11px] font-medium text-slate-500 mt-1">{stat.unit}</p>}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Battery Status Breakdown */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Phân Bố Trạng Thái Pin (BatteryStatus)</h2>
          <div className="space-y-4">
            {(['COLLECTED', 'TESTING_PENDING', 'VERIFIED', 'LISTED', 'ESCROW_LOCKED', 'COMPLETED', 'SPLIT'] as const).map(status => {
              const count = MOCK_BATTERY_PACKS.filter(p => p.status === status).length;
              const pct = (count / totalPacks) * 100;
              return (
                <div key={status} className="flex items-center gap-4 text-sm">
                  <span className="w-36 text-xs font-mono font-semibold text-slate-500 shrink-0 bg-slate-50 px-2 py-1 rounded border border-slate-100">{status}</span>
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-1000 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-black text-slate-800 font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BESS Projects summary */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Dự Án BESS Đang Theo Dõi</h2>
          <div className="flex-1 space-y-4">
            {MOCK_BESS_PROJECTS.map(p => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-3 border-b border-slate-100 last:border-0 gap-3">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-slate-800 font-semibold">{p.systemIntegratorName}</span>
                  <span className="text-slate-300">→</span>
                  <span className="text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{p.buyerName}</span>
                </div>
                <span className="font-mono font-bold text-xs bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg border border-yellow-200 self-start sm:self-auto">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Role-specific info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 leading-relaxed">
            <strong className="font-bold">Hướng dẫn vai trò <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-950 font-bold">{currentRole}</span>:</strong>{' '}
            {currentRole === 'BUYER' && 'Bạn có thể duyệt qua Chợ Giao Dịch, sử dụng Smart Matching để tìm pin tối ưu, và thanh toán an toàn qua Escrow.'}
            {currentRole === 'SUPPLIER' && 'Bạn có thể đăng ký các lô pin thu hồi mới (CreateBatteryPackCommand) và theo dõi tiến trình đưa lên sàn.'}
            {currentRole === 'TESTING_LAB' && 'Bạn chịu trách nhiệm cập nhật kết quả kiểm định (SOH, Cân bằng Cell, Quét Nhiệt) để hệ thống sinh Battery Passport.'}
            {currentRole === 'SYSTEM_INTEGRATOR' && 'Bạn có thể quản lý các dự án BESS từ khâu chuẩn bị, lắp ráp đến khi bàn giao và bắt đầu thời gian bảo hành.'}
            {currentRole === 'LOGISTICS' && 'Bạn cập nhật vận đơn và theo dõi trạng thái vận chuyển nguy hiểm (Class 9 Dangerous Goods).'}
            {currentRole === 'MANAGER_STAFF' && 'Bạn là nhân viên điều hành sàn giao dịch, có nhiệm vụ duyệt danh sách niêm yết, theo dõi tiến trình kiểm định và hỗ trợ khách hàng.'}
            {currentRole === 'Admin' && 'Bạn có toàn quyền xem toàn bộ hệ thống, can thiệp xử lý tranh chấp (Dispute) và cấu hình hệ thống cốt lõi.'}
          </div>
        </div>
      </div>
    </div>
  );
};
