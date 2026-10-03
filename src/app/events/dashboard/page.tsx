'use client';

import React, { useEffect, useState } from 'react';
import { Bus, Users, TrendingUp, CheckCircle2, Clock, MapPin, Navigation } from 'lucide-react';
import { api } from '@/src/lib/api';

export default function OrganizerMainDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await api.get('/events/dashboard/overview');
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard overview:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Total Bookings', value: metrics?.stats?.totalBookings ?? '0', icon: Users },
    { label: 'Boarded', value: metrics?.stats?.boarded ?? '0', sub: metrics?.stats?.totalBookings ? `${Math.round((metrics.stats.boarded / metrics.stats.totalBookings) * 100)}%` : '0%', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'On Transit', value: metrics?.stats?.onTransit ?? '0', icon: Bus, color: 'text-amber-400' },
    { label: 'Completed', value: metrics?.stats?.completed ?? '0', icon: Clock, color: 'text-blue-400' },
    { label: 'Total Revenue', value: `₦${(metrics?.stats?.totalRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400' },
  ];

  const liveBuses = metrics?.liveTrips?.map((trip: any) => ({
    id: trip.vehicle?.name || `Bus ${trip.id.substring(0, 4)}`,
    route: `${trip.route?.origin || 'Origin'} → ${trip.route?.destination || 'Destination'}`,
    passengers: `${trip.bookings?.length || 0} / ${trip.vehicle?.capacity || 40}`,
    status: trip.status === 'IN_TRANSIT' ? 'On Transit' : trip.status,
    progress: trip.status === 'COMPLETED' ? 100 : 50,
  })) || [];

  const pickupPoints = metrics?.topPickupPoints || [];
  const recentBookings = metrics?.recentBookings || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm font-mono text-neutral-400 animate-pulse">Loading dashboard telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-5 space-y-3 shadow-sm">
            <span className="text-xs font-medium text-neutral-400 uppercase font-mono tracking-wider">{stat.label}</span>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-black tracking-tight ${stat.color || 'text-white'}`}>{stat.value}</span>
              {stat.sub && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-800/80 text-neutral-300">
                  {stat.sub}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Live Transport Table & Live Map Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Transport Overview Table */}
        <div className="lg:col-span-2 bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight text-white uppercase font-mono">Live Transport Overview</h2>
            <span className="text-xs text-neutral-400 font-mono">{liveBuses.length} Active Convoys</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[11px] font-mono font-bold text-neutral-400 uppercase">
                  <th className="pb-3">Bus / Trip</th>
                  <th className="pb-3">Route</th>
                  <th className="pb-3">Passengers</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50 text-xs">
                {liveBuses.length > 0 ? (
                  liveBuses.map((bus: any, idx: number) => (
                    <tr key={idx} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="py-4 font-bold text-white font-mono">{bus.id}</td>
                      <td className="py-4 text-neutral-300">{bus.route}</td>
                      <td className="py-4 text-neutral-300 font-mono">{bus.passengers}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          bus.status === 'Completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {bus.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="font-mono text-[11px] text-neutral-400">{bus.progress}%</span>
                          <div className="w-20 bg-neutral-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${bus.status === 'Completed' ? 'bg-emerald-500' : 'bg-emerald-400'}`} 
                              style={{ width: `${bus.progress}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500 font-mono text-xs">
                      No active transport convoys currently on route.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Map Overview Widget */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight text-white uppercase font-mono">Live Map Overview</h2>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">GPS Active</span>
          </div>
          <div className="relative flex-1 min-h-[260px] bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {liveBuses.length > 0 ? (
              <div className="relative z-10 w-full space-y-3">
                <div className="flex items-center justify-between px-2 text-[10px] font-mono text-neutral-400 border-b border-neutral-800 pb-2">
                  <span>ACTIVE CONVOYS PINNED</span>
                  <Navigation className="h-3 w-3 text-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {liveBuses.map((bus: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0 animate-bounce" />
                        <div>
                          <p className="text-xs font-bold text-white font-mono">{bus.id}</p>
                          <p className="text-[10px] text-neutral-400">{bus.route}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {bus.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 z-10">
                <MapPin className="h-8 w-8 text-neutral-600 mx-auto" />
                <p className="text-xs font-bold text-white">No Active GPS Routes</p>
                <p className="text-[11px] text-neutral-400">Map will populate when trips begin transit.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Grid: Top Pickup Points, Recent Bookings, Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Pickup Points */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono">Top Pickup Points</h3>
          <div className="space-y-4">
            {pickupPoints.length > 0 ? (
              pickupPoints.map((point: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between pb-3 border-b border-neutral-800/50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <span className="block text-xs font-bold text-white">{point.name}</span>
                      <span className="block text-[11px] text-neutral-400 font-mono">{point.count}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 font-mono py-4 text-center">No pickup points registered yet.</p>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono">Recent Bookings</h3>
            <span className="text-xs text-emerald-400 cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between pb-3 border-b border-neutral-800/50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-neutral-800 flex items-center justify-center text-xs font-bold text-white font-mono">
                      {booking.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white">{booking.name}</span>
                      <span className="block text-[10px] text-neutral-400 font-mono">{booking.bus}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-neutral-800 text-neutral-300">
                    {booking.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-500 font-mono py-4 text-center">No recent bookings recorded.</p>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase font-mono">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs py-2 border-b border-neutral-800/50">
              <span className="text-neutral-400">Total Revenue</span>
              <span className="font-bold text-white font-mono">₦{(metrics?.stats?.totalRevenue ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-neutral-800/50">
              <span className="text-neutral-400">Successful Payments</span>
              <span className="font-bold text-emerald-400 font-mono">{metrics?.stats?.successfulPayments ?? 0}</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-neutral-800/50">
              <span className="text-neutral-400">Refunds</span>
              <span className="font-bold text-neutral-300 font-mono">{metrics?.stats?.refunds ?? 0}</span>
            </div>
            <div className="flex justify-between text-xs py-2">
              <span className="text-neutral-400">Pending Payments</span>
              <span className="font-bold text-neutral-300 font-mono">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}