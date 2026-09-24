import { http } from '../lib/api/http';
import type { ApiResponse, MatchingResult } from '../types';
import { runSmartMatching } from '../data/mockData';

export interface MatchingQueryParams {
  requiredCapacityKwh: number;
  requiredPowerKw: number;
  targetVoltageV: number;
  preferredChemistry?: string;
  maxBudgetVnd: number;
  applicationUsage: string;
}

export const matchingService = {
  async recommend(params: MatchingQueryParams): Promise<MatchingResult[]> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.post<ApiResponse<MatchingResult[]>>('/matching', params);
      return response.data.data;
    } catch (error) {
      console.warn('API call failed for smart matching, falling back to mock matching engine:', error);
      return runSmartMatching(
        params.requiredCapacityKwh,
        params.targetVoltageV,
        params.maxBudgetVnd,
        params.preferredChemistry
      );
    }
  }
};
