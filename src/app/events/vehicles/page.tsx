'use client';

import React, { useEffect, useState } from 'react';
import { Bus, Search, ShieldCheck, MapPin, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/src/lib/api';

interface TripVehicleData {
  tripId: string;
  tripLeg: string;
  status: string;
  departureTime: string;
  arrivalTime: string;
  route: {
    routeId: string;
    originCity: string;
    destination: string;
    price: number;
  };
  vehicle: {
    id: string;
    name: string;
    type: string;
    plateNumber: string;
    isVerified: boolean;
  } | null;
  driver: {
    riderProfileId: string;
    name: string;
    phoneNumber: string;
    avatarUrl: string | null;
    rating: number;
    isOnline: boolean;
  } | null;
}

interface EventVehicleResponse {
  eventId: string;
  eventTitle: string;
  totalTrips: number;
  assignedVehiclesCount: number;
  trips: TripVehicleData[];
}

interface EventOption {
  id: string;
  title: string;
}

export default function VehiclesPage() {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [eventData, setEventData] = useState<EventVehicleResponse | null>(null);
  
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // 1. Fetch organizer events on mount to populate the event selector
  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await api.get('/events/organizer');
        const eventList = response.data || [];
        setEvents(eventList);
        if (eventList.length > 0) {
          setSelectedEventId(eventList[0].id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load organizer events.');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchOrganizerEvents();
  }, []);

  // 2. Fetch vehicles & drivers whenever selectedEventId changes using your exact endpoint
  useEffect(() => {
    if (!selectedEventId) return;

    const fetchEventVehicles = async () => {
      try {
        setLoadingVehicles(true);
        setError('');
        const response = await api.get(`/events/${selectedEventId}/vehicles`);
        setEventData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load assigned vehicles for this event.');
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchEventVehicles();
  }, [selectedEventId]);

  const filteredTrips = eventData?.trips.filter((t) => {
    const query = searchQuery.toLowerCase();
    const plate = t.vehicle?.plateNumber?.toLowerCase() || '';
    const model = t.vehicle?.name?.toLowerCase() || '';
    const driverName = t.driver?.name?.toLowerCase() || '';
    const origin = t.route.originCity.toLowerCase();
    const destination = t.route.destination.toLowerCase();

    return (
      plate.includes(query) ||
      model.includes(query) ||
      driverName.includes(query) ||
      origin.includes(query) ||
      destination.includes(query)
    );
  }) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Page Header & Event Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white uppercase font-mono tracking-tight">Event Fleet & Assigned Drivers</h1>
          <p className="text-xs text-neutral-400">Monitor vehicles and drivers assigned to trip routes for your events.</p>
        </div>

        {/* Event Selector Dropdown */}
        <div className="flex items-center gap-2 bg-[#0e131f] border border-neutral-800 rounded-2xl px-4 py-2">
          <span className="text-[11px] font-mono text-neutral-400 uppercase">Event:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={loadingEvents || events.length === 0}
            className="bg-transparent text-xs font-mono text-white focus:outline-none cursor-pointer"
          >
            {loadingEvents ? (
              <option>Loading events...</option>
            ) : events.length === 0 ? (
              <option>No events found</option>
            ) : (
              events.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-neutral-900 text-white">
                  {ev.title}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0e131f] border border-neutral-800/80 rounded-2xl p-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by plate, vehicle model, driver, or route..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        {eventData && (
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <div>Total Trips: <span className="text-white font-bold">{eventData.totalTrips}</span></div>
            <div>Assigned Vehicles: <span className="text-emerald-400 font-bold">{eventData.assignedVehiclesCount}</span></div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 font-mono flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Data Table */}
      {loadingVehicles ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-xs font-mono text-neutral-400 animate-pulse">Syncing event transport manifest...</p>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/50 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  <th className="py-4 px-5">Route & Leg</th>
                  <th className="py-4 px-5">Vehicle & Plate</th>
                  <th className="py-4 px-5">Assigned Driver</th>
                  <th className="py-4 px-5">Departure Time</th>
                  <th className="py-4 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs font-mono">
                {filteredTrips.map((trip) => (
                  <tr key={trip.tripId} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        {trip.route.originCity} → {trip.route.destination}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">Leg: {trip.tripLeg}</div>
                    </td>

                    <td className="py-4 px-5">
                      {trip.vehicle ? (
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {trip.vehicle.name}
                            {trip.vehicle.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">{trip.vehicle.plateNumber}</div>
                        </div>
                      ) : (
                        <span className="text-neutral-500 italic">No vehicle assigned</span>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      {trip.driver ? (
                        <div className="flex items-center gap-2.5">
                          {trip.driver.avatarUrl ? (
                            <img src={trip.driver.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-neutral-800" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-400">
                              <User className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white">{trip.driver.name}</div>
                            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {trip.driver.phoneNumber}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-neutral-500 italic">No driver claimed job</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-neutral-300">
                      {new Date(trip.departureTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>

                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        trip.status === 'SCHEDULED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-neutral-800/50 text-neutral-400 border border-neutral-700'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#0e131f] border border-neutral-800/80 rounded-3xl p-12 text-center space-y-4">
          <Bus className="h-10 w-10 text-neutral-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono">No Trips Found for This Event</h3>
            <p className="text-xs text-neutral-400">Schedule trips and assign drivers/vehicles to see them populated here automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
}