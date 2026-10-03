import { api } from '@/src/lib/api';

import {
  WalletOverview,
  WalletHistoryResponse,
  WithdrawRequest,
} from '../types';

class WalletService {
  /*
   * Wallet Overview
   */
  async getOverview() {
    const { data } = await api.get<WalletOverview>(
      '/rider/wallet',
    );

    return data;
  }

  /*
   * Transaction History
   */
  async getHistory() {
    const { data } =
      await api.get<WalletHistoryResponse>(
        'rider/wallet/history',
      );

    return data;
  }

  /*
   * Withdrawal Request
   */
  async requestWithdrawal(
    payload: WithdrawRequest,
  ) {
    const { data } = await api.post(
      'rider/wallet/withdraw',
      payload,
    );

    return data;
  }

  /*
   * Pending Withdrawals
   */
  async getWithdrawals() {
    const { data } = await api.get(
      '/wallet/withdrawals',
    );

    return data;
  }

  /*
   * Single Withdrawal
   */
  async getWithdrawal(id: string) {
    const { data } = await api.get(
      `/wallet/withdrawals/${id}`,
    );

    return data;
  }
}

export default new WalletService();