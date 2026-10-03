"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSmoothMarker } from "../hooks/useSmoothMarker";

// Custom Leaflet design decorators
const storeIcon = L.divIcon({
  html: `<div style="background-color:#2563eb; color:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:2px solid #fff;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const houseIcon = L.divIcon({
  html: `<div style="background-color:#10b981; color:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:2px solid #fff;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const vehicleIcon = L.divIcon({
  html: `<div style="background-color:#ff3b30; color:#fff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px rgba(255,59,48,0.6); border:3px solid #fff;"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1s.67-1 1.5-1 1.5.67 1.5 1-.67 1-1.5 1zm11 0c-.83 0-1.5-.67-1.5-1s.67-1 1.5-1 1.5.67 1.5 1-.67 1-1.5 1zM5 11l1.27-3.82c.14-.4.52-.68.95-.68h9.56c.43 0 .81.28.95.68L19 11H5z"/></svg></div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapViewManager({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    const validPoints = points.filter(([lat, lng]) => lat !== 0 && lng !== 0 && !isNaN(lat) && !isNaN(lng));
    if (validPoints.length > 0) {
      const bounds = L.latLngBounds(validPoints);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16, animate: true });
    }
  }, [points, map]);
  return null;
}

interface MapProps {
  riderLat: number;
  riderLng: number;
  pickupLat: number;
  pickupLng: number;
  destinationLat: number;
  destinationLng: number;
  status: string;
}

export default function CustomerTrackingMap({
  riderLat,
  riderLng,
  pickupLat,
  pickupLng,
  destinationLat,
  destinationLng,
  status,
}: MapProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  
  // 🌟 Interpolate position changes using the hook to make the marker slide smoothly instead of jumping
  const [smoothLat, smoothLng] = useSmoothMarker(riderLat, riderLng, 800);

  const statusLower = status?.toLowerCase() || "";
  const isHeadingToPickup = ["accepted", "picking_up", "assigned", "arrived_at_pickup"].includes(statusLower);

  // Telemetry street path engine
  useEffect(() => {
    // 🌟 DECOUPLE: Fetch routes based on raw websocket input, but throttle API queries by routing updates gracefully
    const endLat = isHeadingToPickup ? pickupLat : destinationLat;
    const endLng = isHeadingToPickup ? pickupLng : destinationLng;

    if (!riderLat || !riderLng || isNaN(riderLat) || isNaN(riderLng)) return;

    let isMounted = true;
    async function fetchStreetRoute() {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${riderLng},${riderLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (isMounted && data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoordinates(coords);
        }
      } catch (err) {
        console.error("OSRM street routing request failed:", err);
      }
    }

    fetchStreetRoute();
    return () => { isMounted = false; };
  }, [riderLat, riderLng, pickupLat, pickupLng, destinationLat, destinationLng, isHeadingToPickup]);

  // Fallbacks to keep map centered if interpolation hasn't computed initial frames
  const displayLat = smoothLat || riderLat || pickupLat;
  const displayLng = smoothLng || riderLng || pickupLng;

  return (
    <div className="relative w-full h-[480px] bg-[#e5e9f0] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      <MapContainer
        center={[displayLat, displayLng]}
        zoom={14}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapViewManager 
          points={[[displayLat, displayLng], [pickupLat, pickupLng], [destinationLat, destinationLng]]} 
        />

        {routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            color={isHeadingToPickup ? "#2563eb" : "#10b981"} 
            weight={5} 
            opacity={0.85}
            lineJoin="round"
          />
        )}

        {isHeadingToPickup && <Marker position={[pickupLat, pickupLng]} icon={storeIcon} />}
        <Marker position={[destinationLat, destinationLng]} icon={houseIcon} />
        
        {/* 🌟 THIS IS THE REAL-TIME COURIER VEHICLE MARKER */}
        <Marker position={[displayLat, displayLng]} icon={vehicleIcon} />
      </MapContainer>
    </div>
  );
}