import React from 'react';
import { Globe, Recycle, Award, Leaf, TrendingUp, ShieldCheck } from 'lucide-react';
import { MOCK_BATTERY_PACKS } from '../data/mockData';

export const EprCompliancePage: React.FC = () => {
  // Compute from mock
  const totalCapacity = MOCK_BATTERY_PACKS.reduce((s, p) => s + p.currentCapacityKwh, 0);
  const co2Saved = (totalCapacity * 0.45).toFixed(1); // ~0.45 tấn CO2/kWh second-life
  const metalRecovered = (totalCapacity * 1.2).toFixed(1); // kg kim loại/kWh

  return (
    <div className="space-y-6 fade-in-up max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tuân Thủ EPR & Báo Cáo ESG</h1>
        <p className="text-sm text-slate-500 mt-1">
          Trách Nhiệm Mở Rộng Của Nhà Sản Xuất (Luật BVMT 2020) · Báo Cáo Phát Triển Bền Vững
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {[
          { label: 'Tỷ Lệ Tái Sử Dụng (Vòng 2)', value: '78.4%',         unit: 'so với 0% chôn lấp', icon: Recycle,     color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'CO₂ Khí Thải Giảm Trừ',     value: `${co2Saved} tấn`, unit: '~0.45 T/kWh',       icon: Leaf,        color: 'text-green-600',   bg: 'bg-green-50 border-green-200' },
          { label: 'Kim Loại Thu Hồi Khai Báo', value: `${metalRecovered} kg`, unit: 'Li, Ni, Co, Mn', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200' },
          { label: 'Chứng Nhận EPR Đã Cấp',     value: '320',            unit: 'Giấy chứng nhận',    icon: Award,       color: 'text-yellow-600',  bg: 'bg-yellow-50 border-yellow-200' },
          { label: 'Năng Lượng Tuần Hoàn',      value: `${totalCapacity.toFixed(1)} kWh`, unit: 'Dung lượng hệ thống ghi nhận', icon: Globe, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
          { label: 'Truy Xuất Gốc (Hash OK)',   value: '100%',           unit: 'Xác thực Blockchain', icon: ShieldCheck, color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-200' },
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

      {/* Regulations */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-600" /> Khung Pháp Lý Tham Chiếu Áp Dụng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Luật Bảo Vệ Môi Trường 2020 (VN)', detail: 'EPR — Quy định nhà sản xuất có trách nhiệm thu hồi, xử lý và tái chế pin xe điện cuối vòng đời thay vì thải bỏ.', status: 'TUÂN THỦ' },
            { name: 'Quy Định Pin EU (EU Battery Regulation 2023)', detail: 'Bắt buộc áp dụng Digital Battery Passport (Hộ chiếu pin) vào năm 2027 đối với mọi xe điện nhập khẩu. REBATT đã sẵn sàng đáp ứng.', status: 'SẴN SÀNG' },
            { name: 'Tiêu Chuẩn Vận Chuyển IATA/IMDG', detail: 'Pin Li-ion qua sử dụng được phân loại là hàng hóa nguy hiểm Nhóm 9 (Class 9). Đòi hỏi quy trình đóng gói & vận chuyển chuyên biệt.', status: 'TUÂN THỦ' },
            { name: 'Tiêu Chuẩn An Toàn UL 1974', detail: 'Chuẩn mực cao nhất của Hoa Kỳ về đánh giá độ an toàn của pin xe điện được tái sử dụng cho hệ thống BESS.', status: 'TUÂN THỦ' },
            { name: 'Tiêu Chuẩn Kỹ Thuật SAE J2997/J2998', detail: 'Quy trình chuẩn hóa toàn cầu về việc đo lường SOH, tính toán RUL (Tuổi thọ còn lại) cho pin tái sử dụng.', status: 'TUÂN THỦ' },
            { name: 'Hệ Thống Quản Lý ISO 14001', detail: 'Khung tiêu chuẩn chứng nhận hệ thống quản lý môi trường. Hỗ trợ cho các báo cáo ESG của doanh nghiệp.', status: 'ĐANG XÉT DUYỆT' },
          ].map((reg, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-slate-100 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-sm font-bold text-slate-900 leading-snug">{reg.name}</span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border shrink-0 shadow-sm ${
                  reg.status === 'TUÂN THỦ' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                  reg.status === 'SẴN SÀNG' ? 'text-cyan-700 bg-cyan-50 border-cyan-200' :
                  'text-yellow-700 bg-yellow-50 border-yellow-200'
                }`}>
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
