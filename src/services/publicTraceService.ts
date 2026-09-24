import { http } from '../lib/api/http';
import type { ApiResponse, BatteryPassport } from '../types';
import { StorageManager } from '../lib/storage';

export const publicTraceService = {
  async tracePassport(passportCodeOrSerial: string): Promise<BatteryPassport | null> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.get<ApiResponse<BatteryPassport>>(`/public/trace/${passportCodeOrSerial}`);
      return response.data.data;
    } catch (error) {
      console.warn(`API call failed to public trace ${passportCodeOrSerial}, reading from LocalStorage:`, error);
      const query = passportCodeOrSerial.toLowerCase();
      const passports = StorageManager.getPassports();
      return (
        passports.find(
          (p) =>
            p.passportCode.toLowerCase() === query ||
            p.batteryPackId.toLowerCase() === query ||
            p.batteryPack?.serialNumber.toLowerCase() === query
        ) || passports[0] || null
      );
    }
  }
};
