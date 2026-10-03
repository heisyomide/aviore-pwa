'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Resolve missing marker asset bugs caused by Next.js building rules
import 'leaflet/dist/leaflet.css';

interface TelemetryRider {
  id: string;
  status: 'PICKUP' | 'DELIVERY' | 'IDLE' | 'OFFLINE';
  latitude: number;
  longitude: number;
  user: { firstName: string; lastName: string; phone: string; };
}

interface MapProps {
  riders: TelemetryRider[];
  onSelectRider: (id: string) => void;
  selectedRiderId: string | null;
}

// Map status enum states to physical dashboard colors
const STATUS_META = {
  PICKUP: { color: '#3b82f6', label: 'Assigned / On Pick Up' },   // Blue
  DELIVERY: { color: '#10b981', label: 'Active En-Route Delivery' }, // Green
  IDLE: { color: '#f59e0b', label: 'Idle / Available' },        // Orange
  OFFLINE: { color: '#6b7280', label: 'Offline Mode' }         // Grey
};

// Generates an interactive SVG Pin dynamically matching color-code requirements
const createCustomMarkerIcon = (status: 'PICKUP' | 'DELIVERY' | 'IDLE' | 'OFFLINE', label: string) => {
  const color = STATUS_META[status]?.color || '#6b7280';
  
  const svgHtml = `
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
    </svg>
    <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #171717; color: white; font-size: 8px; font-family: monospace; font-weight: bold; padding: 2px 5px; border-radius: 4px; white-space: nowrap; border: 1px solid rgba(255,255,255,0.15)">
      ${label}
    </div>
  `;

  return L.divIcon({
    className: 'custom-rider-marker',
    html: svgHtml,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Dynamic map view controller that repositions viewports to look at the selected courier
function MapRecenterHook({ activeRider }: { activeRider: TelemetryRider | null }) {
  const map = useMap();
  useEffect(() => {
    if (activeRider) {
      map.setView([activeRider.latitude, activeRider.longitude], 15, { animate: true });
    }
  }, [activeRider, map]);
  return null;
}

export default function LiveMapCanvas({ riders, onSelectRider, selectedRiderId }: MapProps) {
  const selectedRider = riders.find(r => r.id === selectedRiderId) || null;
  
  // Set default view boundary coordinates (e.g. Lagos coordinates, change to your operational hub city)
  const defaultCenter: [number, number] = [6.4281, 3.4219];

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        {/* Street Tiles Layer Map Data Wrapper */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Loop and draw riders maps using real geographic vectors */}
        {riders.map((rider) => (
          <Marker
            key={rider.id}
            position={[rider.latitude, rider.longitude]}
            icon={createCustomMarkerIcon(rider.status, rider.user.firstName)}
            eventHandlers={{
              click: () => onSelectRider(rider.id)
            }}
          >
            <Popup>
              <div className="p-1 font-sans">
                <p className="font-bold text-neutral-900 text-sm">{rider.user.firstName} {rider.user.lastName}</p>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">Status: <span className="font-bold uppercase" style={{ color: STATUS_META[rider.status]?.color }}>{rider.status}</span></p>
                <p className="text-xs text-neutral-500 font-mono">{rider.user.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapRecenterHook activeRider={selectedRider} />
      </MapContainer>
    </div>
  );
}