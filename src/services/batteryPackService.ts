import { http } from '../lib/api/http';
import type { ApiResponse, BatteryPack } from '../types';
import { StorageManager } from '../lib/storage';

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export const batteryPackService = {
  async getBatteryPacks(pageNumber = 1, pageSize = 50): Promise<BatteryPack[]> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.get<ApiResponse<PagedResult<BatteryPack> | BatteryPack[]>>('/battery-packs', {
        params: { pageNumber, pageSize },
      });
      const data = response.data.data;
      if (Array.isArray(data)) return data;
      if (data && 'items' in data) return data.items;
      return StorageManager.getBatteryPacks();
    } catch (error) {
      console.warn('API call failed for battery-packs, returning LocalStorage data:', error);
      return StorageManager.getBatteryPacks();
    }
  },

  async getBatteryPackById(id: string): Promise<BatteryPack | null> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.get<ApiResponse<BatteryPack>>(`/battery-packs/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn(`API call failed for battery-pack ${id}, returning LocalStorage data:`, error);
      const packs = StorageManager.getBatteryPacks();
      return packs.find((p) => p.id === id) || null;
    }
  },

  async createBatteryPack(payload: {
    serialNumber: string;
    originalVin: string;
    manufacturer: string;
    vehicleModel: string;
    chemistry: string;
    originalCapacityKwh: number;
    nominalVoltageV: number;
    currentSohPercent: number;
    totalCycles: number;
  }): Promise<BatteryPack> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.post<ApiResponse<BatteryPack>>('/battery-packs', payload);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed to create battery pack, storing into LocalStorage:', error);
      const newPack: BatteryPack = {
        id: `pack-${Date.now()}`,
        serialNumber: payload.serialNumber,
        originalVin: payload.originalVin,
        manufacturer: payload.manufacturer,
        vehicleModel: payload.vehicleModel,
        chemistry: payload.chemistry as any,
        originalCapacityKwh: payload.originalCapacityKwh,
        currentSohPercent: payload.currentSohPercent,
        currentCapacityKwh: payload.originalCapacityKwh * (payload.currentSohPercent / 100),
        nominalVoltageV: payload.nominalVoltageV,
        totalCycles: payload.totalCycles,
        formFactor: 'PACK',
        parentPackId: null,
        status: 'LISTED',
        currentOrganizationId: 'org-vines-001',
        currentOrganizationName: 'VinFast EV Services',
        createdAt: new Date().toISOString(),
      };
      return StorageManager.addBatteryPack(newPack);
    }
  }
};
