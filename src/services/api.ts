// ============================================================
// api.ts — MOCK MODE: Không gọi backend
// Tất cả data được import từ src/data/mockData.ts
// Backend URL được giữ lại để reference khi tích hợp sau này
// ============================================================

export const API_BASE_URL = 'http://localhost:5210/api/v1';

// Re-export everything from mockData as the "API layer"
export * from '../data/mockData';
