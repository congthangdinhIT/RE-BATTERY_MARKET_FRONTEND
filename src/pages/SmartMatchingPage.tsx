import React, { useState } from 'react';
import { Cpu, ArrowRight, Target, Zap, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { runSmartMatching } from '../data/mockData';
import type { MatchingResult, BatteryChemistryType } from '../types';

const VOLTAGE_OPTIONS = [
  { value: 48,  label: '48V — Off-grid / Solar nhỏ (3–5 kW)' },
  { value: 115, label: '115V — Văn phòng / Cửa hàng' },
  { value: 380, label: '380V – 400V — Nhà xưởng 3 pha' },
  { value: 403, label: '400V+ — BESS thương mại lớn' },
];

export const SmartMatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const [reqCapacity, setReqCapacity] = useState(60);
  const [reqVoltage, setReqVoltage] = useState(380);
  const [reqBudget, setReqBudget] = useState(70000000);
  const [chemistry, setChemistry] = useState<'ALL' | BatteryChemistryType>('ALL');
  const [results, setResults] = useState<MatchingResult[]>([]);
  const [ran, setRan] = useState(false);

  const handleMatch = () => {
    const res = runSmartMatching(reqCapacity, reqVoltage, reqBudget, chemistry);
    setResults(res);
    setRan(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700';
    if (score >= 75) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBarClass = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-emerald-500 to-cyan-500';
    if (score >= 75) return 'bg-gradient-to-r from-yellow-400 to-orange-400';
    return 'bg-gradient-to-r from-orange-400 to-red-500';
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hệ Thống Ghép Nối Thông Minh (Smart Matching)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Thuật toán: <span className="font-mono text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Điểm Dung lượng×0.4 + Điểm SOH×0.4 + Điểm Điện áp×0.2</span> — Top 10 kết quả tốt nhất (BR-009)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT: Input Panel ── */}
        <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Nhập Yêu Cầu BESS</h2>
              <p className="text-xs text-slate-500">Hệ thống sẽ tính điểm phù hợp từng pin</p>
            </div>
          </div>

          {/* Capacity Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-700">Dung lượng cần thiết</label>
              <span className="text-base font-black text-amber-600 font-mono">{reqCapacity} kWh</span>
            </div>
            <input
              type="range" min="5" max="150" step="5"
              value={reqCapacity}
              onChange={(e) => setReqCapacity(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 rounded-lg cursor-pointer bg-slate-200"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1.5">
              <span>5 kWh</span><span>150 kWh</span>
            </div>
          </div>

          {/* Voltage Select */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Điện áp hệ thống</label>
            <div className="relative">
              <select
                value={reqVoltage}
                onChange={(e) => setReqVoltage(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer"
              >
                {VOLTAGE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Budget Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-700">Ngân sách tối đa</label>
              <span className="text-base font-black text-amber-600 font-mono">{(reqBudget / 1_000_000).toFixed(0)}M ₫</span>
            </div>
            <input
              type="range" min="5000000" max="150000000" step="5000000"
              value={reqBudget}
              onChange={(e) => setReqBudget(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 rounded-lg cursor-pointer bg-slate-200"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-1.5">
              <span>5M</span><span>150M ₫</span>
            </div>
          </div>

          {/* Chemistry Filter */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Ưu tiên hóa học pin</label>
            <div className="grid grid-cols-4 gap-2">
              {(['ALL', 'LFP', 'NMC', 'NCA'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setChemistry(c)}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    chemistry === c
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleMatch}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Cpu className="w-5 h-5 stroke-[2.5]" /> TÍNH SMART MATCHING
          </button>
        </div>

        {/* ── RIGHT: Results Panel ── */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              {ran ? `${results.length} kết quả phù hợp` : 'Chờ tính toán...'}
            </h3>
            {ran && results.length > 0 && (
              <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1 rounded-full border border-slate-200">sắp xếp theo Độ phù hợp giảm dần</span>
            )}
          </div>

          {!ran && (
            <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center shadow-sm">
              <Target className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 font-medium">Nhập thông số yêu cầu và nhấn "Tính Smart Matching"</p>
              <p className="text-slate-400 text-xs mt-2">Giá BESS ước tính = Giá pin + 15.000.000 ₫ (chi phí lắp đặt SI)</p>
            </div>
          )}

          {ran && results.length === 0 && (
            <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center shadow-sm">
              <Zap className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 font-medium">Không tìm thấy pin phù hợp với tiêu chí.</p>
              <p className="text-slate-400 text-xs mt-2">Thử tăng ngân sách hoặc thay đổi hóa học pin.</p>
            </div>
          )}

          {ran && results.map((r, idx) => {
            const pack = r.listing.batteryPack;
            const scoreColor = getScoreColor(r.matchScorePercent);
            const barClass = getScoreBarClass(r.matchScorePercent);

            return (
              <div key={r.listing.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Rank badge + name */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">#{idx + 1}</span>
                      <span className="text-base font-bold text-slate-900">{pack.vehicleModel}</span>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border ${
                        pack.chemistry === 'NMC' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        {pack.chemistry}
                      </span>
                    </div>

                    {/* Score bar */}
                    <div className="flex items-center gap-3 mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${r.matchScorePercent}%` }} />
                      </div>
                      <span className={`text-base font-black font-mono ${scoreColor}`}>
                        {r.matchScorePercent.toFixed(1)}%
                      </span>
                    </div>

                    {/* Details */}
                    <p className="text-xs text-slate-500 font-medium">{r.matchReason}</p>
                  </div>

                  {/* Price + CTA */}
                  <div className="text-right shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Giá pin</p>
                    <p className="text-base font-black text-slate-900 font-mono">
                      {(r.listing.askingPriceVnd / 1_000_000).toFixed(1)}M ₫
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-2">Ước tính cả BESS</p>
                    <p className="text-sm font-bold text-cyan-700 font-mono">
                      {(r.estimatedBessPriceVnd / 1_000_000).toFixed(1)}M ₫
                    </p>
                    <button
                      onClick={() => navigate(ROUTES.ESCROW)}
                      className="mt-3 w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      Mua Escrow <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
