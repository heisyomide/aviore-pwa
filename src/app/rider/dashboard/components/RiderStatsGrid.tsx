"use client";

import {
  Wallet,
  PackageCheck,
  Star,
  Banknote,
} from "lucide-react";

import StatsCard from "./StatsCard";

import type {
  RiderStatistics,
} from "../types";

interface RiderStatsGridProps {
  statistics: RiderStatistics;
}

export default function RiderStatsGrid({
  statistics,
}: RiderStatsGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

      <StatsCard
        title="Today's Earnings"
        value={`₦${statistics.todaysEarnings.toLocaleString()}`}
        icon={<Wallet size={22} />}
        color="text-emerald-400"
        subtitle="Completed deliveries today"
      />

      <StatsCard
        title="Available Jobs"
        value={statistics.availableJobs}
        icon={<PackageCheck size={22} />}
        color="text-white"
        subtitle="Tap Jobs to accept deliveries"
      />

      <StatsCard
        title="Pending Withdrawal"
        value={`₦${statistics.pendingWallet.toLocaleString()}`}
        icon={<Banknote size={22} />}
        color="text-amber-400"
        subtitle="Ready for withdrawal"
      />

      <StatsCard
        title="Rider Rating"
        value={statistics.riderRating.toFixed(2)}
        icon={<Star size={22} />}
        color="text-yellow-400"
        subtitle="Average customer rating"
      />

    </div>
  );
}