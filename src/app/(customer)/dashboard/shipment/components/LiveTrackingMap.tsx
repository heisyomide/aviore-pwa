"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  riderLat: number;
  riderLng: number;
  pickupLat: number;
  pickupLng: number;
  destinationLat: number;
  destinationLng: number;
  status: string;
}

// Custom hook/component to keep the camera locked smoothly onto the moving rider
function MapAutoPan({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.panTo([lat, lng], { animate: true, duration: 1 });
    }
  }, [lat, lng, map]);
  return null;
}

// Premium visual asset configurations
const riderIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", // Delivery bike
  iconSize: [42, 42],
  iconAnchor: [21, 42],
});

const storeIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/609/609803.png", // Hub/Store
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const homeIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1673/1673221.png", // Customer Home
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

export default function CustomerTrackingMap({
  riderLat,
  riderLng,
  pickupLat,
  pickupLng,
  destinationLat,
  destinationLng,
  status,
}: Props) {
  const [streetRoute, setStreetRoute] = useState<[number, number][]>([]);

  const statusLower = status?.toLowerCase() || "";
  const isHeadingToPickup = ["accepted", "picking_up", "assigned", "arrived_at_pickup"].includes(statusLower);

  // Determine the rider's immediate target destination based on dispatch lifecycle
  const targetLat = isHeadingToPickup ? pickupLat : destinationLat;
  const targetLng = isHeadingToPickup ? pickupLng : destinationLng;

  // Fetch the real street network geometry from OpenStreetMap OSRM Routing Engine
  useEffect(() => {
    if (!riderLat || !riderLng || !targetLat || !targetLng) return;

    async function fetchStreetRoute() {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${riderLng},${riderLat};${targetLng},${targetLat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          // OSRM returns coordinates as [lng, lat], Leaflet needs [lat, lng]
          const coords = data.routes[0].geometry.coordinates.map((coord: number[]) => [
            coord[1],
            coord[0],
          ]) as [number, number][];
          
          setStreetRoute(coords);
        }
      } catch (err) {
        console.error("Routing engine error, falling back to straight path:", err);
        setStreetRoute([[riderLat, riderLng], [targetLat, targetLng]]);
      }
    }

    fetchStreetRoute();
  }, [riderLat, riderLng, targetLat, targetLng]);

  return (
    <div className="h-[450px] w-full relative z-10 overflow-hidden rounded-t-2xl border-b border-neutral-100">
      <MapContainer
        center={[riderLat, riderLng]}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapAutoPan lat={riderLat} lng={riderLng} />

        {/* 1. The Moving Rider */}
        <Marker position={[riderLat, riderLng]} icon={riderIcon}>
          <Popup><div className="text-xs font-bold">Courier is here</div></Popup>
        </Marker>

        {/* 2. The Merchant Hub / Pickup Point */}
        <Marker position={[pickupLat, pickupLng]} icon={storeIcon}>
          <Popup><span className="text-xs font-medium">Pickup Point</span></Popup>
        </Marker>

        {/* 3. The Customer Home Address */}
        <Marker position={[destinationLat, destinationLng]} icon={homeIcon}>
          <Popup><span className="text-xs font-medium">Your Delivery Address</span></Popup>
        </Marker>

        {/* 4. Real-time Street-locked Routing Line */}
        {streetRoute.length > 0 && (
          <Polyline
            positions={streetRoute}
            pathOptions={{
              color: isHeadingToPickup ? "#3b82f6" : "#10b981", // Blue for pickup path, green for final transit path
              weight: 5,
              opacity: 0.85,
              lineJoin: "round",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}