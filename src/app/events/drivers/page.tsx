'use client';

import React, { useState, useEffect } from 'react';
import { Truck, User, MapPin, Calendar, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '@/src/lib/api';

interface DriverUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl?: string;
}

interface Driver {
  id: string;
  user: DriverUser;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  make: string;
  color: string;
  year: number;
}

interface Trip {
  id: string;
  departureTime: string;
  status: string;
  vehicle?: Vehicle;
  driver?: Driver;
}

interface RouteItem {
  id: string;
  originCity: string;
  destination: string;
  trips: Trip[];
}

interface EventItem {
  id: string;
  title: string;
  startDate: string;
  routes: RouteItem[];
}

export default function EventDriversPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrganizerData = async () => {
    setLoading(true);
    setError('');
    try {
      // Calls your existing endpoint that returns all organizer events with full route & trip relations
      const response = await api.get('/events/organizer');
      setEvents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch event fleet data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  // Flatten out all trips from all events and routes into a single list for the driver table
  const allTrips = events.flatMap((event) =>
    event.routes.flatMap((route) =>
      route.trips.map((trip) => ({
        ...trip,
        eventTitle: event.title,
        originCity: route.originCity,
        destination: route.destination,
      }))
    )
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-[#0e131f] min-h-screen text-white font-mono">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase">Event Fleet & Assigned Drivers</h1>
          <p className="text-xs text-neutral-400">Monitor scheduled transit trips, assigned vehicle configurations, and active drivers.</p>
        </div>
        <button
          onClick={fetchOrganizerData}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          Refresh Fleet
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Trips / Drivers Table View */}
      <div className="border border-neutral-800 rounded-3xl overflow-hidden bg-neutral-950/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50 text-[11px] text-neutral-400 uppercase tracking-wider">
                <th className="py-4 px-6">Event & Route</th>
                <th className="py-4 px-6">Departure Time</th>
                <th className="py-4 px-6">Assigned Vehicle</th>
                <th className="py-4 px-6">Assigned Driver</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    Loading organizer fleet assignments...
                  </td>
                </tr>
              ) : allTrips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    No scheduled trips or driver deployments found across your events.
                  </td>
                </tr>
              ) : (
                allTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white">{trip.eventTitle}</div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-3 w-3 text-emerald-400" />
                        {trip.originCity} → {trip.destination}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                        {new Date(trip.departureTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {trip.vehicle ? (
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400">
                            <Truck className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white">{trip.vehicle.plateNumber}</div>
                            <div className="text-[10px] text-neutral-400">
                              {trip.vehicle.make} {trip.vehicle.model} ({trip.vehicle.color})
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-amber-400/85 bg-amber-400/10 px-2.5 py-1 rounded-lg text-[10px]">Unassigned Vehicle</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {trip.driver && trip.driver.user ? (
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white">
                              {trip.driver.user.firstName} {trip.driver.user.lastName}
                            </div>
                            <div className="text-[10px] text-neutral-400">{trip.driver.user.phoneNumber}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-amber-400/85 bg-amber-400/10 px-2.5 py-1 rounded-lg text-[10px]">Unassigned Driver</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        trip.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        trip.status === 'IN_PROGRESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-neutral-800 text-neutral-300 border border-neutral-700'
                      }`}>
                        <ShieldCheck className="h-3 w-3" />
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}