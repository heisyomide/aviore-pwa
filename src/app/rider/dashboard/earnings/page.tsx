'use client';

import { useEffect, useState } from 'react';

import earningsService from './services/earnings.service';

import type {
  RiderEarnings,
} from './types';

import EarningsOverview from './components/EarningsOverview';
import EarningsChart from './components/EarningsChart';
import EarningsHistory from './components/EarningsHistory';
import EarningsCalendar from './components/EarningsCalendar';
import EarningsSkeleton from './components/EarningsSkeleton';
import EmptyEarnings from './components/EmptyEarnings';

export default function RiderEarningsPage() {
  const [loading, setLoading] =
    useState(true);

  const [earnings, setEarnings] =
    useState<RiderEarnings | null>(null);

  async function loadEarnings() {
    try {
      const data =
        await earningsService.getDashboard();

        console.log(data);

      setEarnings(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEarnings();
  }, []);

  if (loading) {
    return <EarningsSkeleton />;
  }

  if (!earnings) {
    return <EmptyEarnings />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      <div>
        <h1 className="text-3xl font-black text-white">
          Earnings
        </h1>

        <p className="mt-1 text-sm text-neutral-400">
          Monitor your weekly income,
          completed deliveries and payout
          history.
        </p>
      </div>

      <EarningsOverview
        overview={earnings.overview}
      />

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <EarningsChart
            chart={earnings.chart}
          />
        </div>

        <div>
<EarningsCalendar
  weekLabel={earnings.overview?.weekLabel ?? 'Current Week'}
/>
        </div>

      </div>

      <EarningsHistory
        history={earnings.history}
      />

    </div>
  );
}