import { http } from '../lib/api/http';
import type { ApiResponse, EscrowTransaction } from '../types';
import { StorageManager } from '../lib/storage';

export const escrowService = {
  async getEscrowTransactions(): Promise<EscrowTransaction[]> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.get<ApiResponse<EscrowTransaction[]>>('/Escrow');
      return response.data.data;
    } catch (error) {
      console.warn('API call failed for Escrow transactions, returning LocalStorage data:', error);
      return StorageManager.getEscrows();
    }
  },

  async lockEscrow(orderId: string, amount: number): Promise<EscrowTransaction> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.post<ApiResponse<EscrowTransaction>>(`/Escrow/${orderId}/lock`, {
        orderId,
        amount,
      });
      return response.data.data;
    } catch (error) {
      console.warn(`API call failed to lock escrow for order ${orderId}, storing into LocalStorage:`, error);
      const newTx: EscrowTransaction = {
        id: `escrow-${Date.now()}`,
        orderId,
        transactionCode: `ESC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        buyerId: 'org-solar-sme-001',
        buyerName: 'GreenSolar SME',
        sellerId: 'org-vines-001',
        sellerName: 'VinFast EV Services',
        amount,
        status: 'LOCKED',
        lockedAt: new Date().toISOString(),
        releasedAt: null,
        releaseNote: null,
        batteryPackId: 'pack-vf8-001',
        packSerial: 'VF8-BATT-2024-00891',
        packModel: 'VinFast VF8 Eco Pack',
      };
      return StorageManager.addEscrow(newTx);
    }
  },

  async releaseEscrow(orderId: string, releaseNote?: string): Promise<EscrowTransaction> {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        throw new Error('Mock mode enabled');
      }
      const response = await http.post<ApiResponse<EscrowTransaction>>(`/Escrow/${orderId}/release`, {
        orderId,
        releaseNote,
      });
      return response.data.data;
    } catch (error) {
      console.warn(`API call failed to release escrow for order ${orderId}, updating LocalStorage:`, error);
      const escrows = StorageManager.getEscrows();
      const tx = escrows.find((t) => t.orderId === orderId || t.id === orderId) || escrows[0];
      if (tx) {
        tx.status = 'RELEASED';
        tx.releasedAt = new Date().toISOString();
        tx.releaseNote = releaseNote || 'Nghiệm thu dự án thành công';
        StorageManager.saveEscrows(escrows);
      }
      return tx;
    }
  }
};
