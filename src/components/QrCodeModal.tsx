import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, Copy, ShieldCheck, Camera, ScanLine, XCircle, Sparkles } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'SCAN' | 'VIEW'>(actionType === 'RECEIVE' ? 'SCAN' : 'VIEW');
  const [scannedCode, setScannedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifiedDone, setIsVerifiedDone] = useState(false);

  if (!isOpen) return null;

  // Build absolute target URL including host and base path (e.g. GitHub Pages repo path)
  const baseUrl = window.location.href.split('#')[0].replace(/\/$/, '');
  const qrTargetUrl = `${baseUrl}/#/passports`;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrTargetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Matching verification
  const normalizedInput = scannedCode.trim().toUpperCase();
  const targetSerial = serialNumber.trim().toUpperCase();
  const targetPassport = passportCode ? passportCode.trim().toUpperCase() : '';

  const isMatched = normalizedInput !== '' && (
    normalizedInput === targetSerial ||
    (targetPassport !== '' && normalizedInput === targetPassport) ||
    normalizedInput.includes(targetSerial)
  );

  const isInvalidInput = normalizedInput !== '' && !isMatched;

  const handleConfirmReceive = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerifiedDone(true);
      if (onConfirmReceive) {
        onConfirmReceive();
      }
    }, 1000);
  };

  const handleAutoFill = () => {
    setScannedCode(serialNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs fade-in-up">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 space-y-5 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <QrCode className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">{subtitle || 'Quét hoặc nhập mã QR để xác nhận pin'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Quét/Nhập QR vs Xem QR Pin) */}
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('SCAN')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'SCAN'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ScanLine className="w-4 h-4 text-amber-600" /> Ô Quét/Nhập QR Pin
          </button>
          <button
            onClick={() => setActiveTab('VIEW')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'VIEW'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4 text-slate-600" /> Mã QR Sản Phẩm
          </button>
        </div>

        {/* TAB 1: SCANNER & INPUT FIELD */}
        {activeTab === 'SCAN' && (
          <div className="space-y-4">
            
            {/* Camera Viewfinder Simulation */}
            <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center overflow-hidden h-44 shadow-inner">
              <div className="absolute inset-0 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
              
              {/* Scanning Laser Line */}
              <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-bounce top-1/2" />

              {/* Viewfinder Corners */}
              <div className="w-32 h-32 border-2 border-dashed border-amber-400/70 rounded-xl relative flex items-center justify-center">
                <Camera className="w-8 h-8 text-amber-400/60 animate-pulse" />
              </div>

              <div className="mt-2 text-center">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1 justify-center">
                  <Sparkles className="w-3 h-3" /> Camera Máy Quét QR Đang Hoạt Động
                </span>
              </div>
            </div>

            {/* Input Box for Scanned Code */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 block">
                Ô Nhập / Quét Mã QR Hoặc Số Serial Pin:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  placeholder={`Quét hoặc nhập mã (VD: ${serialNumber})...`}
                  className="flex-1 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs rounded-xl transition cursor-pointer shrink-0"
                >
                  Tự điền mã
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Dùng camera quét QR trên vỏ pin hoặc bấm "Tự điền mã" để test nhanh.
              </p>
            </div>

            {/* Validation Feedback */}
            {isMatched && (
              <div className="bg-emerald-50 border-2 border-emerald-300 p-3.5 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-emerald-900 font-black">✓ ĐÃ KHỚP MÃ QR CHÍNH XÁC!</div>
                  <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
                    Mã [{scannedCode}] trùng khớp với gói pin {serialNumber}.
                  </div>
                </div>
              </div>
            )}

            {isInvalidInput && (
              <div className="bg-red-50 border-2 border-red-300 p-3.5 rounded-2xl text-red-950 text-xs font-bold flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <div className="text-red-900 font-black">❌ MÃ QR KHÔNG KHỚP ĐƠN HÀNG!</div>
                  <div className="text-[11px] font-medium text-red-700 mt-0.5">
                    Mã nhập vào không trùng với số Serial chuẩn [{serialNumber}].
                  </div>
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            {!isVerifiedDone ? (
              <button
                onClick={handleConfirmReceive}
                disabled={!isMatched || isVerifying}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>Đang ghi nhận dữ liệu QR & SOH...</>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> XÁC NHẬN NHẬN PIN HỢP LỆ
                  </>
                )}
              </button>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl text-emerald-900 text-center font-bold text-xs flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                Đã xác thực QR & Đánh dấu Nhận Pin Thành Công!
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DISPLAY QR CODE IMAGE */}
        {activeTab === 'VIEW' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-200 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3 text-center relative">
              {/* Real Scannable QR Code Image */}
              <div className="w-48 h-48 bg-white border-4 border-slate-900 rounded-2xl p-2 shadow-md flex items-center justify-center relative group">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrTargetUrl)}`}
                  alt={`Mã QR ${serialNumber}`}
                  className="w-full h-full object-contain rounded-lg transition transform group-hover:scale-105"
                />
              </div>

              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">MÃ SERIAL PIN</p>
                <p className="text-base font-black font-mono text-slate-900 mt-0.5">{serialNumber}</p>
                {passportCode && (
                  <p className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-200 inline-block mt-1">
                    {passportCode}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-4 h-4 text-slate-500" />
              {copied ? 'Đã sao chép link QR!' : 'Sao chép link QR'}
            </button>
          </div>
        )}

        {/* Battery Summary Info */}
        {(modelName || sohPercent !== undefined || capacityKwh !== undefined) && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 grid grid-cols-2 gap-2.5 text-xs">
            {modelName && (
              <div className="col-span-2">
                <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block">Mẫu Pin / Xe</span>
                <span className="text-slate-900 font-bold text-xs">{modelName}</span>
              </div>
            )}
            {sohPercent !== undefined && (
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block">Đo SOH Thực Tế</span>
                <span className="text-emerald-700 font-black text-xs font-mono">{sohPercent}%</span>
              </div>
            )}
            {capacityKwh !== undefined && (
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider block">Dung Lượng</span>
                <span className="text-slate-900 font-bold text-xs font-mono">{capacityKwh} kWh</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
