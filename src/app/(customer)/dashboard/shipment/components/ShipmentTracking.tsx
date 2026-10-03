"use client";

import dynamic from "next/dynamic";
import { MapPin, Package, Activity, Loader2, Bike } from "lucide-react";
import type { Shipment, LiveLocation } from "../types";

// 🌟 SSR: FALSE - This dynamic loading container strips out the mapping engine from server compilation entirely to fix the "window is not defined" crash
const CustomerTrackingMap = dynamic(() => import("./CustomerTrackingMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] bg-neutral-100 flex flex-col items-center justify-center text-neutral-400 font-medium animate-pulse border border-neutral-200 rounded-2xl">
      <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mb-2" />
      <span>Initializing Live Telemetry Stream...</span>
    </div>
  )
});

interface TrackingShipment extends Omit<Shipment, "rider"> {
  rider?: {
    id: string;
    name?: string;
    phone?: string;
    lastLat?: string | number | null;
    lastLng?: string | number | null;
  } | null;
}

interface Props {
  shipment: TrackingShipment;
  liveLocation: LiveLocation | null;
}

function FindingRiderOverlay() {
  return (
    <div className="flex h-[480px] w-full items-center justify-center bg-gradient-to-br from-neutral-900 to-black text-white border border-neutral-800 rounded-2xl shadow-sm">
      <div className="max-w-sm text-center px-4">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold">Finding Your Rider</h2>
        <p className="mt-3 text-sm text-neutral-300 leading-6">Please wait while we assign the nearest delivery partner to your shipment.</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <Bike className="text-green-400" />
            <div className="text-left">
              <p className="font-semibold">Searching Nearby Riders</p>
              <p className="text-xs text-neutral-400">This usually takes less than 2 minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function computeHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function ShipmentTracking({ shipment, liveLocation }: Props) {
  const statusLower = shipment.status?.toLowerCase() || "";
  const isHeadingToPickup = ["accepted", "picking_up", "assigned", "arrived_at_pickup"].includes(statusLower);

  if (statusLower === "pending") return <FindingRiderOverlay />;

  if (statusLower === "delivered") {
    return (
      <div className="w-full h-[480px] bg-neutral-50 flex flex-col items-center justify-center text-neutral-500 border border-neutral-200 rounded-2xl shadow-sm">
        <div className="bg-emerald-50 p-4 rounded-full mb-3 text-emerald-600 border border-emerald-100">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <span className="font-black text-neutral-800 tracking-tight text-lg">Package Delivered Successfully</span>
        <p className="text-xs text-neutral-400 mt-1">Thank you for using AviorèGo logistics systems.</p>
      </div>
    );
  }

  // 🌟 READ WEBSOCKET DATA STREAM DIRECTLY: If liveLocation exists, use it instantly. 
  // Else, default back to rider's last known position database records.
  const currentRiderLat = liveLocation?.latitude 
    ? Number(liveLocation.latitude) 
    : (shipment.rider?.lastLat ? Number(shipment.rider.lastLat) : Number(shipment.pickupLat) - 0.0012);

  const currentRiderLng = liveLocation?.longitude 
    ? Number(liveLocation.longitude) 
    : (shipment.rider?.lastLng ? Number(shipment.rider.lastLng) : Number(shipment.pickupLng) - 0.0012);

  const targetLat = isHeadingToPickup ? Number(shipment.pickupLat) : Number(shipment.destinationLat);
  const targetLng = isHeadingToPickup ? Number(shipment.pickupLng) : Number(shipment.destinationLng);
  
  const remainingDistanceKm = computeHaversineDistance(currentRiderLat, currentRiderLng, targetLat, targetLng);
  const dynamicRemainingMinutes = Math.max(1, Math.round((remainingDistanceKm / 22) * 60));

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
      <div className="bg-neutral-900 px-6 py-3.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-green-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
            {isHeadingToPickup ? "Courier Heading to Merchant Store" : "Courier Heading to Your Address"}
          </span>
        </div>
        <span className="text-xs font-medium text-neutral-400">Status: <span className="text-white font-black capitalize">{statusLower.replaceAll("_", " ")}</span></span>
      </div>

      <CustomerTrackingMap
        riderLat={currentRiderLat}
        riderLng={currentRiderLng}
        pickupLat={Number(shipment.pickupLat)}
        pickupLng={Number(shipment.pickupLng)}
        destinationLat={Number(shipment.destinationLat)}
        destinationLng={Number(shipment.destinationLng)}
        status={shipment.status}
      />

      <div className="grid gap-6 p-6 md:grid-cols-3 border-t border-neutral-100 bg-neutral-50/50">
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Arrival Estimate</span>
          <p className="mt-2 text-3xl font-black text-blue-900">{dynamicRemainingMinutes} <span className="text-lg font-bold">mins</span></p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Remaining Range</span>
          <p className="mt-2 text-3xl font-black text-emerald-900">{remainingDistanceKm.toFixed(2)} <span className="text-lg font-bold">km</span></p>
        </div>
        <div className="rounded-xl bg-white border border-neutral-200 p-5 space-y-3">
          <div className="flex gap-2 items-start text-xs">
            <MapPin size={16} className={`shrink-0 ${isHeadingToPickup ? "text-blue-500 animate-bounce" : "text-neutral-400"}`} />
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Pickup Hub</p>
              <p className="font-semibold text-neutral-700 truncate max-w-45">{shipment.pickupAddress}</p>
            </div>
          </div>
          <div className="flex gap-2 items-start text-xs pt-2 border-t border-neutral-100">
            <Package size={16} className={`shrink-0 ${!isHeadingToPickup ? "text-emerald-500 animate-bounce" : "text-neutral-400"}`} />
            <div>
              <p className="text-[10px] uppercase font-bold text-neutral-400">Destination Address</p>
              <p className="font-semibold text-neutral-700 truncate max-w-45">{shipment.destinationAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}