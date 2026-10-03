import { api } from '@/src/lib/api';

import type {
  RiderEarnings,
} from '../types';

class RiderEarningsService {
  async getDashboard(): Promise<RiderEarnings> {
    const response = await api.get(
      '/rider/earnings',
    );

    return response.data;
  }
}

export default new RiderEarningsService();