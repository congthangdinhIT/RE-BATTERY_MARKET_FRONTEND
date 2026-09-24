import React, { useState, useEffect } from 'react';
import { ArrowUpDown, ShieldCheck, ChevronDown, Search, ArrowRight, ChevronLeft, ChevronRight, QrCode } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { StorageManager } from '../lib/storage';
import { QrCodeModal } from '../components/QrCodeModal';
import type { Listing, BatteryPack, Organization } from '../types';

export const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search')?.toLowerCase() || '';

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [listings, setListings] = useState<Listing[]>(() => StorageManager.getListings());
  const [packs, setPacks] = useState<BatteryPack[]>(() => StorageManager.getBatteryPacks());
  const [orgs, setOrgs] = useState<Organization[]>(() => StorageManager.getOrgs());

  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    serial: string;
    passportCode?: string;
    model: string;
    soh: number;
    capacity: number;
  }>({
    isOpen: false,
    serial: '',
    passportCode: '',
    model: '',
    soh: 0,
    capacity: 0,
  });

  useEffect(() => {
    setListings(StorageManager.getListings());
    setPacks(StorageManager.getBatteryPacks());
    setOrgs(StorageManager.getOrgs());
  }, []);

  const filteredListings = listings.filter(listing => {
    if (!query) return true;
    const pack = packs.find(p => p.id === listing.batteryPackId);
    return (
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      pack?.vehicleModel.toLowerCase().includes(query) ||
      pack?.chemistry.toLowerCase().includes(query) ||
      pack?.serialNumber.toLowerCase().includes(query) ||
      pack?.manufacturer.toLowerCase().includes(query)
    );
  });


  useEffect(() => {
    setCurrentPage(1);
  }, [query, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedListings = filteredListings.slice(startIndex, startIndex + pageSize);

  return (
    <div className="font-sans pb-16 fade-in-up">
      {/* ── HEADER KHU VỰC TÌM KIẾM THEO PHONG CÁCH REBATTERY ── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-5">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-2">
            Danh Mục Chợ Giao Dịch
          </div>
          <h1 className="text-[26px] sm:text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-slate-900 max-w-[24ch] mb-2">
            Mạng lưới giao dịch pin Second-life
          </h1>
          <p className="text-[13px] sm:text-[15px] md:text-[16px] leading-[1.55] text-slate-600 max-w-[60ch] mb-5">
            So sánh công suất, tình trạng sức khỏe (SOH), khả năng tương thích BESS và chứng chỉ Passport. Liên hệ trực tiếp đối tác uy tín với nguồn pin đã được xác thực an toàn.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-[5px] overflow-hidden max-w-[1100px]">
            <div className="bg-white px-3 sm:px-[18px] py-3">
              <div className="font-mono text-[20px] sm:text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-900">{listings.length}</div>
              <div className="mt-[5px] font-mono text-[9px] sm:text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate-400">Lô pin đang niêm yết</div>
            </div>
            <div className="bg-white px-3 sm:px-[18px] py-3">
              <div className="font-mono text-[20px] sm:text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-amber-600">≥60%</div>
              <div className="mt-[5px] font-mono text-[9px] sm:text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate-400">Tỷ Lệ Kiểm Định Lô A</div>
            </div>
            <div className="bg-white px-3 sm:px-[18px] py-3">
              <div className="font-mono text-[20px] sm:text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-900">86.8%</div>
              <div className="mt-[5px] font-mono text-[9px] sm:text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate-400">SOH Trung bình</div>
            </div>
            <div className="bg-white px-3 sm:px-[18px] py-3">
              <div className="font-mono text-[20px] sm:text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] text-slate-900">100%</div>
              <div className="mt-[5px] font-mono text-[9px] sm:text-[9.5px] font-medium uppercase tracking-[0.12em] text-slate-400">SHA-256 Passport Xác Thực</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARD DANH SÁCH ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Sắp xếp theo:</span>
            <button className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-0">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span>Mới nhất</span>
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>
          </div>

          {query && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-slate-600 font-medium">Kết quả tìm kiếm cho: <strong className="text-amber-900 font-bold">"{query}"</strong> ({filteredListings.length} lô pin)</span>
              <button
                onClick={() => navigate(ROUTES.MARKETPLACE)}
                className="text-amber-800 hover:text-amber-950 font-bold ml-2 underline cursor-pointer"
              >
                Xóa tìm kiếm
              </button>
            </div>
          )}
        </div>

        {filteredListings.length === 0 && (
          <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center shadow-sm my-6">
            <Search className="w-12 h-12 mx-auto text-amber-500/50 mb-3" />
            <p className="text-slate-800 font-bold text-base">Không tìm thấy lô pin nào phù hợp với từ khóa "{query}"</p>
            <p className="text-slate-500 text-xs mt-1">Thử từ khóa khác như "VF8", "VF9", "LFP", "NMC", hoặc "48V"</p>
            <button
              onClick={() => navigate(ROUTES.MARKETPLACE)}
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Xem tất cả danh mục pin
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-5">
          {paginatedListings.map(listing => {
            const pack = packs.find(p => p.id === listing.batteryPackId) || listing.batteryPack;
            const supplier = orgs.find(o => o.id === pack?.currentOrganizationId);
            if (!pack) return null;

            return (
              <div key={listing.id} className="group relative block rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3.5">
                  {/* Nút QR Code Góc Trên Trái — Nổi Bật & Bấm Trực Tiếp */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrModal({
                        isOpen: true,
                        serial: pack.serialNumber,
                        passportCode: listing.passportCode,
                        model: `${pack.manufacturer} ${pack.vehicleModel}`,
                        soh: pack.currentSohPercent,
                        capacity: pack.currentCapacityKwh,
                      });
                    }}
                    title="Bấm để xem Mã QR Pin"
                    className="w-12 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shrink-0 flex flex-col items-center justify-center font-bold shadow-sm transition transform hover:scale-105 cursor-pointer relative z-20"
                  >
                    <QrCode className="w-6 h-6 stroke-[2.5]" />
                    <span className="text-[9px] font-black uppercase tracking-tighter -mt-0.5">QR PIN</span>
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-slate-900 tracking-tight leading-snug truncate">
                      {pack.manufacturer} {pack.vehicleModel}
                    </p>
                    <p className="text-[12px] text-slate-500 leading-normal mt-0.5 line-clamp-1">
                      Bán bởi: <span className="font-semibold text-slate-700">{supplier?.name || 'Unknown'}</span>
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-base font-black text-slate-900 font-mono tracking-tight leading-none">
                      {(listing.askingPriceVnd / 1_000_000).toFixed(1)}M ₫
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                      Giá bán B2B
                    </p>
                  </div>

                  <div className="shrink-0 self-center flex items-center pl-1">
                    <ArrowRight className="w-5 h-5 text-slate-400 opacity-40 group-hover:opacity-100 group-hover:text-amber-600 transition-all" />
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col gap-2">
                  {/* Row 1: Thông số */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 w-14 shrink-0">Thông số</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold font-mono">
                        {pack.currentCapacityKwh} kWh
                      </span>
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold">
                        {pack.formFactor}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold font-mono">
                        {pack.chemistry}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Đánh giá + Nút QR Code phụ */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 w-14 shrink-0">Đánh giá</span>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-bold font-mono ${pack.currentSohPercent >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          pack.currentSohPercent >= 70 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        SOH {pack.currentSohPercent}%
                      </span>
                      {listing.passportCode && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Đã có Passport
                        </span>
                      )}
                      {/* Nút Xem QR Pin Nổi Bật */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQrModal({
                            isOpen: true,
                            serial: pack.serialNumber,
                            passportCode: listing.passportCode,
                            model: `${pack.manufacturer} ${pack.vehicleModel}`,
                            soh: pack.currentSohPercent,
                            capacity: pack.currentCapacityKwh,
                          });
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-amber-400 text-[11px] font-black tracking-wide shadow-xs transition cursor-pointer relative z-20"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" /> Xem Mã QR
                      </button>
                    </div>
                  </div>
                </div>

                {/* Clickable Area for Escrow Navigation */}
                <div
                  className="absolute inset-0 rounded-2xl cursor-pointer z-10"
                  onClick={() => navigate(`${ROUTES.ESCROW}?packId=${listing.batteryPackId}`)}
                />
              </div>
            );
          })}
        </div>

        {/* ── PAGINATION CONTROLS ── */}
        {filteredListings.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Info + Page Size Selector */}
            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
              <span>
                Hiển thị <strong className="text-slate-900 font-bold">{startIndex + 1}–{Math.min(startIndex + pageSize, filteredListings.length)}</strong> trong tổng số <strong className="text-slate-900 font-bold">{filteredListings.length}</strong> lô pin
              </span>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                <span className="text-[11px] text-slate-400">Hiển thị:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value={6}>6 lô / trang</option>
                  <option value={12}>12 lô / trang</option>
                  <option value={24}>24 lô / trang</option>
                </select>
              </div>
            </div>

            {/* Page Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition flex items-center justify-center border cursor-pointer ${
                      currentPage === page
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
              >
                Sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* QR Code Modal cho từng sản phẩm pin */}
      <QrCodeModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal(prev => ({ ...prev, isOpen: false }))}
        title="Mã QR Truy Xuất Pin"
        subtitle="Quét bằng điện thoại để xem trực tiếp lý lịch Hộ chiếu pin"
        serialNumber={qrModal.serial}
        passportCode={qrModal.passportCode}
        modelName={qrModal.model}
        sohPercent={qrModal.soh}
        capacityKwh={qrModal.capacity}
        actionType="VIEW_ONLY"
      />
    </div>
  );
};
