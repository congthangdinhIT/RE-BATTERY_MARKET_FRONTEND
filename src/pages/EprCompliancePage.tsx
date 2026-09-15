import React from 'react';
import { Globe, Recycle, Award, Leaf, TrendingUp, ShieldCheck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { MOCK_BATTERY_PACKS } from '../data/mockData';

// ── Timeline pháp lý ──────────────────────────────────────────────────────────
const LEGAL_TIMELINE = [
  {
    year: '2020–2022',
    label: 'Nền tảng pháp lý Việt Nam',
    events: [
      { name: 'Luật Bảo vệ Môi trường 2020', detail: 'Điều 54 — Kinh tế tuần hoàn. Nghĩa vụ EPR thu gom, tái chế pin xe điện cuối vòng đời.' },
      { name: 'Nghị định 08/2022/NĐ-CP', detail: 'Hướng dẫn thi hành Luật BVMT 2020 — Quy định tỷ lệ tái chế bắt buộc pin xe điện.' },
    ],
    color: 'border-slate-300 bg-slate-50',
    dot: 'bg-slate-400',
  },
  {
    year: '2024',
    label: 'Logistics an toàn Class 9',
    events: [
      { name: 'Nghị định 34/2024/NĐ-CP', detail: 'Quy định vận chuyển hàng nguy hiểm Loại 9. Pin Li-ion xe điện đã qua sử dụng yêu cầu: UN 3480 (pin rời) / UN 3481 (pin trong thiết bị), xe thùng cách nhiệt, thiết bị PCCC chuyên dụng.' },
    ],
    color: 'border-orange-200 bg-orange-50',
    dot: 'bg-orange-500',
  },
  {
    year: '2026',
    label: 'Điểm rơi chiến lược REBATT',
    events: [
      { name: 'Nghị định 110/2026/NĐ-CP', detail: 'Tạm nới lỏng tỷ lệ tái chế bắt buộc pin xe điện về 0% (từ mức 8% năm 2024). Chu kỳ điều chỉnh 3 năm/lần — mốc tăng tiếp theo dự kiến 2029. REBATT có dư địa xây dựng thị trường second-life tự nguyện, dẫn dắt tiêu chuẩn trước khi pháp luật siết chặt.' },
      { name: 'Lộ trình xe điện (QĐ 876/QĐ-TTg & CT 20/CT-TTg)', detail: 'Từ 2030: ≥50% phương tiện dùng điện, 100% taxi thay mới phải là xe điện. Hà Nội cấm xe máy xăng Vành đai 1 từ 1/7/2026. Kéo theo lượng pin thải hồi tăng nhanh — nguồn cung đầu vào tăng mạnh cho REBATT giai đoạn 2026–2030.' },
    ],
    color: 'border-amber-200 bg-amber-50',
    dot: 'bg-amber-500',
  },
  {
    year: '18/02/2027',
    label: 'Chuẩn EU bắt buộc — REBATT sẵn sàng đón đầu',
    events: [
      { name: 'EU Battery Regulation 2023/1542 — Digital Battery Passport', detail: 'Bắt buộc áp dụng Hộ chiếu Pin kỹ thuật số (Digital Battery Passport) cho pin xe điện, pin phương tiện hạng nhẹ và pin công nghiệp >2 kWh khi đưa vào thị trường EU. REBATT đã triển khai cấu trúc Battery Passport tương đương ngay từ giai đoạn Pilot — tiệm cận chuẩn quốc tế trước 12+ tháng.' },
    ],
    color: 'border-blue-200 bg-blue-50',
    dot: 'bg-blue-600',
  },
  {
    year: '2029+',
    label: 'Siết chặt trở lại — REBATT ở vị thế dẫn dắt',
    events: [
      { name: 'Điều chỉnh EPR lần tiếp theo (NĐ 110/2026)', detail: 'Mức tái chế bắt buộc có thể tăng trở lại (tối đa +10%/lần). Các doanh nghiệp bán pin cần hồ sơ dữ liệu chuẩn để chứng minh tuân thủ. REBATT sẽ đã tích lũy 3.000–5.000 hồ sơ pin, nắm giữ lợi thế Big Data và là đơn vị duy nhất có sẵn hạ tầng Battery Passport để phục vụ nhu cầu tuân thủ EPR.' },
    ],
    color: 'border-emerald-200 bg-emerald-50',
    dot: 'bg-emerald-600',
  },
];

export const EprCompliancePage: React.FC = () => {
  const totalCapacity = MOCK_BATTERY_PACKS.reduce((s, p) => s + p.currentCapacityKwh, 0);
  const co2Saved = (totalCapacity * 0.45).toFixed(1);
  const metalRecovered = (totalCapacity * 1.2).toFixed(1);
  const batchAPacks = MOCK_BATTERY_PACKS.filter(p => p.inspectionType === 'BATCH_A').length;
  const listedPacks = MOCK_BATTERY_PACKS.filter(p => p.status === 'LISTED').length;
  const batchARate = listedPacks > 0 ? Math.round((batchAPacks / listedPacks) * 100) : 0;

  return (
    <div className="space-y-6 fade-in-up max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tuân Thủ EPR & Báo Cáo ESG</h1>
        <p className="text-sm text-slate-500 mt-1">
          Trách Nhiệm Mở Rộng Của Nhà Sản Xuất (Luật BVMT 2020) · Mô hình Asset-Light Zero-Inventory · Hộ chiếu Pin Số
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {[
          { label: 'Tỷ Lệ Tái Sử Dụng (Vòng 2)', value: '78.4%',               unit: 'so với 0% chôn lấp',            icon: Recycle,     color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'CO₂ Khí Thải Giảm Trừ',       value: `${co2Saved} tấn`,     unit: '~0.45 T/kWh second-life',       icon: Leaf,        color: 'text-green-600',   bg: 'bg-green-50 border-green-200' },
          { label: 'Kim Loại Thu Hồi Khai Báo',    value: `${metalRecovered} kg`, unit: 'Li, Ni, Co, Mn',               icon: TrendingUp,  color: 'text-teal-600',    bg: 'bg-teal-50 border-teal-200' },
          { label: 'Tỷ Lệ Kiểm Định Theo Lô (A)', value: `${batchARate}%`,       unit: `Mục tiêu ≥60% · ${batchAPacks} lô đạt`, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Năng Lượng Tuần Hoàn',         value: `${totalCapacity.toFixed(1)} kWh`, unit: 'Dung lượng hệ thống', icon: Globe, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
          { label: 'An Toàn Vận Hành (Zero Incident)', value: '0.00%',           unit: 'Sự cố cháy nổ — SLA bắt buộc', icon: ShieldCheck, color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-200' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`border rounded-3xl p-6 shadow-sm ${item.bg}`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{item.label}</p>
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
              </div>
              <p className={`text-3xl font-black font-mono ${item.color}`}>{item.value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1.5">{item.unit}</p>
            </div>
          );
        })}
      </div>

      {/* Strategic EPR Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-900 mb-1">Điểm rơi chiến lược — NĐ 110/2026/NĐ-CP</p>
          <p className="text-xs text-amber-800 leading-relaxed">
            Nghị định 110/2026 tạm nới lỏng tỷ lệ tái chế bắt buộc pin xe điện về <strong>0%</strong>, chu kỳ điều chỉnh 3 năm — mốc siết chặt tiếp theo dự kiến <strong>2029</strong>.
            Đây là cơ hội để REBATT xây dựng thị trường second-life và thiết lập tiêu chuẩn ngành <em>trước khi</em> pháp luật bắt buộc. Vị thế dẫn dắt chuẩn mực mang lại lợi thế lớn hơn nhiều so với việc chạy theo tuân thủ sau này.
          </p>
        </div>
      </div>

      {/* Legal Timeline */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> Lộ Trình Pháp Lý & Cơ Hội Chiến Lược
        </h2>
        <div className="relative">
          <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-200" />
          <div className="space-y-5">
            {LEGAL_TIMELINE.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`w-6 h-6 rounded-full ${item.dot} border-2 border-white shadow shrink-0 mt-1 z-10`} />
                <div className={`flex-1 border rounded-2xl p-4 ${item.color}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-white/70 px-2 py-0.5 rounded border border-slate-200">{item.year}</span>
                    <span className="text-sm font-bold text-slate-800">{item.label}</span>
                  </div>
                  <div className="space-y-2">
                    {item.events.map((ev, j) => (
                      <div key={j}>
                        <p className="text-xs font-bold text-slate-700">{ev.name}</p>
                        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{ev.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regulations Grid */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-600" /> Khung Pháp Lý Tham Chiếu Áp Dụng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Luật Bảo Vệ Môi Trường 2020 (VN)',  detail: 'Điều 54 — Kinh tế tuần hoàn. EPR: Nhà sản xuất & nhập khẩu ô tô điện có trách nhiệm thu gom, xử lý pin cuối vòng đời.', status: 'TUÂN THỦ' },
            { name: 'Nghị định 08/2022/NĐ-CP',            detail: 'Hướng dẫn thi hành BVMT 2020. Xác lập tỷ lệ tái chế bắt buộc — nền tảng cho lộ trình EPR doanh nghiệp.', status: 'TUÂN THỦ' },
            { name: 'Nghị định 34/2024/NĐ-CP (Class 9)',  detail: 'Vận chuyển hàng nguy hiểm Loại 9. Pin Li-ion xe điện đã dùng: UN 3480 (pin rời) / UN 3481 (pin trong thiết bị). Bắt buộc xe thùng cách nhiệt & PCCC chuyên dụng.', status: 'TUÂN THỦ' },
            { name: 'Nghị định 110/2026/NĐ-CP',           detail: 'Tỷ lệ tái chế bắt buộc pin xe điện tạm về 0%. Điều chỉnh tiếp theo 2029. Cơ hội chiến lược xây dựng chuẩn tự nguyện.', status: 'THEO DÕI' },
            { name: 'EU Battery Regulation 2023/1542',     detail: 'Bắt buộc Digital Battery Passport từ 18/02/2027 cho pin EV. REBATT đã xây dựng cấu trúc tương đương từ giai đoạn Pilot — sẵn sàng đón đầu.', status: 'SẴN SÀNG' },
            { name: 'QĐ 876/QĐ-TTg & Chỉ thị 20/CT-TTg', detail: '2030: ≥50% xe điện/xanh, 100% taxi mới phải là xe điện. Lượng pin thải hồi tăng mạnh 2026–2030 — cơ hội nguồn cung REBATT.', status: 'THEO DÕI' },
            { name: 'Tiêu Chuẩn UL 1974 & SAE J2997',     detail: 'Đánh giá an toàn pin EV tái sử dụng cho BESS (UL 1974) và đo SOH/RUL chuẩn quốc tế (SAE J2997). Bắt buộc với đối tác kiểm định TÜV SÜD của REBATT.', status: 'TUÂN THỦ' },
            { name: 'ISO 14001 — Quản Lý Môi Trường',     detail: 'Chứng nhận hệ thống quản lý môi trường. Hỗ trợ doanh nghiệp cung cấp pin lập báo cáo ESG đầy đủ khi bán pin qua REBATT.', status: 'ĐANG XÉT DUYỆT' },
          ].map((reg, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-slate-100 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-sm font-bold text-slate-900 leading-snug">{reg.name}</span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border shrink-0 flex items-center gap-1 ${
                  reg.status === 'TUÂN THỦ'         ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                  reg.status === 'SẴN SÀNG'          ? 'text-cyan-700 bg-cyan-50 border-cyan-200' :
                  reg.status === 'THEO DÕI'          ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  'text-yellow-700 bg-yellow-50 border-yellow-200'
                }`}>
                  {reg.status === 'TUÂN THỦ' && <CheckCircle2 className="w-3 h-3" />}
                  {reg.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{reg.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
