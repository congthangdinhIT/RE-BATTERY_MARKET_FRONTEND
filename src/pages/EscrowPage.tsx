import React, { useState } from 'react';
import { Lock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { MOCK_ESCROW_TRANSACTIONS } from '../data/mockData';
import type { EscrowTransaction, EscrowStatus } from '../types';

const STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; icon: React.ElementType; desc: string }> = {
  LOCKED:    { label: 'ĐANG KHÓA (LOCKED)',   color: 'text-orange-700 bg-orange-50 border-orange-200', icon: Lock,          desc: 'Tiền đang được giữ an toàn tại REBATT. Chờ nghiệm thu.' },
  RELEASED:  { label: 'ĐÃ GIẢI NGÂN (RELEASED)',  color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2, desc: 'Nghiệm thu đạt. Tiền đã được chuyển cho người bán.' },
  DISPUTED:  { label: 'TRANH CHẤP (DISPUTED)',    color: 'text-red-700 bg-red-50 border-red-200',         icon: AlertTriangle,  desc: 'Nghiệm thu KHÔNG đạt. Đang xử lý khiếu nại & bồi thường.' },
  REFUNDED:  { label: 'HOÀN TIỀN (REFUNDED)',     color: 'text-blue-700 bg-blue-50 border-blue-200',      icon: XCircle,        desc: 'Tranh chấp đã xử lý xong. Tiền đã được hoàn lại cho người mua.' },
};

// Escrow flow steps — 7 bước Asset-Light model (Business Spec §5.5 & §5.6)
const FLOW_STEPS = [
  { key: 'create',  label: '1. Tạo Đơn Hàng',        desc: 'Tạo đơn hàng → CREATED',        active: true  },
  { key: 'lock',    label: '2. Khóa Escrow',          desc: 'VNPAY/ZaloPay khóa tiền → LOCKED',  active: true  },
  { key: 'inspect', label: '3. Kiểm Định',            desc: 'TÜV SÜD xác nhận SOH/RUL',          active: true  },
  { key: 'ship',    label: '4. Vận Chuyển',          desc: 'LSP Class 9 — UN 3480/3481',         active: false },
  { key: 'qr',      label: '5. Quét QR Nghiệm Thu',   desc: 'QR SOH validation tại điểm nhận',  active: false },
  { key: 'accept',  label: '6. Nghiệm Thu BESS',      desc: 'Xem xét kỹ thuật + nhật ký',       active: false },
  { key: 'release', label: '7. Giải Ngân − 7%',        desc: 'Đạt → RELEASED | Lỗi → DISPUTED',   active: false },
];

export const EscrowPage: React.FC = () => {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>(MOCK_ESCROW_TRANSACTIONS);
  const { currentRole } = useOutletContext<{ currentRole: string }>();
  const canActOnEscrow = ['BUYER', 'SYSTEM_INTEGRATOR', 'Admin', 'MANAGER_STAFF'].includes(currentRole);

  const handleRelease = (txId: string) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === txId
          ? { ...tx, status: 'RELEASED', releasedAt: new Date().toISOString(), releaseNote: 'Nghiệm thu đạt. Giải ngân tự động thành công.' }
          : tx
      )
    );
  };

  const handleDispute = (txId: string) => {
    setTransactions(prev =>
      prev.map(tx => tx.id === txId ? { ...tx, status: 'DISPUTED' } : tx)
    );
  };

  return (
    <div className="space-y-6 fade-in-up max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bảo Vệ Giao Dịch (Escrow Protection)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Cơ chế ký quỹ an toàn: tiền được giữ tại REBATT cho đến khi nghiệm thu BESS thành công (BR-003, BR-004)
        </p>
      </div>

      {/* Commission Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2.5 bg-amber-100 rounded-xl shrink-0">
          <span className="text-2xl font-black text-amber-700">7%</span>
        </div>
        <div>
          <p className="text-sm font-bold text-amber-900 mb-1">Phí Hoa Hồng Sàn REBATT — 7% trên giá trị giao dịch</p>
          <p className="text-xs text-amber-800 leading-relaxed">
            REBATT khấu trừ <strong>7%</strong> hoa hồng từ số tiền Escrow khi giải ngân cho người bán.
            Thanh toán qua <strong>VNPAY / ZaloPay</strong> — hỗ trợ cả chuyển khoản ngân hàng, QR Code và ví điện tử.
            Phí vận hành thường do người bán chịu (khấu trừ từ tiền Escrow lúc giải ngân).
            Ví dụ: Giao dịch 68.000.000đ → REBATT nhận <strong>4.760.000đ</strong> — Người bán nhận <strong>63.240.000đ</strong>.
          </p>
        </div>
      </div>

      {/* Escrow Flow Diagram */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">Biểu Đồ Luồng Escrow (Business Spec §5.5 & §5.6)</h3>
        <div className="flex items-start gap-2 overflow-x-auto pb-4">
          {FLOW_STEPS.map((step, idx) => (
            <React.Fragment key={step.key}>
              <div className={`flex-1 min-w-[120px] p-3 rounded-2xl border text-center transition-colors ${
                step.active
                  ? 'bg-amber-50 border-amber-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <p className={`text-xs font-bold mb-1.5 ${step.active ? 'text-amber-800 font-extrabold' : 'text-slate-500'}`}>{step.label}</p>
                <p className="text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-100">{step.desc}</p>
              </div>
              {idx < FLOW_STEPS.length - 1 && (
                <ArrowRight className={`w-4 h-4 mt-5 shrink-0 ${step.active ? 'text-amber-500' : 'text-slate-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-600"><strong className="text-slate-900">BR-003:</strong> Chỉ khóa quỹ khi Đơn Hàng = CREATED</span>
          <span className="text-[11px] text-slate-600"><strong className="text-slate-900">BR-004:</strong> Chỉ giải ngân khi Escrow = LOCKED</span>
          <span className="text-[11px] text-slate-600"><strong className="text-slate-900">BR-010:</strong> Vận chuyển Point-to-Point Class 9 — NĐ 34/2024/NĐ-CP</span>
          <span className="text-[11px] text-slate-600"><strong className="text-slate-900">QR SOH:</strong> Xác thực SOH tại điểm giao hàng trước khi nhận tiền</span>
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-5">
        <h2 className="text-lg font-bold text-slate-900">Danh Sách Giao Dịch Escrow ({transactions.length})</h2>

        {transactions.map((tx) => {
          const cfg = STATUS_CONFIG[tx.status];
          const StatusIcon = cfg.icon;

          return (
            <div key={tx.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 md:p-8 space-y-5">
              {/* Transaction Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-[11px] font-mono text-slate-500 font-bold mb-1 uppercase tracking-wider">Mã Giao Dịch: {tx.transactionCode}</p>
                  <p className="text-3xl font-black text-slate-900 font-mono">
                    {tx.amount.toLocaleString('vi-VN')} ₫
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Phí REBATT 7%: <span className="font-bold text-amber-700">{Math.round(tx.amount * 0.07).toLocaleString('vi-VN')} ₫</span>
                    &nbsp;•&nbsp;
                    Người bán nhận: <span className="font-bold text-emerald-700">{Math.round(tx.amount * 0.93).toLocaleString('vi-VN')} ₫</span>
                  </p>
                </div>
                <span className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold shadow-sm ${cfg.color}`}>
                  <StatusIcon className="w-5 h-5" />
                  {cfg.label}
                </span>
              </div>

              {/* Status description */}
              <div className={`p-4 rounded-xl border text-sm font-medium flex items-start gap-3 ${cfg.color}`}>
                <StatusIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{cfg.desc}</p>
              </div>

              {/* Pack info */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Pin (Battery Pack)</p>
                  <p className="font-mono font-bold text-slate-900 text-sm">{tx.packSerial}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{tx.packModel}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Người Mua (Buyer)</p>
                  <p className="font-bold text-slate-900 text-sm">{tx.buyerName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Người Bán (Seller)</p>
                  <p className="font-bold text-slate-900 text-sm">{tx.sellerName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Thời Gian Khóa</p>
                  <p className="text-slate-700 text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {new Date(tx.lockedAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                {tx.releasedAt && (
                  <div className="col-span-full md:col-span-2 lg:col-span-2">
                    <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-widest mb-1">Đã Giải Ngân Lúc</p>
                    <p className="text-amber-900 font-bold text-sm bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 inline-block">
                      {new Date(tx.releasedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}
                {tx.releaseNote && (
                  <div className="col-span-full">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Ghi Chú Hệ Thống</p>
                    <p className="text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-200">{tx.releaseNote}</p>
                  </div>
                )}
              </div>

              {/* Actions — only when LOCKED and allowed */}
              {tx.status === 'LOCKED' && canActOnEscrow && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleRelease(tx.id)}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    Nghiệm Thu Đạt → Giải Ngân Cho Người Bán
                  </button>
                  <button
                    onClick={() => handleDispute(tx.id)}
                    className="px-6 py-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-bold text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Nghiệm Thu FAILED → Mở Tranh Chấp
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
