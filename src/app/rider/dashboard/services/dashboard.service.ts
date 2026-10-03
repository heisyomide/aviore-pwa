import { api } from '@/src/lib/api';

import RiderDashboardConstants from "../../../rider/dashboard/constants";

import type {
  RiderOverview,
} from "../../../rider/dashboard/types";

class RiderDashboardService {
  async getOverview(): Promise<RiderOverview> {
    const { data } =
      await api.get<RiderOverview>(
        RiderDashboardConstants.OVERVIEW,
      );

    return data;
  }

  async updateAvailability(
  isOnline: boolean,
) {
  const { data } = await api.patch(
    '/rider/profile/availability',
    {
      isOnline,
    },
  );

  return data;
}
}

const riderDashboardService =
  new RiderDashboardService();

export default riderDashboardService;