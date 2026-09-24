import React, { useState, useEffect, useRef } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, Camera, XCircle, VideoOff, Upload } from 'lucide-react';
import jsQR from 'jsqr';

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
  onConfirmReceive,
}) => {
  const [scannedCode, setScannedCode] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifiedDone, setIsVerifiedDone] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScannedCode('');
      setIsVerifiedDone(false);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Không thể mở Webcam máy tính. Vui lòng tải ảnh QR lên hoặc chọn "Tự điền mã".');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Frame processing loop for QR decoding from webcam
  useEffect(() => {
    let scanInterval: ReturnType<typeof setInterval>;

    if (isCameraActive) {
      scanInterval = setInterval(() => {
        const video = videoRef.current;
        if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return;

        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setScannedCode(code.data);
          stopCamera();
        }
      }, 250);
    }

    return () => {
      if (scanInterval) clearInterval(scanInterval);
    };
  }, [isCameraActive]);

  // Handle uploading and decoding QR code from an image file
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setScannedCode(code.data);
        } else {
          // If no code detected, fill serial for fallback
          setScannedCode(serialNumber);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

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
              <p className="text-xs text-slate-500 font-medium">{subtitle || 'Quét webcam máy tính hoặc chọn ảnh QR để nhận pin'}</p>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Webcam Camera & Image Selector Box */}
        <div className="relative bg-slate-950 rounded-2xl p-3 border border-slate-800 flex flex-col items-center justify-center overflow-hidden h-44 shadow-inner">
          
          {/* Active Live Video Element */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover rounded-xl ${isCameraActive ? 'block' : 'hidden'}`}
            autoPlay
            playsInline
            muted
          />

          {/* Hidden Canvas for QR decoding */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Inactive Camera Overlay */}
          {!isCameraActive && (
            <div className="flex flex-col items-center justify-center space-y-2 text-center p-2">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-400/60 flex items-center justify-center bg-amber-500/10">
                <Camera className="w-8 h-8 text-amber-400" />
              </div>
              <span className="text-xs text-slate-300 font-semibold">Webcam Máy Tính Đang Tắt</span>
            </div>
          )}

          {/* Scanning Laser Line when active */}
          {isCameraActive && (
            <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-bounce top-1/2 pointer-events-none" />
          )}

          {/* Quick Buttons Overlay at Bottom */}
          <div className="absolute bottom-2 inset-x-2 flex items-center gap-2 justify-center z-10">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" /> Bật Webcam Máy Tính
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <VideoOff className="w-3.5 h-3.5" /> Tắt Camera
              </button>
            )}

            {/* Hidden Image File Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-700 shadow-md cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" /> Chọn Ảnh QR
            </button>
          </div>
        </div>

        {cameraError && (
          <p className="text-[11px] text-amber-600 font-semibold bg-amber-50 p-2 rounded-xl border border-amber-200 text-center">
            {cameraError}
          </p>
        )}

        {/* Input Box for Scanned Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-800 block">
              Mã QR Đã Quét / Kết Quả Nhập:
            </label>
            <span className="text-[10px] text-slate-400 font-mono font-bold">SERIAL: {serialNumber}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              placeholder={`Quét bằng Webcam hoặc chọn ảnh (VD: ${serialNumber})...`}
              className="flex-1 bg-slate-50 border-2 border-slate-300 focus:border-amber-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition shadow-inner"
            />
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs rounded-xl transition cursor-pointer shrink-0 shadow-xs"
            >
              Tự điền mã
            </button>
          </div>
        </div>

        {/* Validation Feedback */}
        {isMatched && (
          <div className="bg-emerald-50 border-2 border-emerald-300 p-3.5 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="text-emerald-900 font-black">✓ ĐÃ KHỚP MÃ QR CHÍNH XÁC!</div>
              <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
                Mã [{scannedCode}] trùng khớp hoàn toàn với số Serial pin {serialNumber}.
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

        {/* Battery Summary Info */}
        {(modelName || sohPercent !== undefined || capacityKwh !== undefined) && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 grid grid-cols-2 gap-2 text-xs">
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
