import React, { useState, useMemo } from 'react';
import { Plus, Layers, Package, Cpu, CheckCircle2, Clock, XCircle, Scissors, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { MOCK_BATTERY_PACKS } from '../data/mockData';
import type { BatteryStatus, BatteryFormFactor } from '../types';

const STATUS_CONFIG: Record<BatteryStatus, { label: string; color: string; icon: React.ElementType }> = {
  COLLECTED:        { label: 'Đã thu hồi',     color: 'text-slate-700 bg-slate-100 border-slate-300',   icon: Package },
  TESTING_PENDING:  { label: 'Chờ kiểm định',  color: 'text-yellow-700 bg-yellow-50 border-yellow-200', icon: Clock },
  VERIFIED:         { label: 'Đã xác thực',    color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  REJECTED:         { label: 'Loại — Tái chế', color: 'text-red-700 bg-red-50 border-red-200',          icon: XCircle },
  LISTED:           { label: 'Đang niêm yết',  color: 'text-cyan-700 bg-cyan-50 border-cyan-200',       icon: CheckCircle2 },
  ESCROW_LOCKED:    { label: 'Escrow Locked',  color: 'text-purple-700 bg-purple-50 border-purple-200', icon: CheckCircle2 },
  IN_REPACK:        { label: 'Đang Repack',    color: 'text-orange-700 bg-orange-50 border-orange-200', icon: Package },
  IN_INSTALLATION:  { label: 'Đang lắp đặt',  color: 'text-blue-700 bg-blue-50 border-blue-200',       icon: Cpu },
  COMPLETED:        { label: 'Hoàn thành',     color: 'text-teal-700 bg-teal-50 border-teal-200',       icon: CheckCircle2 },
  RECYCLED:         { label: 'Đã tái chế',     color: 'text-slate-600 bg-slate-200 border-slate-300',    icon: XCircle },
  SPLIT:            { label: 'Đã tách Module', color: 'text-pink-700 bg-pink-50 border-pink-200',       icon: Scissors },
};

const FORM_FACTOR_LABEL: Record<BatteryFormFactor, string> = {
  PACK: 'PACK',
  MODULE: 'MODULE',
  CELL: 'CELL',
};

export const BatteryPacksPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole } = useOutletContext<{ currentRole: string }>();
  const canManagePacks = ['SUPPLIER', 'Admin', 'MANAGER_STAFF'].includes(currentRole);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Filtered packs
  const filteredPacks = useMemo(() => {
    return MOCK_BATTERY_PACKS.filter((pack) => {
      const matchSearch =
        pack.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.originalVin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.chemistry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || pack.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  // Pagination calculation
  const totalItems = filteredPacks.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedPacks = filteredPacks.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quản Lý Danh Mục Pin Xe Điện</h2>
          <p className="text-sm text-slate-500 mt-1">
            Đăng ký, kiểm định SOH và cấp Battery Passport — Luồng:&nbsp;
            <span className="font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">COLLECTED → TESTING_PENDING → VERIFIED → LISTED</span>
          </p>
        </div>
        {canManagePacks && (
          <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition">
            <Plus className="w-5 h-5 stroke-[2.5]" /> Đăng Ký Lô Pin Mới
          </button>
        )}
      </div>

      {/* Business Rule Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-800 shadow-sm">
        <Layers className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-blue-900">BR-002:</strong> Chỉ <span className="font-mono bg-white px-1 py-0.5 rounded border border-blue-100">PACK</span> mới có thể tách thành <span className="font-mono text-pink-700 bg-white px-1 py-0.5 rounded border border-pink-100">MODULE</span> (SplitBatteryPackCommand).&nbsp;
          <strong className="text-blue-900 ml-2">BR-008:</strong> SOH &lt; 70% → khuyến nghị tái chế trực tiếp.&nbsp;
          <strong className="text-blue-900 ml-2">Capacity</strong> = OriginalCapacity × (SOH / 100).
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Tìm theo Serial, VIN, Mẫu xe..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-semibold">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-4">Số Serial</th>
                <th className="p-4">Mẫu Xe / VIN</th>
                <th className="p-4">Hóa Học</th>
                <th className="p-4">Form Factor</th>
                <th className="p-4">SOH%</th>
                <th className="p-4">Dung Lượng Thực</th>
                <th className="p-4">Điện Áp</th>
                <th className="p-4">Chu Kỳ</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedPacks.length > 0 ? (
                paginatedPacks.map((pack) => {
                  const statusCfg = STATUS_CONFIG[pack.status];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <tr key={pack.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {pack.serialNumber}
                        {pack.parentPackId && (
                          <div className="mt-1">
                            <span className="text-[10px] font-mono text-pink-700 border border-pink-200 bg-pink-50 px-1.5 py-0.5 rounded font-semibold">
                              ↳ MODULE
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-900">{pack.vehicleModel}</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{pack.originalVin}</p>
                      </td>
                      <td className="p-4">
                        <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-md border ${
                          pack.chemistry === 'NMC' ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        }`}>
                          {pack.chemistry}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-mono text-xs px-2.5 py-1 rounded-md border font-semibold ${
                          pack.formFactor === 'PACK' ? 'text-slate-700 bg-slate-100 border-slate-300' : 'text-pink-700 border-pink-200 bg-pink-50'
                        }`}>
                          {FORM_FACTOR_LABEL[pack.formFactor]}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-mono font-black text-sm ${
                          pack.currentSohPercent >= 85 ? 'text-emerald-600' :
                          pack.currentSohPercent >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {pack.currentSohPercent}%
                        </span>
                      </td>
                      <td className="p-4 font-mono">
                        <span className="font-bold text-slate-800">{pack.currentCapacityKwh.toFixed(2)} kWh</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">gốc: {pack.originalCapacityKwh} kWh</p>
                      </td>
                      <td className="p-4 font-mono font-semibold text-slate-700">{pack.nominalVoltageV} V</td>
                      <td className="p-4 font-mono font-semibold text-slate-500">{pack.totalCycles.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold text-[11px] shadow-sm ${statusCfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => navigate(ROUTES.PASSPORTS)}
                          className="text-sm text-amber-700 font-bold hover:text-amber-800 hover:underline mr-4"
                        >
                          Passport
                        </button>
                        {canManagePacks && pack.formFactor === 'PACK' && pack.status !== 'SPLIT' && (
                          <button className="text-sm text-pink-600 font-bold hover:text-pink-700 hover:underline">
                            Tách Module
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Không tìm thấy lô pin nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalItems > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
              <span>Hiển thị <strong className="text-slate-900">{startIndex + 1}</strong>–<strong className="text-slate-900">{endIndex}</strong> trong tổng số <strong className="text-slate-900">{totalItems}</strong> lô pin</span>
              <div className="flex items-center gap-1.5 ml-2 border-l border-slate-300 pl-3">
                <span className="text-slate-500">Số lượng/trang:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition ${
                    safeCurrentPage === page
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-[11px] pt-2">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <span key={status} className={`flex items-center gap-1 px-2.5 py-1 rounded-full border font-mono font-semibold ${cfg.color}`}>
            {status}
          </span>
        ))}
      </div>
    </div>
  );
};

