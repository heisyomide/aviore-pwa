"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io, Socket } from "socket.io-client";
import type { ShipmentDetails } from "../types";
import { voiceAssistant, RouteStep } from "../../../../../../utils/pwaVoiceAssistant";

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

// Injecting true Google Maps blue flashlight & breathing ring styles
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
      top: -45px;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle at 50% 100%, rgba(0, 122, 255, 0.45) 0%, rgba(0, 122, 255, 0.05) 75%, transparent 100%);
      clip-path: polygon(15% 0%, 85% 0%, 50% 100%);
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

export default function LiveMap({ shipment, authToken }: { shipment: ShipmentDetails; authToken?: string }) {
  const statusUpper = shipment.status || "PENDING";
  const isTripActive = ["ACCEPTED", "ARRIVED_AT_PICKUP", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(statusUpper);
  const isHeadingToPickup = ["ACCEPTED", "ARRIVED_AT_PICKUP"].includes(statusUpper);

  // Core hardware telemetry state hooks
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [gpsError, setGpsError] = useState<string>("");

  // Voice Navigation State Hooks
  const [navSteps, setNavSteps] = useState<RouteStep[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const pickupLat = Number(shipment.pickup?.latitude || 0);
  const pickupLng = Number(shipment.pickup?.longitude || 0);
  const destinationLat = Number(shipment.destination?.latitude || 0);
  const destinationLng = Number(shipment.destination?.longitude || 0);

  const targetLat = isHeadingToPickup ? pickupLat : destinationLat;
  const targetLng = isHeadingToPickup ? pickupLng : destinationLng;

  const activeLat = myLocation?.lat ?? pickupLat;
  const activeLng = myLocation?.lng ?? pickupLng;

  // 1. FETCH VOICE ROUTE STEPS FROM BACKEND
  useEffect(() => {
    if (!shipment?.id || !isTripActive) return;

    async function fetchVoiceRoute() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/shipments/${shipment.id}/navigation-route`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data?.steps) {
          setNavSteps(data.steps);
        }
      } catch (err) {
        console.error("Failed to fetch voice navigation steps:", err);
      }
    }

    fetchVoiceRoute();
  }, [shipment?.id, isTripActive, authToken]);

  // 2. HARDWARE TELEMETRY + VOICE PROMPT CHECKER ENGINE
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsError("Geolocation unsupported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;

        setMyLocation({
          lat: currentLat,
          lng: currentLng,
        });

        if (position.coords.heading !== null && position.coords.heading !== undefined) {
          setCompassHeading(position.coords.heading);
        }
        setGpsError("");

        // Trigger voice prompt check when location updates
        if (isNavigating && navSteps.length > 0) {
          voiceAssistant.checkProximityAndPrompt(currentLat, currentLng);
        }
      },
      (error) => {
        console.error("GPS Error Code: " + error.code, error.message);
        setGpsError(`GPS Error: ${error.message} (Ensure Location is Enabled)`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isNavigating, navSteps]);

  // 3. HARDWARE COMPASS ENGINE
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const heading = (e as any).webkitCompassHeading || (e.alpha ? 360 - e.alpha : 0);
      setCompassHeading(Math.round(heading));
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => window.removeEventListener("deviceorientation", handleOrientation, true);
  }, []);

  // Initialize Socket Connection
  useEffect(() => {
    socket = io(getSocketUrl(), {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Stream true coordinates to Backend Gateway
  useEffect(() => {
    if (!myLocation || !shipment.id || !isTripActive || !socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("rider:updateLocation", {
      shipmentId: shipment.id,
      latitude: myLocation.lat,
      longitude: myLocation.lng,
      heading: compassHeading,
    });
  }, [myLocation, shipment.id, isTripActive, compassHeading]);

  // Calculate high-fidelity road lines path
  useEffect(() => {
    if (!myLocation || !isTripActive || statusUpper === "DELIVERED") {
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
        console.error("Rider street path routing failed:", err);
      }
    }

    fetchRiderRoute();
  }, [activeLat, activeLng, targetLat, targetLng, isTripActive, statusUpper, myLocation]);

  // Handle Start Voice Nav
  const toggleVoiceNavigation = () => {
    if (!isNavigating) {
      voiceAssistant.startNavigation(navSteps);
      setIsNavigating(true);
    } else {
      voiceAssistant.stopNavigation();
      setIsNavigating(false);
    }
  };

  const handleToggleMute = () => {
    const muted = voiceAssistant.toggleMute();
    setIsMuted(muted);
  };

  const blueFlashlightIcon = L.divIcon({
    html: `
      <div class="gps-container">
        <div class="gps-beam" style="transform: rotate(${compassHeading}deg);"></div>
        <div class="gps-pulse-ring"></div>
        <div class="gps-dot"></div>
      </div>
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <div className="relative w-full h-full min-h-105">
      
      {/* Visual Diagnostic Banner */}
      <div className="absolute top-4 left-4 z-1000 bg-black/85 backdrop-blur-md px-3 py-2 rounded-lg text-[11px] font-mono border border-neutral-800 text-white flex flex-col gap-1 shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${myLocation ? "bg-emerald-500 animate-pulse" : "bg-rose-500 animate-ping"}`}></span>
          <span className="font-bold">GPS: {myLocation ? "LIVE ACCURATE DATA" : "ACQUIRING..."}</span>
        </div>
        {gpsError && <div className="text-rose-400 font-bold max-w-50">{gpsError}</div>}
        <div>Lat: {myLocation ? myLocation.lat.toFixed(6) : "Fetching hardware..."}</div>
        <div>Lng: {myLocation ? myLocation.lng.toFixed(6) : "Fetching hardware..."}</div>
        <div>Heading Angle: {compassHeading}°</div>
      </div>

      {/* VOICE NAVIGATION HUD OVERLAY */}
      {isTripActive && navSteps.length > 0 && (
        <div className="absolute top-4 right-4 z-1000 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 text-white p-3 rounded-xl shadow-2xl flex items-center gap-3">
          <button
            onClick={toggleVoiceNavigation}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
              isNavigating ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            }`}
          >
            {isNavigating ? "🔊 Voice Active" : "🔈 Start Voice"}
          </button>

          {isNavigating && (
            <button
              onClick={handleToggleMute}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 p-1.5 rounded-lg text-xs"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          )}
        </div>
      )}

      {/* MAP CANVAS */}
      <MapContainer center={[activeLat, activeLng]} zoom={17} zoomControl={false} className="w-full h-full min-h-105">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapFocusUpdater center={[activeLat, activeLng]} />

        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="#007aff" weight={6} opacity={0.85} />
        )}

        <Marker position={[targetLat, targetLng]} icon={targetDestinationIcon} />
        <Marker position={[activeLat, activeLng]} icon={blueFlashlightIcon} />
      </MapContainer>
    </div>
  );
}