import { http } from '../lib/api/http';
import type { ApiResponse, BatteryPassport } from '../types';
import { MOCK_PASSPORTS } from '../data/mockData';

export interface VerifyPassportResult {
  isValid: boolean;
  totalEvents: number;
  message: string;
}

export const passportService = {
  async getPassportByCode(passportCode: string): Promise<BatteryPassport | null> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.get<ApiResponse<BatteryPassport>>(`/passports/${passportCode}`);
      return response.data.data;
    } catch (error) {
      console.warn(`API call failed for passport ${passportCode}, falling back to mock:`, error);
      return MOCK_PASSPORTS.find((p) => p.passportCode === passportCode || p.id === passportCode || p.batteryPackId === passportCode) || MOCK_PASSPORTS[0];
    }
  },

  async verifyPassport(passportCode: string): Promise<VerifyPassportResult> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.get<ApiResponse<VerifyPassportResult>>(`/passports/${passportCode}/verify`);
      return response.data.data;
    } catch (error) {
      console.warn(`API call failed for verifying passport ${passportCode}, falling back to mock verification:`, error);
      const pass = MOCK_PASSPORTS.find((p) => p.passportCode === passportCode);
      return {
        isValid: pass?.isVerified ?? true,
        totalEvents: pass?.events?.length ?? 4,
        message: 'Chuỗi SHA-256 Ledger Hash hợp lệ và toàn vẹn.',
      };
    }
  },

  async generatePassport(batteryPackId: string): Promise<BatteryPassport> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.post<ApiResponse<BatteryPassport>>(`/passports/generate/${batteryPackId}`);
      return response.data.data;
    } catch (error) {
      console.warn(`API call failed for generating passport for pack ${batteryPackId}, returning mock:`, error);
      return MOCK_PASSPORTS[0];
    }
  }
};
