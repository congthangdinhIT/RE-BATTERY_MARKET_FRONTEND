import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Layers, Package, Cpu, CheckCircle2, Clock, XCircle, Scissors, Search, Filter, ChevronLeft, ChevronRight, X, AlertTriangle, Loader2, QrCode } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { batteryPackService } from '../services/batteryPackService';
import { QrCodeModal } from '../components/QrCodeModal';
import type { BatteryPack, BatteryStatus, BatteryFormFactor, BatteryChemistryType, InspectionType } from '../types';

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

export const BatteryPacksPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole } = useOutletContext<{ currentRole: string }>();
  const canManagePacks = ['SUPPLIER', 'Admin', 'MANAGER_STAFF'].includes(currentRole);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [fetchedPacks, setFetchedPacks] = useState<BatteryPack[]>([]);
  const [loading, setLoading] = useState(true);

  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    serial: string;
    model: string;
    soh: number;
    capacity: number;
  }>({
    isOpen: false,
    serial: '',
    model: '',
    soh: 0,
    capacity: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const loadPacks = async () => {
      setLoading(true);
      const data = await batteryPackService.getBatteryPacks();
      if (isMounted) {
        setFetchedPacks(data);
        setLoading(false);
      }
    };
    loadPacks();
    return () => { isMounted = false; };
  }, []);

  // ── Create New Pack State ──────────────────────────────────────────────────
  const [createdPacks, setCreatedPacks] = useState<BatteryPack[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    serialNumber: '',
    originalVin: '',
    manufacturer: 'VinFast Energy',
    vehicleModel: 'VinFast VF8',
    chemistry: 'LFP' as BatteryChemistryType,
    originalCapacityKwh: 87.7,
    currentSohPercent: 88,
    nominalVoltageV: 400,
    totalCycles: 450,
    formFactor: 'PACK' as BatteryFormFactor,
    inspectionType: 'BATCH_A' as InspectionType,
    logisticsClass: 'CLASS_9_UN3480' as 'CLASS_9_UN3480' | 'CLASS_9_UN3481',
  });

  const handleOpenAddModal = () => {
    const randomSerial = `BAT-2026-VF${Math.floor(100 + Math.random() * 900)}`;
    const randomVin = `VF8-VN-2024-${Math.floor(10000 + Math.random() * 90000)}`;
    setAddFormData({
      serialNumber: randomSerial,
      originalVin: randomVin,
      manufacturer: 'VinFast Energy',
      vehicleModel: 'VinFast VF8',
      chemistry: 'LFP',
      originalCapacityKwh: 87.7,
      currentSohPercent: 88,
      nominalVoltageV: 400,
      totalCycles: 450,
      formFactor: 'PACK',
      inspectionType: 'BATCH_A',
      logisticsClass: 'CLASS_9_UN3480',
    });
    setIsAddModalOpen(true);
  };

  const handleCreatePackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const origCap = Number(addFormData.originalCapacityKwh) || 80;
    const soh = Number(addFormData.currentSohPercent) || 85;
    const currCap = +(origCap * (soh / 100)).toFixed(2);

    const newPack: BatteryPack = {
      id: `PACK-NEW-${Date.now()}`,
      serialNumber: addFormData.serialNumber.trim() || `BAT-NEW-${Date.now()}`,
      originalVin: addFormData.originalVin.trim() || 'VIN-UNSET',
      manufacturer: addFormData.manufacturer.trim() || 'Hãng xe',
      vehicleModel: addFormData.vehicleModel.trim() || 'EV Model',
      chemistry: addFormData.chemistry,
      originalCapacityKwh: origCap,
      currentSohPercent: soh,
      currentCapacityKwh: currCap,
      nominalVoltageV: Number(addFormData.nominalVoltageV) || 400,
      totalCycles: Number(addFormData.totalCycles) || 300,
      formFactor: addFormData.formFactor,
      parentPackId: null,
      status: addFormData.inspectionType === 'BATCH_A' ? 'TESTING_PENDING' : 'COLLECTED',
      inspectionType: addFormData.inspectionType,
      passportExpiresAt: null,
      logisticsClass: addFormData.logisticsClass,
      currentOrganizationId: 'ORG-SUP-01',
      currentOrganizationName: 'VinFast Energy Supply',
      createdAt: new Date().toISOString(),
    };

    setCreatedPacks(prev => [newPack, ...prev]);
    setIsAddModalOpen(false);
  };

  // ── Split state ─────────────────────────────────────────────────────────────
  // Override status for split packs (session-only, mirrors SplitBatteryPackCommand)
  const [splitPackIds, setSplitPackIds] = useState<Set<string>>(new Set());
  // Virtual modules created from split
  const [virtualModules, setVirtualModules] = useState<BatteryPack[]>([]);
  // Modal state
  const [splitModal, setSplitModal] = useState<{ pack: BatteryPack; moduleCount: number } | null>(null);
  const [splitting, setSplitting] = useState(false);

  const handleOpenSplit = (pack: BatteryPack) => {
    setSplitModal({ pack, moduleCount: 4 });
  };

  const handleConfirmSplit = () => {
    if (!splitModal) return;
    setSplitting(true);
    // Simulate async split operation
    setTimeout(() => {
      const { pack, moduleCount } = splitModal;
      // Mark parent as SPLIT
      setSplitPackIds(prev => new Set([...prev, pack.id]));
      // Generate virtual MODULE children
      const capPerModule = +(pack.currentCapacityKwh / moduleCount).toFixed(2);
      const modules: BatteryPack[] = Array.from({ length: moduleCount }, (_, i) => ({
        ...pack,
        id:             `${pack.id}-MOD-${i + 1}`,
        serialNumber:   `${pack.serialNumber}-M${i + 1}`,
        formFactor:     'MODULE' as BatteryFormFactor,
        status:         'VERIFIED' as BatteryStatus,
        parentPackId:   pack.id,
        currentCapacityKwh: capPerModule,
        originalCapacityKwh: capPerModule,
        inspectionType: pack.inspectionType,
        passportExpiresAt: pack.passportExpiresAt,
        logisticsClass: pack.logisticsClass,
      }));
      setVirtualModules(prev => [...prev, ...modules]);
      setSplitting(false);
      setSplitModal(null);
    }, 800);
  };

  // Merge created packs & virtual modules into displayed packs
  const allPacks = useMemo(() => {
    return [
      ...createdPacks,
      ...fetchedPacks.map(p =>
        splitPackIds.has(p.id) ? { ...p, status: 'SPLIT' as BatteryStatus } : p
      ),
      ...virtualModules,
    ];
  }, [createdPacks, fetchedPacks, splitPackIds, virtualModules]);

  // Filtered packs
  const filteredPacks = useMemo(() => {
    return allPacks.filter((pack) => {
      const matchSearch =
        pack.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.originalVin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.chemistry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pack.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || pack.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [allPacks, searchTerm, statusFilter]);

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

      {/* ── Modal Đăng Ký Lô Pin Mới ────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Đăng Ký Lô Pin EV Mới (Supplier)</h3>
                  <p className="text-xs text-slate-500">Khai báo thông tin kĩ thuật & lựa chọn luồng kiểm định Asset-Light</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePackSubmit} className="p-6 space-y-4 text-xs">

              {/* Grid 2 cột */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã Serial Lô Pin *</label>
                  <input
                    type="text"
                    required
                    value={addFormData.serialNumber}
                    onChange={(e) => setAddFormData({ ...addFormData, serialNumber: e.target.value })}
                    placeholder="Vd: BAT-2026-VF801"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số VIN Xe Tháo Dỡ *</label>
                  <input
                    type="text"
                    required
                    value={addFormData.originalVin}
                    onChange={(e) => setAddFormData({ ...addFormData, originalVin: e.target.value })}
                    placeholder="Vd: VF8-VN-2024-99881"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hãng Sản Xuất *</label>
                  <input
                    type="text"
                    required
                    value={addFormData.manufacturer}
                    onChange={(e) => setAddFormData({ ...addFormData, manufacturer: e.target.value })}
                    placeholder="Vd: VinFast Energy, CATL..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mẫu Xe Nguyên Bản *</label>
                  <input
                    type="text"
                    required
                    value={addFormData.vehicleModel}
                    onChange={(e) => setAddFormData({ ...addFormData, vehicleModel: e.target.value })}
                    placeholder="Vd: VinFast VF8, VF9, Tesla Model Y..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hóa Học Cell Pin (Chemistry)</label>
                  <select
                    value={addFormData.chemistry}
                    onChange={(e) => setAddFormData({ ...addFormData, chemistry: e.target.value as BatteryChemistryType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="LFP">LFP (Lithium Iron Phosphate - An toàn cao)</option>
                    <option value="NMC">NMC (Nickel Manganese Cobalt - Mật độ cao)</option>
                    <option value="NCA">NCA (Nickel Cobalt Aluminum)</option>
                    <option value="LTO">LTO (Lithium Titanate Oxide)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hình Thức (Form Factor)</label>
                  <select
                    value={addFormData.formFactor}
                    onChange={(e) => setAddFormData({ ...addFormData, formFactor: e.target.value as BatteryFormFactor })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="PACK">PACK (Bộ khối hoàn chỉnh)</option>
                    <option value="MODULE">MODULE (Khối module đơn)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dung Lượng Thiết Kế (kWh) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    value={addFormData.originalCapacityKwh}
                    onChange={(e) => setAddFormData({ ...addFormData, originalCapacityKwh: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SOH Khai Báo Ban Đầu (%)</label>
                  <input
                    type="number"
                    min="30"
                    max="100"
                    required
                    value={addFormData.currentSohPercent}
                    onChange={(e) => setAddFormData({ ...addFormData, currentSohPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Điện Áp Danh Định (V)</label>
                  <input
                    type="number"
                    required
                    value={addFormData.nominalVoltageV}
                    onChange={(e) => setAddFormData({ ...addFormData, nominalVoltageV: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Chu Kỳ Sạc (Total Cycles)</label>
                  <input
                    type="number"
                    required
                    value={addFormData.totalCycles}
                    onChange={(e) => setAddFormData({ ...addFormData, totalCycles: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Mô hình Asset-Light selection */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-2 mt-3">
                <label className="block font-black text-amber-900 text-xs">Mô hình Kiểm Định Asset-Light (BR-001):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                    addFormData.inspectionType === 'BATCH_A'
                      ? 'bg-white border-amber-400 ring-2 ring-amber-500/20 shadow-sm'
                      : 'bg-amber-100/50 border-amber-200 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="inspectionType"
                      checked={addFormData.inspectionType === 'BATCH_A'}
                      onChange={() => setAddFormData({ ...addFormData, inspectionType: 'BATCH_A' })}
                      className="mt-0.5 accent-amber-600"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Lô A (Pin theo Lô lớn)</div>
                      <div className="text-[11px] text-slate-500 leading-tight">Kiểm định ngay khi thu hồi, tối ưu 20–30% chi phí. Trạng thái: <strong>TESTING_PENDING</strong></div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                    addFormData.inspectionType === 'SINGLE_B'
                      ? 'bg-white border-amber-400 ring-2 ring-amber-500/20 shadow-sm'
                      : 'bg-amber-100/50 border-amber-200 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="inspectionType"
                      checked={addFormData.inspectionType === 'SINGLE_B'}
                      onChange={() => setAddFormData({ ...addFormData, inspectionType: 'SINGLE_B' })}
                      className="mt-0.5 accent-amber-600"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Gom Đơn B (Pin Nhỏ Lẻ)</div>
                      <div className="text-[11px] text-slate-500 leading-tight">Chi phí kiểm định 0đ trả trước. Gom đơn sau giao dịch. Trạng thái: <strong>COLLECTED</strong></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Phân loại Logistics UN */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phân loại Vận Chuyển Hàng Nguy Hiểm (Logistics UN Class)</label>
                <select
                  value={addFormData.logisticsClass}
                  onChange={(e) => setAddFormData({ ...addFormData, logisticsClass: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
                >
                  <option value="CLASS_9_UN3480">CLASS_9_UN3480 (Pin Lithium-ion độc lập)</option>
                  <option value="CLASS_9_UN3481">CLASS_9_UN3481 (Pin Lithium-ion đóng gói cùng thiết bị)</option>
                </select>
              </div>

              {/* Modal footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Xác Nhận Đăng Ký Lô Pin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Split Confirmation Modal ────────────────────────────────────── */}
      {splitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Tách PACK thành MODULE</p>
                  <p className="text-[11px] text-slate-500 font-mono">{splitModal.pack.serialNumber}</p>
                </div>
              </div>
              <button onClick={() => setSplitModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>BR-002:</strong> Sau khi tách, PACK gốc chuyển sang trạng thái <span className="font-mono bg-white px-1 rounded border border-pink-200 text-pink-700">SPLIT</span> và không thể khôi phục. Mỗi MODULE sẽ được cấp hồ sơ riêng.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] mb-1">Dung lượng gốc</p>
                  <p className="font-mono font-black text-slate-900">{splitModal.pack.currentCapacityKwh} kWh</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] mb-1">Điện áp gốc</p>
                  <p className="font-mono font-black text-slate-900">{splitModal.pack.nominalVoltageV} V</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Số lượng MODULE cần tách</label>
                <div className="flex gap-2">
                  {[2, 4, 6, 8].map(n => (
                    <button
                      key={n}
                      onClick={() => setSplitModal(m => m ? { ...m, moduleCount: n } : null)}
                      className={`flex-1 py-2.5 rounded-xl border font-mono font-black text-sm transition ${
                        splitModal.moduleCount === n
                          ? 'bg-pink-500 text-white border-pink-400 shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Mỗi module ≈ <span className="font-mono font-bold text-slate-800">{(splitModal.pack.currentCapacityKwh / splitModal.moduleCount).toFixed(2)} kWh</span>
                  &nbsp;·&nbsp;{splitModal.pack.nominalVoltageV}V&nbsp;·&nbsp;{splitModal.pack.chemistry}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setSplitModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSplit}
                disabled={splitting}
                className="flex-1 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {splitting ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Đang tách...</>
                ) : (
                  <><Scissors className="w-4 h-4" />Xác nhận tách {splitModal.moduleCount} Module</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Quản Lý Danh Mục Pin Xe Điện</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đăng ký, kiểm định SOH và cấp Battery Passport — Luồng:&nbsp;
            <span className="font-mono text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">COLLECTED → TESTING_PENDING → VERIFIED → LISTED</span>
          </p>
        </div>
        {canManagePacks && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition w-full sm:w-auto justify-center sm:justify-start"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" /> Đăng Ký Lô Pin Mới
          </button>
        )}
      </div>

      {/* Business Rule Banner — Asset-Light Model */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-800 shadow-sm">
        <Layers className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-blue-900">Mô hình Asset-Light:</strong>&nbsp;
          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-800 font-bold">Lô A</span> — Pin theo lô lớn (fleet, hãng xe): Kiểm định ngay khi thu hồi, giảm 20–30% chi phí.&nbsp;
          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-purple-200 text-purple-800 font-bold">Gom đơn B</span> — Pin nhỏ lẻ (gara): Chi phí kiểm định 0đ trả trước, gom đơn sau khi có giao dịch.&nbsp;
          <strong className="text-blue-900">BR-008:</strong> SOH &lt; 70% → khuyến nghị tái chế. <strong>Passport</strong> hạn hiệu lực 60–90 ngày.
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

      {loading && (
        <div className="py-8 flex items-center justify-center gap-2 text-slate-500 text-sm font-semibold">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span>Đang tải danh mục pin từ API Backend...</span>
        </div>
      )}

      {/* Pagination — shared for both views */}

      {/* ── Danh sách PIN ── */}
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {paginatedPacks.length > 0 ? (
          paginatedPacks.map((pack) => {
            const statusCfg = STATUS_CONFIG[pack.status];
            const StatusIcon = statusCfg.icon;
            return (
              <div key={pack.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-900">{pack.serialNumber}</span>
                      {pack.parentPackId && (
                        <span className="text-[9px] font-mono text-pink-700 border border-pink-200 bg-pink-50 px-1 py-0.5 rounded">↳ MOD</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{pack.vehicleModel} — {pack.manufacturer}</div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-bold text-[10px] shrink-0 ${statusCfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusCfg.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase mb-0.5">SOH</div>
                    <div className={`font-mono font-black text-sm ${
                      pack.currentSohPercent >= 85 ? 'text-emerald-600' :
                      pack.currentSohPercent >= 70 ? 'text-amber-600' : 'text-red-600'
                    }`}>{pack.currentSohPercent}%</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase mb-0.5">Dung lượng</div>
                    <div className="font-mono font-bold text-xs text-slate-800">{pack.currentCapacityKwh.toFixed(1)} kWh</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase mb-0.5">Hóa học</div>
                    <div className={`font-mono font-bold text-xs ${
                      pack.chemistry === 'NMC' ? 'text-blue-700' :
                      pack.chemistry === 'NCA' ? 'text-purple-700' : 'text-emerald-700'
                    }`}>{pack.chemistry}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {pack.inspectionType === 'BATCH_A' && (
                      <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded border text-amber-800 bg-amber-50 border-amber-300">🏭 Lô A</span>
                    )}
                    {pack.inspectionType === 'SINGLE_B' && (
                      <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded border text-purple-800 bg-purple-50 border-purple-300">🔄 Gom B</span>
                    )}
                    <span className="font-mono text-[10px] text-slate-600">{pack.nominalVoltageV}V</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQrModal({
                        isOpen: true,
                        serial: pack.serialNumber,
                        model: `${pack.manufacturer} ${pack.vehicleModel}`,
                        soh: pack.currentSohPercent,
                        capacity: pack.currentCapacityKwh,
                      })}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-900 bg-amber-400 font-extrabold px-2 py-0.5 rounded shadow-xs hover:bg-amber-500 cursor-pointer"
                    >
                      <QrCode className="w-3 h-3 text-slate-950" /> QR Pin
                    </button>
                    <button
                      onClick={() => navigate(ROUTES.PASSPORTS)}
                      className="text-[11px] text-amber-700 font-bold hover:underline"
                    >
                      Passport
                    </button>
                    {canManagePacks && pack.formFactor === 'PACK' && pack.status !== 'SPLIT' && (
                      <button
                        onClick={() => handleOpenSplit(pack)}
                        className="text-[11px] text-pink-600 font-bold hover:underline"
                      >
                        Tách
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-slate-400 bg-white border border-slate-200 border-dashed rounded-2xl">
            <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            Không tìm thấy lô pin nào phù hợp.
          </div>
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">

        {/* Column header */}
        <div className="grid grid-cols-[1fr_auto] items-center px-4 py-2.5 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Serial / Mẫu xe</span>
            <span>Hóa học</span>
            <span>Kiểm định</span>
            <span>SOH%</span>
            <span>Dung lượng</span>
            <span>Điện áp</span>
            <span>Logistics</span>
            <span>Hạn Passport</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 w-36 text-right">Trạng thái / Thao tác</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {paginatedPacks.length > 0 ? (
            paginatedPacks.map((pack) => {
              const statusCfg = STATUS_CONFIG[pack.status];
              const StatusIcon = statusCfg.icon;

              const passportBadge = (() => {
                if (!pack.passportExpiresAt) return <span className="text-[10px] text-slate-400 font-mono">Chưa cấp</span>;
                const expiresDate = new Date(pack.passportExpiresAt);
                const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / 86400000);
                const isExpired = daysLeft <= 0;
                const isSoon = daysLeft <= 14 && daysLeft > 0;
                return (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    isExpired ? 'text-red-700 bg-red-50 border-red-200' :
                    isSoon    ? 'text-yellow-700 bg-yellow-50 border-yellow-200' :
                                'text-emerald-700 bg-emerald-50 border-emerald-200'
                  }`}>
                    {isExpired ? '⚠ Hết hạn' : isSoon ? `⚡ ${daysLeft}d` : expiresDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </span>
                );
              })();

              return (
                <div key={pack.id} className="grid grid-cols-[1fr_auto] items-center px-4 py-3 hover:bg-slate-50 transition-colors gap-3">
                  {/* Left: all technical fields */}
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 items-center min-w-0">

                    {/* Col 1: Serial + Model */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-[11px] text-slate-900 truncate">{pack.serialNumber}</span>
                        {pack.parentPackId && (
                          <span className="text-[9px] font-mono text-pink-700 border border-pink-200 bg-pink-50 px-1 py-0.5 rounded shrink-0">↳ MOD</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{pack.vehicleModel}</div>
                    </div>

                    {/* Col 2: Chemistry */}
                    <div>
                      <span className={`font-mono font-bold text-[10px] px-2 py-1 rounded border ${
                        pack.chemistry === 'NMC' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                        pack.chemistry === 'NCA' ? 'text-purple-700 bg-purple-50 border-purple-200' :
                        'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        {pack.chemistry}
                      </span>
                    </div>

                    {/* Col 3: Inspection A/B */}
                    <div>
                      {pack.inspectionType === 'BATCH_A' ? (
                        <span className="font-mono font-bold text-[10px] px-1.5 py-1 rounded border text-amber-800 bg-amber-50 border-amber-300 block text-center">Lô A</span>
                      ) : pack.inspectionType === 'SINGLE_B' ? (
                        <span className="font-mono font-bold text-[10px] px-1.5 py-1 rounded border text-purple-800 bg-purple-50 border-purple-300 block text-center">Gom B</span>
                      ) : (
                        <span className="text-slate-300 font-mono text-[10px]">—</span>
                      )}
                    </div>

                    {/* Col 4: SOH */}
                    <div>
                      <span className={`font-mono font-black text-sm ${
                        pack.currentSohPercent >= 85 ? 'text-emerald-600' :
                        pack.currentSohPercent >= 70 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {pack.currentSohPercent}%
                      </span>
                    </div>

                    {/* Col 5: Capacity */}
                    <div className="min-w-0">
                      <div className="font-mono font-bold text-[11px] text-slate-800">{pack.currentCapacityKwh.toFixed(1)} kWh</div>
                      <div className="text-[9px] text-slate-400 font-mono">/{pack.originalCapacityKwh}</div>
                    </div>

                    {/* Col 6: Voltage */}
                    <div>
                      <span className="font-mono text-[11px] font-semibold text-slate-700">{pack.nominalVoltageV}V</span>
                    </div>

                    {/* Col 7: Logistics */}
                    <div>
                      {pack.logisticsClass ? (
                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          pack.logisticsClass === 'CLASS_9_UN3480' ? 'text-orange-700 bg-orange-50 border-orange-200' : 'text-red-700 bg-red-50 border-red-200'
                        }`}>
                          {pack.logisticsClass === 'CLASS_9_UN3480' ? '3480' : '3481'}
                        </span>
                      ) : <span className="text-slate-300 text-[10px]">—</span>}
                    </div>

                    {/* Col 8: Passport Expiry */}
                    <div>{passportBadge}</div>
                  </div>

                  {/* Right: Status + Actions */}
                  <div className="flex flex-col items-end gap-1.5 w-36 shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-bold text-[10px] ${statusCfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusCfg.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQrModal({
                          isOpen: true,
                          serial: pack.serialNumber,
                          model: `${pack.manufacturer} ${pack.vehicleModel}`,
                          soh: pack.currentSohPercent,
                          capacity: pack.currentCapacityKwh,
                        })}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-900 bg-amber-400 font-extrabold px-2 py-0.5 rounded shadow-xs hover:bg-amber-500 cursor-pointer"
                      >
                        <QrCode className="w-3 h-3 text-slate-950" /> QR
                      </button>
                      <button
                        onClick={() => navigate(ROUTES.PASSPORTS)}
                        className="text-[11px] text-amber-700 font-bold hover:text-amber-800 hover:underline"
                      >
                        Passport
                      </button>
                      {canManagePacks && pack.formFactor === 'PACK' && pack.status !== 'SPLIT' && (
                        <button
                          onClick={() => handleOpenSplit(pack)}
                          className="text-[11px] text-pink-600 font-bold hover:text-pink-700 hover:underline"
                        >
                          Tách
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Không tìm thấy lô pin nào phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>
      </div>

      {/* Shared Pagination Bar — works for both mobile & desktop */}
      {totalItems > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium flex-wrap">
            <span>Hiển thị <strong className="text-slate-900">{startIndex + 1}</strong>–<strong className="text-slate-900">{endIndex}</strong> trong tổng số <strong className="text-slate-900">{totalItems}</strong> lô pin</span>
            <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
              <span className="text-slate-500">Số lượng/trang:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safeCurrentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-[11px] pt-2">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <span key={status} className={`flex items-center gap-1 px-2.5 py-1 rounded-full border font-mono font-semibold ${cfg.color}`}>
            {status}
          </span>
        ))}
      </div>

      {/* QR Code Modal hiển thị mã QR cho pin riêng lẻ */}
      <QrCodeModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal(prev => ({ ...prev, isOpen: false }))}
        title="Mã QR Khối Pin Kỹ Thuật Số"
        subtitle="Quét mã QR để truy xuất trực tiếp nguồn gốc & thông số SOH"
        serialNumber={qrModal.serial}
        modelName={qrModal.model}
        sohPercent={qrModal.soh}
        capacityKwh={qrModal.capacity}
        actionType="VIEW_ONLY"
      />
    </div>
  );
};


