import { ROUTES } from '../config/routes';

export type UserRole =
  | 'BUYER'
  | 'SUPPLIER'
  | 'TESTING_LAB'
  | 'SYSTEM_INTEGRATOR'
  | 'LOGISTICS'
  | 'MANAGER_STAFF'
  | 'Admin';

export interface RoleConfig {
  value: UserRole;
  label: string;
  badgeColor: string;
  description: string;
  allowedRoutes: string[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  BUYER: {
    value: 'BUYER',
    label: 'Người Mua (Solar EPC / SME)',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Tìm kiếm lô pin, ghép nối BESS, mở giao dịch ký quỹ (Escrow) & quản lý dự án BESS.',
    allowedRoutes: [
      ROUTES.MARKETPLACE,
      ROUTES.SMART_MATCHING,
      ROUTES.ESCROW,
      ROUTES.BESS_PROJECTS,
      ROUTES.PASSPORTS,
      ROUTES.DASHBOARD,
      ROUTES.EPR_COMPLIANCE,
    ],
  },
  SUPPLIER: {
    value: 'SUPPLIER',
    label: 'Nhà Cung Cấp (Thu hồi Pin)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Thu gom pin EV hết niên hạn, khởi tạo thông tin pin, đăng bán Chợ Giao Dịch & nhận thanh toán ký quỹ.',
    allowedRoutes: [
      ROUTES.BATTERY_PACKS,
      ROUTES.PASSPORTS,
      ROUTES.ESCROW,
      ROUTES.DASHBOARD,
      ROUTES.EPR_COMPLIANCE,
    ],
  },
  TESTING_LAB: {
    value: 'TESTING_LAB',
    label: 'Trung Tâm Kiểm Định (Lab)',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Đo đạc chỉ số SOH thực tế, cấp chứng thư kiểm định & ký số SHA-256 lên Hộ chiếu Pin.',
    allowedRoutes: [
      ROUTES.BATTERY_PACKS,
      ROUTES.PASSPORTS,
      ROUTES.DASHBOARD,
      ROUTES.EPR_COMPLIANCE,
    ],
  },
  SYSTEM_INTEGRATOR: {
    value: 'SYSTEM_INTEGRATOR',
    label: 'Nhà Tích Hợp (SI BESS)',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    description: 'Tích hợp hệ thống BESS, chạy thuật toán Smart Matching 40/40/20 & nghiệm thu công trình.',
    allowedRoutes: [
      ROUTES.MARKETPLACE,
      ROUTES.SMART_MATCHING,
      ROUTES.BESS_PROJECTS,
      ROUTES.PASSPORTS,
      ROUTES.ESCROW,
      ROUTES.DASHBOARD,
      ROUTES.EPR_COMPLIANCE,
    ],
  },
  LOGISTICS: {
    value: 'LOGISTICS',
    label: 'Đơn Vị Vận Chuyển Class 9',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    description: 'Vận chuyển hàng nguy hiểm Class 9, quét QR nghiệm thu giao nhận & cập nhật trạng thái vận tải Escrow.',
    allowedRoutes: [
      ROUTES.ESCROW,
      ROUTES.PASSPORTS,
      ROUTES.DASHBOARD,
      ROUTES.EPR_COMPLIANCE,
    ],
  },
  MANAGER_STAFF: {
    value: 'MANAGER_STAFF',
    label: 'Quản Lý Sàn REBATT',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
    description: 'Giám sát toàn bộ giao dịch sàn, phê duyệt hồ sơ tuân thủ EPR, giải quyết tranh chấp Escrow.',
    allowedRoutes: [
      ROUTES.MARKETPLACE,
      ROUTES.SMART_MATCHING,
      ROUTES.BATTERY_PACKS,
      ROUTES.PASSPORTS,
      ROUTES.ESCROW,
      ROUTES.BESS_PROJECTS,
      ROUTES.DASHBOARD,
      ROUTES.EPR_COMPLIANCE,
    ],
  },
  Admin: {
    value: 'Admin',
    label: 'Quản Trị Hệ Thống (Admin)',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
    description: 'Toàn quyền cấu hình hệ thống, quản lý người dùng, audit log chuỗi khối SHA-256 & phân quyền sàn.',
    allowedRoutes: [
      ROUTES.MARKETPLACE,
      ROUTES.SMART_MATCHING,
      ROUTES.BATTERY_PACKS,
      ROUTES.PASSPORTS,
      ROUTES.ESCROW,
      ROUTES.BESS_PROJECTS,
      ROUTES.DASHBOARD,
      ROUTES.EPR_COMPLIANCE,
    ],
  },
};

export const isRouteAllowed = (path: string, role: string): boolean => {
  const config = ROLE_CONFIGS[role as UserRole];
  if (!config) return true; // Default allow if unknown role
  
  // Normalize path (strip query params)
  const cleanPath = path.split('?')[0];

  // Match route precisely or by prefix
  return config.allowedRoutes.some(allowed => cleanPath === allowed || cleanPath.startsWith(`${allowed}/`));
};

export const getFirstAllowedRoute = (role: string): string => {
  const config = ROLE_CONFIGS[role as UserRole];
  if (config && config.allowedRoutes.length > 0) {
    return config.allowedRoutes[0];
  }
  return ROUTES.MARKETPLACE;
};
