// ============================================================
// REBATT — Type Definitions
// Căn chỉnh theo REBATT_Business_Specification.md v1.0.0
// ============================================================

export type UserRole = 'Admin' | 'Manager' | 'Staff' | 'Consumer';

export type OrganizationType =
  | 'SYSTEM'
  | 'SUPPLIER'
  | 'BUYER'
  | 'TESTING_LAB'
  | 'SYSTEM_INTEGRATOR'
  | 'LOGISTICS'
  | 'RECYCLER';

export type BatteryChemistryType = 'LFP' | 'NMC' | 'NCA' | 'LTO';

// BatteryFormFactor — từ SplitBatteryPackCommand.cs
export type BatteryFormFactor = 'PACK' | 'MODULE' | 'CELL';

// BatteryStatus — từ DomainEnums.cs (đầy đủ, thêm SPLIT & REJECTED)
export type BatteryStatus =
  | 'COLLECTED'
  | 'TESTING_PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'LISTED'
  | 'ESCROW_LOCKED'
  | 'IN_REPACK'
  | 'IN_INSTALLATION'
  | 'COMPLETED'
  | 'RECYCLED'
  | 'SPLIT';

// PassportEventType — từ DomainEnums.cs
export type PassportEventType =
  | 'COLLECTED'
  | 'INSPECTED'
  | 'PASSPORT_ISSUED'
  | 'LISTED'
  | 'MATCHED'
  | 'ESCROW_LOCKED'
  | 'REPACKED'
  | 'INSTALLED'
  | 'ACTIVE_MONITORING'
  | 'RECYCLED'
  | 'SPLIT_TO_MODULES';

// EscrowStatus — từ DomainEnums.cs (bỏ TESTING_PERIOD, thêm REFUNDED)
export type EscrowStatus = 'LOCKED' | 'RELEASED' | 'DISPUTED' | 'REFUNDED';

// OrderStatus — từ DomainEnums.cs
export type OrderStatus = 'CREATED' | 'PAYMENT_PENDING' | 'PAID' | 'CANCELLED';

// BessInstallationStatus — từ DomainEnums.cs
export type BessInstallationStatus =
  | 'CREATED'
  | 'BATTERY_RECEIVED'
  | 'ASSEMBLING'
  | 'INSTALLED'
  | 'TESTING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'UNDER_WARRANTY';

// InspectionStatus
export type InspectionStatus = 'PENDING' | 'PASSED' | 'FAILED';

// ─────────────────────────────────────────────────────────────
// API WRAPPER
// ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────
// ORGANIZATION
// ─────────────────────────────────────────────────────────────
export interface Organization {
  id: string;
  code: string;
  name: string;
  address: string;
  type: OrganizationType;
}

// ─────────────────────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
}

// ─────────────────────────────────────────────────────────────
// BATTERY PACK — Section 3.1 trong Business Spec
// CurrentCapacityKwh = OriginalCapacityKwh × (CurrentSohPercent / 100.0)
// ─────────────────────────────────────────────────────────────
// Phân loại kiểm định theo mô hình REBATT Asset-Light
// Trường hợp A: Pin cùng nguồn/lô lớn → kiểm định theo lô ngay, giảm 20-30% chi phí
// Trường hợp B: Pin nhỏ lẻ (gara) → chi phí 0đ trả trước, gom đơn chờ giao dịch mới kiểm định
export type InspectionType = 'BATCH_A' | 'SINGLE_B';

export interface BatteryPack {
  id: string;
  serialNumber: string;
  originalVin: string;
  manufacturer: string;
  vehicleModel: string;
  chemistry: BatteryChemistryType;
  originalCapacityKwh: number;
  currentSohPercent: number;
  currentCapacityKwh: number; // computed = original × (soh/100)
  nominalVoltageV: number;
  totalCycles: number;
  formFactor: BatteryFormFactor;      // PACK / MODULE / CELL
  parentPackId: string | null;         // ID Pack cha khi bị tách (BR-002)
  status: BatteryStatus;
  // Phân loại kiểm định Asset-Light (Đề án mục 2.b)
  inspectionType?: InspectionType;     // BATCH_A: Kiểm định theo lô | SINGLE_B: Gom đơn thông minh
  // Hạn hiệu lực Battery Passport — 60-90 ngày (SLA quản trị rủi ro)
  passportExpiresAt?: string | null;   // ISO string, null nếu chưa cấp
  // Logistics: Hàng nguy hiểm Loại 9 theo NĐ 34/2024/NĐ-CP
  logisticsClass?: 'CLASS_9_UN3480' | 'CLASS_9_UN3481' | null;
  currentOrganizationId: string;
  currentOrganizationName: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// BATTERY INSPECTION — Section 3.2 trong Business Spec
// ─────────────────────────────────────────────────────────────
export interface BatteryInspection {
  id: string;
  inspectionCode: string;
  batteryPackId: string;
  inspectorId: string;
  testingLabId: string;
  testingLabName: string;
  testedSohPercent: number;
  internalResistanceMohm: number;      // Điện trở nội (mΩ)
  cellVoltageImbalanceMv: number;       // Độ lệch điện áp giữa các cell (mV)
  thermalScanPassed: boolean;
  estimatedRulCycles: number;           // Remaining Useful Life cycles
  status: InspectionStatus;
  notes: string;
  inspectedAt: string;
}

// ─────────────────────────────────────────────────────────────
// BATTERY PASSPORT — Section 3.3 trong Business Spec
// PassportCode format: PASS-YYYYMMDD-XXXXXX
// ─────────────────────────────────────────────────────────────
export interface PassportEvent {
  id: string;
  batteryPackId: string;
  eventType: PassportEventType;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  performedById: string;
  performedByName: string;
  organizationId: string;
  organizationName: string;
  previousHash: string; // "GENESIS" nếu là sự kiện đầu tiên
  hash: string;         // SHA-256(eventContent + previousHash)
}

export interface BatteryPassport {
  id: string;
  passportCode: string;   // format: PASS-YYYYMMDD-XXXXXX
  batteryPackId: string;
  qrCodeUrl: string;      // /trace/{passportCode}
  latestHash: string;
  isVerified: boolean;
  issuedAt: string;
  expiresAt?: string | null; // Hạn hiệu lực 60-90 ngày (SLA quản trị rủi ro chất lượng)
  batteryPack: BatteryPack;
  events: PassportEvent[];
}

// ─────────────────────────────────────────────────────────────
// LISTING — Section 3.5
// ─────────────────────────────────────────────────────────────
export interface Listing {
  id: string;
  title: string;
  batteryPackId: string;
  batteryPack: BatteryPack;
  sellerOrganizationId: string;
  sellerOrganizationName: string;
  askingPriceVnd: number;
  description: string;
  isActive: boolean;
  isSold: boolean;
  createdAt: string;
  passportCode: string;
  // Phí sàn REBATT: 7% hoa hồng giao dịch (Đề án Phần 3 — Cách tạo doanh thu)
  commissionRatePercent?: number;    // Mặc định 7%
  platformFeeVnd?: number;           // = askingPrice × commissionRate
}

// ─────────────────────────────────────────────────────────────
// ORDER — Section 3.6
// ─────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  batteryPackId: string;
  packSerial: string;
  priceVnd: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  totalAmount: number;
  status: OrderStatus;
  trackingCode?: string;
  logisticsProvider?: string;
  items: OrderItem[];
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// ESCROW TRANSACTION — Section 3.7
// Flow: LOCKED → RELEASED / DISPUTED → REFUNDED
// ─────────────────────────────────────────────────────────────
export interface EscrowTransaction {
  id: string;
  orderId: string;
  transactionCode: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  status: EscrowStatus;
  lockedAt: string;
  releasedAt: string | null;
  releaseNote: string | null;
  // Thông tin pin liên quan (cho display)
  batteryPackId: string;
  packSerial: string;
  packModel: string;
}

// ─────────────────────────────────────────────────────────────
// ACCEPTANCE LOG — từ SubmitAcceptanceCommand.cs
// ─────────────────────────────────────────────────────────────
export interface AcceptanceLog {
  id: string;
  bessProjectId: string;
  inspectorId: string;
  inspectorName: string;
  isPassed: boolean;
  remarks: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// BESS PROJECT — Section 3.8
// BessInstallationStatus: CREATED → BATTERY_RECEIVED → ASSEMBLING
//   → INSTALLED → TESTING → ACCEPTED/REJECTED → UNDER_WARRANTY
// ─────────────────────────────────────────────────────────────
export interface BessProject {
  id: string;
  orderId: string;
  systemIntegratorId: string;
  systemIntegratorName: string;
  buyerId: string;
  buyerName: string;
  status: BessInstallationStatus;
  configurationDetails: string;
  warrantyEndDate: string | null;    // Auto = now + 1 năm khi ACCEPTED (BR-007)
  insurancePolicyId: string | null;
  insuranceProvider: string | null;
  createdAt: string;
  acceptanceLogs: AcceptanceLog[];
  // Thông tin pin liên quan (cho display)
  batteryPackId: string;
  packSerial: string;
}

// ─────────────────────────────────────────────────────────────
// SMART MATCHING RESULT — từ SmartMatchingHandler.cs
// Score = (CapacityScore × 0.4) + (SohScore × 0.4) + (VoltageScore × 0.2)
// EstimatedBessPriceVnd = AskingPriceVnd + 15.000.000
// ─────────────────────────────────────────────────────────────
export interface MatchingResult {
  listing: Listing;
  matchScorePercent: number;
  matchReason: string;
  estimatedBessPriceVnd: number;
}
