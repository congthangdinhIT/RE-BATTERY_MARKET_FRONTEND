import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Layers, Hash, MapPin, User, Clock, ChevronDown, Search } from 'lucide-react';
import { MOCK_PASSPORTS } from '../data/mockData';
import type { PassportEventType } from '../types';

const EVENT_COLORS: Record<PassportEventType, string> = {
  COLLECTED:        'text-slate-700 bg-slate-100 border-slate-300',
  INSPECTED:        'text-yellow-700 bg-yellow-50 border-yellow-200',
  PASSPORT_ISSUED:  'text-emerald-700 bg-emerald-50 border-emerald-200',
  LISTED:           'text-cyan-700 bg-cyan-50 border-cyan-200',
  MATCHED:          'text-purple-700 bg-purple-50 border-purple-200',
  ESCROW_LOCKED:    'text-orange-700 bg-orange-50 border-orange-200',
  REPACKED:         'text-blue-700 bg-blue-50 border-blue-200',
  INSTALLED:        'text-teal-700 bg-teal-50 border-teal-200',
  ACTIVE_MONITORING:'text-green-700 bg-green-50 border-green-200',
  RECYCLED:         'text-red-700 bg-red-50 border-red-200',
  SPLIT_TO_MODULES: 'text-pink-700 bg-pink-50 border-pink-200',
};

export const PassportDetailsPage: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState(MOCK_PASSPORTS[0].passportCode);
  const passport = MOCK_PASSPORTS.find(p => p.passportCode === selectedCode) ?? MOCK_PASSPORTS[0];
  const pack = passport.batteryPack;

  return (
    <div className="space-y-6 fade-in-up max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hộ Chiếu Pin (Battery Passport)</h1>
        <p className="text-sm text-slate-500 mt-1">Chuỗi mã băm SHA-256 · Lưu vết kiểm toán không thể thay đổi cho từng pin</p>
      </div>

      {/* Selector */}
      <div className="relative w-full md:w-96">
        <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer shadow-sm"
        >
          {MOCK_PASSPORTS.map(p => (
            <option key={p.passportCode} value={p.passportCode}>
              {p.passportCode} — {p.batteryPack.vehicleModel}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
      </div>

      {/* Passport Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
        {/* Passport Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-7 h-7 stroke-[2.5] fill-slate-950" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-amber-800 font-bold uppercase tracking-widest mb-1">Hộ Chiếu Pin Kỹ Thuật Số</p>
              <h2 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{passport.passportCode}</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Cấp ngày: {new Date(passport.issuedAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-amber-600" /> TRÊN SỔ CÁI
          </span>
        </div>

        {/* Pack Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Mẫu xe', value: pack.vehicleModel },
            { label: 'Sức Khỏe Pin (SOH)', value: `${pack.currentSohPercent}%`, highlight: true },
            { label: 'Dung lượng thực', value: `${pack.currentCapacityKwh.toFixed(2)} kWh` },
            { label: 'Điện áp định mức', value: `${pack.nominalVoltageV} V` },
            { label: 'Hóa học', value: pack.chemistry },
            { label: 'Kiểu dáng (Form)', value: pack.formFactor },
            { label: 'Chu kỳ sạc', value: pack.totalCycles.toLocaleString() },
            { label: 'Số VIN gốc', value: pack.originalVin, mono: true },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-colors hover:bg-slate-100">
              <p className="text-[10px] text-slate-500 uppercase font-mono font-semibold tracking-wider mb-1">{item.label}</p>
              <p className={`text-base font-black ${item.highlight ? 'text-emerald-600' : 'text-slate-800'} ${item.mono ? 'font-mono text-sm' : ''}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Latest Hash */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-mono font-bold text-slate-700">MÃ BĂM MỚI NHẤT (SHA-256)</span>
          </div>
          <p className="text-sm font-mono text-slate-600 break-all bg-white p-3 rounded-xl border border-slate-200">{passport.latestHash}</p>
        </div>

        {/* Events Chain */}
        <div className="pt-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-amber-600" />
            Chuỗi Lưu Vết Sự Kiện ({passport.events.length} sự kiện)
          </h3>

          <div className="space-y-6">
            {passport.events.map((evt, idx) => (
              <div key={evt.id} className="relative pl-8">
                {/* Chain connector line */}
                {idx < passport.events.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-gradient-to-b from-amber-300 to-transparent" />
                )}
                {/* Dot */}
                <div className="absolute left-1 top-2.5 w-5 h-5 rounded-full border-[3px] border-amber-200 bg-white flex items-center justify-center shadow-sm z-10">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 font-mono text-sm shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-md border ${EVENT_COLORS[evt.eventType]}`}>
                      {evt.eventType}
                    </span>
                    <span className="text-[11px] text-slate-500 font-sans flex items-center gap-1.5 font-medium bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(evt.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-slate-900 font-sans font-bold mb-1.5 text-base">{evt.title}</p>
                  <p className="text-slate-600 font-sans text-xs mb-4 leading-relaxed">{evt.description}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="font-sans font-medium">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <User className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="font-sans font-medium">{evt.performedByName} · {evt.organizationName}</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl border">
                      <p className="text-slate-500 mb-1">Mã băm trước:&nbsp;
                        <span className="text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">{evt.previousHash.substring(0, 32)}...</span>
                      </p>
                      <p className="text-amber-800 font-semibold">Mã băm khối:&nbsp;
                        <span className="bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-900">{evt.hash.substring(0, 32)}...</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
