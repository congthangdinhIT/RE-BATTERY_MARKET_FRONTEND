import { http } from '../lib/api/http';
import type { ApiResponse, BessProject } from '../types';
import { StorageManager } from '../lib/storage';

export const bessProjectService = {
  async getBessProjects(): Promise<BessProject[]> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.get<ApiResponse<BessProject[]>>('/bess-projects');
      return response.data.data;
    } catch (error) {
      console.warn('API call failed for bess-projects, returning LocalStorage data:', error);
      return StorageManager.getBessProjects();
    }
  },

  async createBessProject(payload: any): Promise<BessProject> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.post<ApiResponse<BessProject>>('/bess-projects', payload);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed to create BESS project, storing into LocalStorage:', error);
      const newProj: BessProject = {
        id: `bess-${Date.now()}`,
        orderId: payload.orderId || 'ord-001',
        systemIntegratorId: 'org-ess-vn-001',
        systemIntegratorName: 'ESS Vietnam Co., Ltd',
        buyerId: 'org-solar-sme-001',
        buyerName: 'GreenSolar SME',
        status: 'ASSEMBLING',
        configurationDetails: payload.configurationDetails || '100 kW / 200 kWh LFP BESS',
        warrantyEndDate: null,
        insurancePolicyId: 'INS-2026-0891',
        insuranceProvider: 'Bảo Việt Risk Insurance',
        createdAt: new Date().toISOString(),
        acceptanceLogs: [],
        batteryPackId: 'pack-vf8-001',
        packSerial: 'VF8-BATT-2024-00891',
      };
      const projects = StorageManager.getBessProjects();
      const updated = [newProj, ...projects];
      StorageManager.saveBessProjects(updated);
      return newProj;
    }
  }
};
