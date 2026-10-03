'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, MapPin, Calendar, Users, Search, Truck, ArrowUpRight } from 'lucide-react';
import { api } from '@/src/lib/api';

interface ActiveTripItem {
  id: string;
  status: string;
  route: {
    id: string;
    originCity: string;
    destination: string;
    price: number;
    event: {
      id: string;
      title: string;
      venue: string;
      city: string;
      state: string;
      startDate: string;
      endDate: string;
    };
    pickupPoints: Array<{
      id: string;
      name: string;
      address: string;
      landmark?: string;
      maxCapacity: number;
    }>;
  };
  vehicle?: {
    id: string;
    make: string;
    model: string;
    plateNumber: string;
    color: string;
  };
  driver?: {
    user: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
  bookings?: Array<any>;
}

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<ActiveTripItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/events/organizer/active-trips');
      setTrips(response.data || []);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch trips catalog.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const event = trip.route?.event;
    const query = searchQuery.toLowerCase();
    return (
      event?.title?.toLowerCase().includes(query) ||
      event?.city?.toLowerCase().includes(query) ||
      event?.venue?.toLowerCase().includes(query) ||
      trip.route?.originCity?.toLowerCase().includes(query) ||
      trip.route?.destination?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white uppercase font-mono tracking-tight">Trips & Transit Convoys</h1>
          <p className="text-xs text-neutral-400">Monitor active travel itineraries, convoy allocations, and route pricing structures.</p>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-4 bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event title, city, or route..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
        <span className="text-xs font-mono text-neutral-400">Total Convoys: {filteredTrips.length}</span>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-mono">
          {error}
        </div>
      )}

      {/* Trips Grid / List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-xs font-mono text-neutral-400 animate-pulse">Syncing transport itineraries...</p>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrips.map((trip) => {
            const event = trip.route?.event;
            const route = trip.route;

            return (
              <div key={trip.id} className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-6 space-y-6 flex flex-col justify-between hover:border-neutral-700 transition-colors">
                
                {/* Trip Header info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <Truck className="h-3 w-3" /> {trip.status || 'ACTIVE CONVOY'}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                      {event?.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white font-mono leading-snug">{event?.title || 'Unnamed Event'}</h3>
                    <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                      <span>{event?.venue}, {event?.city}, {event?.state}</span>
                    </p>
                  </div>
                </div>

                {/* Associated Route & Pricing Section */}
                <div className="space-y-3 pt-4 border-t border-neutral-800/60">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Route & Allocation</h4>
                    <button
                      onClick={() => router.push(`/events/trips/${trip.id}/active`)}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Monitor Live <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                  
                  {route ? (
                    <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-bold flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5 text-emerald-400" />
                          {route.originCity} $\rightarrow$ {route.destination}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          ₦{route.price?.toLocaleString()}
                        </span>
                      </div>

                      {/* Driver & Vehicle Metadata */}
                      {trip.vehicle && (
                        <div className="text-[11px] text-neutral-300 font-mono pt-1">
                          Vehicle: <span className="text-white">{trip.vehicle.make} {trip.vehicle.model}</span> ({trip.vehicle.plateNumber})
                        </div>
                      )}

                      {/* Pickup Breakdown */}
                      <div className="space-y-1.5 pt-2 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">Pickup Points ({route.pickupPoints?.length || 0}):</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {route.pickupPoints?.map((p, pIdx) => (
                            <div key={p.id || pIdx} className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] space-y-0.5">
                              <div className="font-bold text-white truncate">{p.name}</div>
                              <div className="text-neutral-400 truncate text-[10px]">{p.address}</div>
                              <div className="text-[10px] font-mono text-emerald-400">Cap: {p.maxCapacity} seats</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 font-mono italic">No route assigned.</p>
                  )}
                </div>

                {/* Footer Metrics */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800/60 text-xs text-neutral-300 font-mono">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-neutral-500" />
                    <span>Manifest Bookings: <strong className="text-white">{trip.bookings?.length || 0}</strong></span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Driver: {trip.driver ? `${trip.driver.user.firstName} ${trip.driver.user.lastName}` : 'Unassigned'}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-12 text-center space-y-4">
          <Compass className="h-10 w-10 text-neutral-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono">No Active Trips Found</h3>
            <p className="text-xs text-neutral-400">Active convoys deployed from routes will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
}