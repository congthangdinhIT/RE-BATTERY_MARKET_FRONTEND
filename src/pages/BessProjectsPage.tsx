import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Building2, CheckCircle2, XCircle, Clock, Wrench, Package, Zap, Settings, AlertTriangle } from 'lucide-react';
import { MOCK_BESS_PROJECTS } from '../data/mockData';
import type { BessProject, BessInstallationStatus } from '../types';

const STATUS_CONFIG: Record<BessInstallationStatus, { label: string; color: string; icon: React.ElementType }> = {
  CREATED:          { label: 'Đã tạo dự án',         color: 'text-slate-700 bg-slate-100 border-slate-300',   icon: Package },
  BATTERY_RECEIVED: { label: 'Đã nhận đủ pin',       color: 'text-blue-700 bg-blue-50 border-blue-200',     icon: Package },
  ASSEMBLING:       { label: 'Đang lắp ráp BESS',    color: 'text-yellow-700 bg-yellow-50 border-yellow-200', icon: Wrench },
  INSTALLED:        { label: 'Đã hoàn thiện phần cứng',color: 'text-cyan-700 bg-cyan-50 border-cyan-200',     icon: Settings },
  TESTING:          { label: 'Đang chạy thử nghiệm', color: 'text-purple-700 bg-purple-50 border-purple-200', icon: Zap },
  ACCEPTED:         { label: 'Nghiệm thu thành công',color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  REJECTED:         { label: 'Nghiệm thu THẤT BẠI',  color: 'text-red-700 bg-red-50 border-red-200',        icon: XCircle },
  UNDER_WARRANTY:   { label: 'Đang bảo hành (1 năm)',color: 'text-teal-700 bg-teal-50 border-teal-200', icon: CheckCircle2 },
};

// BessInstallationStatus lifecycle order
const STATUS_ORDER: BessInstallationStatus[] = [
  'CREATED', 'BATTERY_RECEIVED', 'ASSEMBLING', 'INSTALLED', 'TESTING', 'ACCEPTED', 'UNDER_WARRANTY'
];

const SHORT_STATUS: Record<BessInstallationStatus, string> = {
  CREATED: 'TẠO MỚI',
  BATTERY_RECEIVED: 'NHẬN PIN',
  ASSEMBLING: 'LẮP RÁP',
  INSTALLED: 'ĐÃ LẮP',
  TESTING: 'THỬ NGHIỆM',
  ACCEPTED: 'NGHIỆM THU',
  UNDER_WARRANTY: 'BẢO HÀNH',
  REJECTED: 'TỪ CHỐI',
};

export const BessProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<BessProject[]>(MOCK_BESS_PROJECTS);
  const { currentRole } = useOutletContext<{ currentRole: string }>();
  const canUpdateBess = ['SYSTEM_INTEGRATOR', 'Admin', 'MANAGER_STAFF'].includes(currentRole);

  const advanceStatus = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const currentIdx = STATUS_ORDER.indexOf(p.status as BessInstallationStatus);
      const nextStatus = STATUS_ORDER[currentIdx + 1];
      if (!nextStatus) return p;

      let updates: Partial<BessProject> = { status: nextStatus };
      // BR-007: Auto warranty 1 year when ACCEPTED
      if (nextStatus === 'UNDER_WARRANTY') {
        const warrantyEnd = new Date();
        warrantyEnd.setFullYear(warrantyEnd.getFullYear() + 1);
        updates.warrantyEndDate = warrantyEnd.toISOString();
      }
      return { ...p, ...updates };
    }));
  };

  const rejectProject = (projectId: string) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, status: 'REJECTED' as BessInstallationStatus } : p
    ));
  };

  return (
    <div className="space-y-6 fade-in-up max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dự Án BESS (Lưu Trữ Năng Lượng)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi tiến độ lắp đặt Battery Energy Storage System — Business Spec §5.7
        </p>
      </div>

      {/* Status Lifecycle */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          Vòng Đời Trạng Thái Lắp Đặt BESS
        </h3>
        <div className="flex flex-wrap gap-2.5 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {STATUS_ORDER.map((s, i) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <React.Fragment key={s}>
                <span className={`text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-lg border shadow-sm ${cfg.color}`}>
                  {SHORT_STATUS[s]}
                </span>
                {i < STATUS_ORDER.length - 1 && (
                  <span className="text-slate-300 font-bold">→</span>
                )}
              </React.Fragment>
            );
          })}
          <span className="text-slate-300 font-bold mx-2">/</span>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-lg border shadow-sm text-red-700 bg-red-50 border-red-200">
            TỪ CHỐI
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <strong className="text-slate-900">Quy tắc BR-007:</strong> Khi trạng thái chuyển sang ACCEPTED, hệ thống tự động kích hoạt bảo hành 1 năm.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((project) => {
          const cfg = STATUS_CONFIG[project.status];
          const StatusIcon = cfg.icon;
          const currentIdx = STATUS_ORDER.indexOf(project.status as BessInstallationStatus);
          const isTerminal = project.status === 'UNDER_WARRANTY' || project.status === 'REJECTED';
          const isTesting = project.status === 'TESTING';

          return (
            <div key={project.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 md:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-[11px] font-mono text-slate-500 font-bold mb-1 uppercase tracking-wider">Mã Dự Án: {project.id}</p>
                  <p className="text-xl font-black text-slate-900">Hệ Thống BESS — Đơn Hàng {project.orderId}</p>
                </div>
                <span className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold shadow-sm ${cfg.color}`}>
                  <StatusIcon className="w-5 h-5" />
                  {cfg.label}
                </span>
              </div>

              {/* Status Progress Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex gap-1.5">
                  {STATUS_ORDER.map((s, i) => (
                    <div
                      key={s}
                      className={`flex-1 h-2.5 rounded-full transition-all duration-500 ${
                        i <= currentIdx && project.status !== 'REJECTED'
                          ? 'bg-amber-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-[10px] text-slate-500 font-mono font-bold">TẠO MỚI</span>
                  <span className="text-[10px] text-amber-800 font-mono font-bold">BẢO HÀNH</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Nhà Tích Hợp (SI)</p>
                  <p className="font-bold text-slate-900 text-sm">{project.systemIntegratorName}</p>
                </div>
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Chủ Đầu Tư (Buyer)</p>
                  <p className="font-bold text-slate-900 text-sm">{project.buyerName}</p>
                </div>
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Ngày Bắt Đầu</p>
                  <p className="text-slate-700 font-medium text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Configuration */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Chi Tiết Cấu Hình (Configuration Details)</p>
                <p className="text-sm font-medium text-slate-800 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">{project.configurationDetails}</p>
              </div>

              {/* Warranty Info (when applicable) */}
              {project.warrantyEndDate && (
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-teal-600 shrink-0" />
                  <div>
                    <span className="text-teal-800 font-bold text-sm block">Đã kích hoạt bảo hành 1 năm (BR-007)</span>
                    <span className="text-teal-600 text-xs font-medium">Hết hạn vào: {new Date(project.warrantyEndDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              )}

              {/* Rejected */}
              {project.status === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                  <p className="text-sm font-bold text-red-800">Nghiệm thu THẤT BẠI — Giao dịch Escrow chuyển sang trạng thái DISPUTED, đang xử lý bồi thường.</p>
                </div>
              )}

              {/* Action Buttons */}
              {!isTerminal && canUpdateBess && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => advanceStatus(project.id)}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    {isTesting ? 'Nghiệm Thu ĐẠT → Kích Hoạt BẢO HÀNH' : `Cập Nhật Tiến Độ → ${STATUS_ORDER[currentIdx + 1] ?? '...'}`}
                  </button>
                  {isTesting && (
                    <button
                      onClick={() => rejectProject(project.id)}
                      className="px-6 py-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Nghiệm Thu THẤT BẠI (Lỗi)
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="text-center py-20 text-slate-500 bg-white border border-slate-200 border-dashed rounded-3xl">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-600">Chưa có dự án BESS nào được tạo</p>
          </div>
        )}
      </div>
    </div>
  );
};
