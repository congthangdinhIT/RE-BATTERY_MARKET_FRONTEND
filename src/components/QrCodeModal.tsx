import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, Copy, ShieldCheck, ExternalLink } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  serialNumber: string;
  passportCode?: string;
  modelName?: string;
  sohPercent?: number;
  capacityKwh?: number;
  actionType?: 'RECEIVE' | 'VIEW_ONLY';
  onConfirmReceive?: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  serialNumber,
  passportCode,
  modelName,
  sohPercent,
  capacityKwh,
  actionType = 'VIEW_ONLY',
  onConfirmReceive,
}) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifiedDone, setIsVerifiedDone] = useState(false);

  if (!isOpen) return null;

  const traceCode = passportCode || `PASS-20260924-${serialNumber.substring(0, 5).toUpperCase()}`;
  const traceUrl = `${window.location.origin}/#/trace/${traceCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(traceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScanAndReceive = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerifiedDone(true);
      if (onConfirmReceive) {
        onConfirmReceive();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs fade-in-up">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <QrCode className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">{subtitle || 'Quét mã QR để tra cứu hoặc nghiệm thu pin'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Real Image Box */}
        <div className="bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-200 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 text-center relative">
          {/* Real Scannable QR Code Image */}
          <div className="w-52 h-52 bg-white border-4 border-slate-900 rounded-2xl p-2 shadow-md flex items-center justify-center relative group">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(traceUrl)}`}
              alt={`Mã QR ${serialNumber}`}
              className="w-full h-full object-contain rounded-lg transition transform group-hover:scale-105"
            />
          </div>

          <div>
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">MÃ SERIAL PIN (QUÉT ĐƯỢC BẰNG ĐIỆN THOẠI THẬT)</p>
            <p className="text-base font-black font-mono text-slate-900 mt-0.5">{serialNumber}</p>
            {passportCode && (
              <p className="text-xs font-mono font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-200 inline-block mt-1">
                {passportCode}
              </p>
            )}
          </div>
        </div>

        {/* Battery Summary Info */}
        {(modelName || sohPercent !== undefined || capacityKwh !== undefined) && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 gap-3 text-xs">
            {modelName && (
              <div className="col-span-2">
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Mẫu Pin / Xe</span>
                <span className="text-slate-900 font-bold text-sm">{modelName}</span>
              </div>
            )}
            {sohPercent !== undefined && (
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Đo SOH Thực Tế</span>
                <span className="text-emerald-700 font-black text-sm font-mono">{sohPercent}% (Đạt chuẩn)</span>
              </div>
            )}
            {capacityKwh !== undefined && (
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">Dung Lượng</span>
                <span className="text-slate-900 font-bold text-sm font-mono">{capacityKwh} kWh</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {actionType === 'RECEIVE' && !isVerifiedDone && (
            <button
              onClick={handleSimulateScanAndReceive}
              disabled={isVerifying}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>Đang đối chiếu dữ liệu QR & SOH...</>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> QUÉT & XÁC NHẬN NHẬN PIN
                </>
              )}
            </button>
          )}

          {actionType === 'RECEIVE' && isVerifiedDone && (
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl text-emerald-900 text-center font-bold text-xs flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              Đã xác thực QR & Đánh dấu Nhận Pin Thành Công!
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-4 h-4 text-slate-500" />
              {copied ? 'Đã sao chép link!' : 'Sao chép link QR'}
            </button>
            <a
              href={traceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" /> Tra cứu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
