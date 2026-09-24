// ============================================================
// RE-BATTERY MARKET — Central API Service Hub
// Tích hợp RESTful API backend ASP.NET Core với Mock Fallback
// ============================================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5210/api/v1';

export { authService } from './authService';
export { batteryPackService } from './batteryPackService';
export { passportService } from './passportService';
export { bessProjectService } from './bessProjectService';
export { escrowService } from './escrowService';
export { matchingService } from './matchingService';
export { publicTraceService } from './publicTraceService';

// Re-export mock data for fallback & static references
export * from '../data/mockData';
