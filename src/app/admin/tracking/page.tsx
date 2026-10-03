'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { io, Socket } from 'socket.io-client';
import { api } from '@/src/lib/api';

// Load our map layout client-side only to bypass Server Side Rendering compilation issues
const LiveMapCanvas = dynamic(() => import('../LiveMapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-400 font-mono text-xs tracking-widest uppercase">
      Loading GIS Street Mapping Tiles...
    </div>
  )
});

interface TelemetryRider {
  id: string;
  status: 'PICKUP' | 'DELIVERY' | 'IDLE' | 'OFFLINE';
  latitude: number;
  longitude: number;
  user: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export default function LiveTrackingPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  // Extract base host for Socket.IO (stripping /api or /api/v1 if included in NEXT_PUBLIC_API_URL)
  const socketHost = BACKEND_URL.replace(/\/api(\/v\d+)?\/?$/, '');

  const [ridersMap, setRidersMap] = useState<Record<string, TelemetryRider>>({});
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isConnected, setIsConnected] = useState(false);

  // Parse dictionary tracking values into a flat array mapping stream
  const allRiders = Object.values(ridersMap);

  // Filter list matching active status selections
  const filteredRiders = allRiders.filter((rider) => {
    if (activeFilter === 'ALL') return true;
    return rider.status === activeFilter;
  });

  const selectedRider = ridersMap[selectedRiderId || ''] || null;

  // 1. Reusable fetcher using centralized `api` client
  const syncRealTrackingManifest = useCallback(async () => {
    try {
      const response = await api.get<TelemetryRider[]>('/admin/riders/tracking');
      const databaseRiders = response.data || [];
      
      const nextMap: Record<string, TelemetryRider> = {};
      databaseRiders.forEach((r: TelemetryRider) => {
        nextMap[r.id] = r;
      });

      setRidersMap(nextMap);
    } catch (err) {
      console.error('Failed to fetch active database riders:', err);
    }
  }, []);

  useEffect(() => {
    // 2. Fetch data immediately on component load
    syncRealTrackingManifest();

    // 3. Establish live low-latency WebSocket subscription channel
    const socket: Socket = io(`${socketHost}/admin-operations`, {
      query: { role: 'ADMIN' },
      transports: ['websocket']
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Handle initial fleet snapshots coming directly from socket layer
    socket.on('fleet_snapshot', (snapshot: any[]) => {
      if (snapshot && snapshot.length > 0) {
        // If snapshot data arrives, re-verify data matching database structures
        syncRealTrackingManifest();
      } else {
        // Clear screen if fleet snapshot states show absolutely empty streams
        setRidersMap({});
      }
    });

    // 4. Listen for real-time high-frequency streaming updates sent by mobile app client
    socket.on('fleet_telemetry_stream', (payload: any) => {
      setRidersMap((prev) => {
        // Check if we already have the rider profile details loaded in our map state
        if (prev[payload.riderId]) {
          return {
            ...prev,
            [payload.riderId]: {
              ...prev[payload.riderId],
              latitude: payload.latitude,
              longitude: payload.longitude,
              status: payload.status || (payload.shipmentId ? 'DELIVERY' : 'IDLE')
            }
          };
        } else {
          // If a new rider suddenly goes online, pull their complete profile from database
          syncRealTrackingManifest();
          return prev;
        }
      });
    });

    // Handle rider going offline event triggers
    socket.on('rider_offline', (data: { riderId: string }) => {
      setRidersMap((prev) => {
        const copy = { ...prev };
        delete copy[data.riderId];
        return copy;
      });
      
      setSelectedRiderId((currentSelected) => (currentSelected === data.riderId ? null : currentSelected));
    });

    return () => {
      socket.disconnect();
    };
  }, [socketHost, syncRealTrackingManifest]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col -mt-6 -mx-6 relative bg-neutral-900 overflow-hidden">
      {/* Top Filter HUD Layer & Connection Status Indicator */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 max-w-[calc(100%-32px)]">
        {[
          { key: 'ALL', label: `All Fleets (${allRiders.length})`, className: 'bg-neutral-950 text-white border-neutral-800' },
          { key: 'PICKUP', label: 'On Pick Up', className: 'bg-blue-600 text-white border-blue-500' },
          { key: 'DELIVERY', label: 'On Delivery', className: 'bg-emerald-600 text-white border-emerald-500' },
          { key: 'IDLE', label: 'Idle / Available', className: 'bg-amber-500 text-white border-amber-400' }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveFilter(btn.key)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-xl cursor-pointer transition-all duration-150 active:scale-95 ${
              activeFilter === btn.key
                ? `${btn.className} ring-2 ring-white/20`
                : 'bg-neutral-900/90 text-neutral-400 border-neutral-800 backdrop-blur-md hover:text-white'
            }`}
          >
            {btn.label}
          </button>
        ))}

        {/* Live Stream Pulse Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-neutral-800 backdrop-blur-md shadow-xl text-[10px] font-mono text-neutral-400">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          {isConnected ? 'LIVE FEED' : 'RECONNECTING'}
        </div>
      </div>

      {/* Primary Real Street Map Canvas Output Layer */}
      <div className="flex-1 w-full h-full">
        <LiveMapCanvas 
          riders={filteredRiders} 
          onSelectRider={setSelectedRiderId} 
          selectedRiderId={selectedRiderId} 
        />
      </div>

      {/* Selected Action Drawer Details Component */}
      {selectedRider && (
        <div className="absolute bottom-0 w-full bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-md rounded-t-3xl p-6 shadow-2xl z-20 animate-in slide-in-from-bottom-10 duration-200">
          <div className="flex justify-between items-start mb-5">
            <div>
              <span className={`inline-block text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md mb-2 ${
                selectedRider.status === 'DELIVERY' 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                  : selectedRider.status === 'PICKUP' 
                  ? 'bg-blue-950 text-blue-400 border border-blue-800' 
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                Rider Status: {selectedRider.status}
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                {selectedRider.user?.firstName} {selectedRider.user?.lastName}
              </h2>
              <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                ID: {selectedRider.id} | Lat: {selectedRider.latitude.toFixed(4)} Lng: {selectedRider.longitude.toFixed(4)}
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setSelectedRiderId(null)} 
              className="text-neutral-500 hover:text-white font-black text-sm p-2 border border-neutral-800 rounded-xl bg-neutral-900 cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
          
          {selectedRider.user?.phone && (
            <a 
              href={`tel:${selectedRider.user.phone}`} 
              className="block w-full py-3.5 bg-white text-neutral-950 text-center rounded-xl font-black text-xs uppercase tracking-wider transition-all hover:bg-neutral-200 active:scale-[0.99]"
            >
              Establish Secure Voice Link ({selectedRider.user.phone})
            </a>
          )}
        </div>
      )}
    </div>
  );
}