'use client';

import { useEffect, useState } from 'react';

import RoleGuard from '../../../middleware/RoleGuard';

import RiderStatusCard from './components/RiderStatusCard';
import RiderStatsGrid from './components/RiderStatsGrid';
import RecentDeliveries from './components/RecentDeliveries';

import riderDashboardService from './services/dashboard.service';

import type { RiderOverview } from './types';

export default function RiderDashboardOverview() {
  const [overview, setOverview] =
    useState<RiderOverview | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response =
          await riderDashboardService.getOverview();

        setOverview(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <RoleGuard roles={['RIDER']}>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          Loading dashboard...
        </div>
      ) : !overview ? (
        <div className="flex items-center justify-center py-20">
          Unable to load dashboard.
        </div>
      ) : (
        <div className="space-y-8">
          <RiderStatusCard
            rider={overview.rider}
          />

          <RiderStatsGrid
            statistics={overview.statistics}
          />

          <RecentDeliveries
            deliveries={overview.recentDeliveries}
          />
        </div>
      )}
    </RoleGuard>
  );
}