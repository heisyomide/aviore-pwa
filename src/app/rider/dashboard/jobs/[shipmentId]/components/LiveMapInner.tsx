"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io, Socket } from "socket.io-client";
import { useRiderTelemetry } from "../../../hooks/useRiderTelemetry";
import type { ShipmentDetails } from "../types";

const getSocketUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    if (envUrl && envUrl.includes("localhost")) {
      return `http://${window.location.hostname}:5000`;
    }
    if (envUrl) return envUrl;
    return `http://${window.location.hostname}:5000`;
  }
  return envUrl || "http://localhost:5000";
};

let socket: Socket;

if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes gpsPulse {
      0% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.5); }
      70% { transform: scale(1); opacity: 0.2; box-shadow: 0 0 0 20px rgba(0, 122, 255, 0); }
      100% { transform: scale(0.8); opacity: 0; box-shadow: 0 0 0 0 rgba(0, 122, 255, 0); }
    }
    .gps-container {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .gps-beam {
      position: absolute;
      top: -35px;
      width: 90px;
      height: 90px;
      background: radial-gradient(circle at 50% 100%, rgba(0, 122, 255, 0.45) 0%, rgba(0, 122, 255, 0.05) 75%, transparent 100%);
      clip-path: polygon(20% 0%, 80% 0%, 50% 100%);
      transform-origin: 50% 100%;
      transition: transform 0.1s linear;
      pointer-events: none;
    }
    .gps-dot {
      width: 16px;
      height: 16px;
      background-color: #007aff;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      z-index: 2;
    }
    .gps-pulse-ring {
      position: absolute;
      width: 32px;
      height: 32px;
      background-color: rgba(0, 122, 255, 0.25);
      border-radius: 50%;
      animation: gpsPulse 2.2s infinite ease-out;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);
}

const targetDestinationIcon = L.divIcon({
  html: `<div style="background-color:#000; color:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.3); border:2px solid #fff;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></div>`,
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

export default function LiveMapInner({ shipment }: { shipment: ShipmentDetails }) {
  const statusUpper = shipment.status || "PENDING";
  const isTripActive = ["ACCEPTED", "ARRIVED_AT_PICKUP", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(statusUpper);
  const isHeadingToPickup = ["ACCEPTED", "ARRIVED_AT_PICKUP"].includes(statusUpper);

  const { coords } = useRiderTelemetry(isTripActive);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);

  const pickupLat = Number(shipment.pickup?.latitude || 0);
  const pickupLng = Number(shipment.pickup?.longitude || 0);
  const destinationLat = Number(shipment.destination?.latitude || 0);
  const destinationLng = Number(shipment.destination?.longitude || 0);

  const targetLat = isHeadingToPickup ? pickupLat : destinationLat;
  const targetLng = isHeadingToPickup ? pickupLng : destinationLng;

  const activeLat = coords?.latitude ?? pickupLat;
  const activeLng = coords?.longitude ?? pickupLng;

  // Use phone's direct hardware compass if GPS velocity heading is null
  const displayHeading = coords?.heading !== null && coords?.heading !== undefined ? coords.heading : compassHeading;

  // Listen to physical phone orientation changes (turning left/right while standing still)
  useEffect(() => {
    if (!isTripActive || typeof window === "undefined") return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading is the native iOS angle value
      const heading = (e as any).webkitCompassHeading || (e.alpha ? 360 - e.alpha : 0);
      setCompassHeading(Math.round(heading));
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => window.removeEventListener("deviceorientation", handleOrientation, true);
  }, [isTripActive]);

  useEffect(() => {
    socket = io(getSocketUrl(), {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!coords || !shipment.id || !isTripActive || !socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("rider:updateLocation", {
      shipmentId: shipment.id,
      latitude: coords.latitude,
      longitude: coords.longitude,
      heading: displayHeading,
    });
  }, [coords, shipment.id, isTripActive, displayHeading]);

  useEffect(() => {
    if (!isTripActive || statusUpper === "DELIVERED") {
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
        console.error("Rider path routing failed:", err);
      }
    }

    fetchRiderRoute();
  }, [activeLat, activeLng, targetLat, targetLng, isTripActive, statusUpper]);

  const blueFlashlightIcon = L.divIcon({
    html: `
      <div class="gps-container">
        <div class="gps-beam" style="transform: rotate(${displayHeading}deg);"></div>
        <div class="gps-pulse-ring"></div>
        <div class="gps-dot"></div>
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <div className="relative w-full h-full">
      {/* Real-time Tracking Diagnostic Telemetry Card */}
      <div className="absolute top-4 left-4 z-[1000] bg-black/80 backdrop-blur-md px-3 py-2 rounded-lg text-xs font-mono border border-neutral-800 text-white flex flex-col gap-1 shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${coords ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
          <span>GPS Status: {coords ? "TRACKING" : "WAITING"}</span>
        </div>
        <div>Lat: {coords?.latitude ? coords.latitude.toFixed(6) : "Fetching..."}</div>
        <div>Lng: {coords?.longitude ? coords.longitude.toFixed(6) : "Fetching..."}</div>
        <div>Beam Rotation: {displayHeading}°</div>
      </div>

      <MapContainer center={[activeLat, activeLng]} zoom={17} zoomControl={false} className="w-full h-full">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapFocusUpdater center={[activeLat, activeLng]} />

        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="#ff3b30" weight={5} opacity={0.85} />
        )}

        <Marker position={[targetLat, targetLng]} icon={targetDestinationIcon} />
        <Marker position={[activeLat, activeLng]} icon={blueFlashlightIcon} />
      </MapContainer>
    </div>
  );
}