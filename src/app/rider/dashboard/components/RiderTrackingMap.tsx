"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "@/src/lib/socket";
import { useRiderTelemetry } from "../hooks/useRiderTelemetry";

const riderVehicleIcon = L.divIcon({
  html: `<div style="background-color:#ff3b30; color:#fff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px rgba(255,59,48,0.6); border:3px solid #fff;"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1s.67-1 1.5-1 1.5.67 1.5 1-.67 1-1.5 1zm11 0c-.83 0-1.5-.67-1.5-1s.67-1 1.5-1 1.5.67 1.5 1-.67 1-1.5 1zM5 11l1.27-3.82c.14-.4.52-.68.95-.68h9.56c.43 0 .81.28.95.68L19 11H5z"/></svg></div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const targetDestinationIcon = L.divIcon({
  html: `<div style="background-color:#000; color:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:2px solid #fff;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapFocusUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

interface RiderMapProps {
  shipmentId: string;
  pickupLat: number;
  pickupLng: number;
  destinationLat: number;
  destinationLng: number;
  status: string;
}

export default function RiderTrackingMap({
  shipmentId,
  pickupLat,
  pickupLng,
  destinationLat,
  destinationLng,
  status,
}: RiderMapProps) {
  const statusLower = status?.toLowerCase() || "";
  const isTripActive = ["accepted", "picking_up", "assigned", "arrived_at_pickup", "delivering"].includes(statusLower);
  const isHeadingToPickup = ["accepted", "picking_up", "assigned", "arrived_at_pickup"].includes(statusLower);

  // 1. Initialize high-accuracy continuous background GPS engine
  const { coords } = useRiderTelemetry(isTripActive);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  // Toggle route targets dynamically based on order lifecycle phase
  const targetLat = isHeadingToPickup ? pickupLat : destinationLat;
  const targetLng = isHeadingToPickup ? pickupLng : destinationLng;

  const activeLat = coords?.latitude ?? pickupLat;
  const activeLng = coords?.longitude ?? pickupLng;

  // 2. TRANSMITTER BROADCAST: Push fresh coordinates down WebSockets the exact second GPS shifts
  useEffect(() => {
    if (!coords || !shipmentId || !isTripActive) return;

    socket.connect();
    socket.emit("rider:updateLocation", {
      shipmentId,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  }, [coords, shipmentId, isTripActive]);

  // 3. OSRM Street Route Drawer for Rider Perspective
  useEffect(() => {
    if (!isTripActive || statusLower === "delivered") {
      setRouteCoordinates([]);
      return;
    }

    async function fetchRiderRoute() {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${activeLng},${activeLat};${targetLng},${targetLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const points = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoordinates(points);
        }
      } catch (err) {
        console.error("Rider OSRM routing failed:", err);
      }
    }

    fetchRiderRoute();
  }, [activeLat, activeLng, targetLat, targetLng, isTripActive, statusLower]);

  if (statusLower === "delivered") {
    return (
      <div className="w-full h-[480px] bg-neutral-50 flex flex-col items-center justify-center text-neutral-500 border border-neutral-200 rounded-2xl shadow-sm">
        <div className="bg-emerald-50 p-4 rounded-full mb-3 text-emerald-600 border border-emerald-100">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <span className="font-black text-neutral-800 tracking-tight text-lg">Shipment Successfully Delivered</span>
        <p className="text-xs text-neutral-400 mt-1">Telemetry stream synchronized and closed.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[480px] bg-[#e5e9f0] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
      <MapContainer center={[activeLat, activeLng]} zoom={15} zoomControl={false} className="w-full h-full">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapFocusUpdater center={[activeLat, activeLng]} />

        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="#ff3b30" weight={5} opacity={0.7} />
        )}

        {/* Dynamic Destination Pin */}
        <Marker position={[targetLat, targetLng]} icon={targetDestinationIcon} />

        {/* Rider's moving vehicle marker */}
        <Marker position={[activeLat, activeLng]} icon={riderVehicleIcon} />
      </MapContainer>
    </div>
  );
}