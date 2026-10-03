"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { socket } from "@/src/lib/socket";
import { ShipmentService } from "../services/shipments.service";
import { MessageSquare } from "lucide-react";

import ShipmentDetailsHeader from "../components/ShipmentDetailsHeader";
import ShipmentTracking from "../components/ShipmentTracking";
import ShipmentDetails from "../components/ShipmentDetails";
import ShipmentTimeline from "../components/ShipmentTimeline";

import type { LiveLocation, Shipment } from "../types";

interface TrackingShipment extends Omit<Shipment, "rider"> {
  verificationPin?: string;
  rider?: {
    id: string;
    name?: string;
    phone?: string;
    lastLat?: string | number | null;
    lastLng?: string | number | null;
  } | null;
}

export default function ShipmentPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const shipmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shipment, setShipment] = useState<TrackingShipment | null>(null);
  const [liveLocation, setLiveLocation] = useState<LiveLocation | null>(null);

  useEffect(() => {
    if (!token || !shipmentId) return;

    let isMounted = true;

    async function loadShipmentDetails() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const data = await ShipmentService.getShipment(shipmentId, token!);

        if (!isMounted) return;

        setShipment(data as unknown as TrackingShipment);

        const rawData = data as any;
        setLiveLocation({
          latitude: rawData.rider?.lastLat ? Number(rawData.rider.lastLat) : Number(rawData.pickupLat || 0),
          longitude: rawData.rider?.lastLng ? Number(rawData.rider.lastLng) : Number(rawData.pickupLng || 0),
        });
      } catch (error: any) {
        if (!isMounted) return;
        console.error("Failed loading target shipment matrix layout:", error);
        setErrorMessage(error.message || "Failed to load shipment details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadShipmentDetails();

    return () => {
      isMounted = false;
    };
  }, [shipmentId, token]);

  // Handle live WebSocket pipeline events & status updates
  useEffect(() => {
    if (!shipment?.id) return;

    socket.connect();
    socket.emit("customer:joinShipment", shipment.id);

    const handleTrackingUpdate = (payload: LiveLocation) => {
      setLiveLocation({
        latitude: Number(payload.latitude),
        longitude: Number(payload.longitude),
      });
    };

    const handleStatusUpdate = (updatedShipment: Partial<TrackingShipment>) => {
      setShipment((prev) => (prev ? { ...prev, ...updatedShipment } : prev));
    };

    socket.on("tracking:update", handleTrackingUpdate);
    socket.on("shipment:statusUpdate", handleStatusUpdate);

    return () => {
      socket.emit("customer:leaveShipment", shipment.id);
      socket.off("tracking:update", handleTrackingUpdate);
      socket.off("shipment:statusUpdate", handleStatusUpdate);
      socket.disconnect();
    };
  }, [shipment?.id]);

  if (loading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-black" />
      </div>
    );
  }

  if (errorMessage || !shipment) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-neutral-800">
          {errorMessage || "Shipment record missing"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Please verify the shipment URL or check your token authentication status.
        </p>
      </div>
    );
  }

  const isDelivered = shipment.status === "DELIVERED";

  // Function to handle navigating to the dedicated chat page
  const handleOpenChatPage = () => {
    router.push(`/dashboard/shipment/${shipmentId}/chat`);
  };

  return (
    <div className="relative space-y-6 max-w-7xl mx-auto px-4 py-2">
      <ShipmentDetailsHeader trackingCode={shipment.trackingCode} status={shipment.status} />

      {/* VERIFICATION PIN & DELIVERY STATUS CARD */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
            Delivery Verification
          </span>
          <h3 className="text-lg font-bold text-white">
            {isDelivered ? "Package Successfully Delivered 🎉" : "Share Verification PIN with Rider"}
          </h3>
          <p className="text-xs text-neutral-400 max-w-md">
            {isDelivered
              ? "The delivery PIN has been verified, payment released to rider, and order completed."
              : "Give this code to the rider upon arrival at the destination to complete your delivery."}
          </p>
        </div>

        {shipment.verificationPin && (
          <div className="flex flex-col items-center bg-neutral-800 border border-neutral-700/80 px-6 py-3 rounded-xl">
            <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
              SECURITY PIN
            </span>
            <span className="text-2xl font-black font-mono tracking-widest text-emerald-400">
              {shipment.verificationPin}
            </span>
          </div>
        )}
      </div>

      <ShipmentTracking shipment={shipment} liveLocation={liveLocation} />
      <ShipmentDetails shipment={shipment as unknown as Shipment} />
      <ShipmentTimeline timeline={shipment.timelineEvents} />

      {/* FLOATING ACTION BUTTON - REDIRECT TO CHAT PAGE */}
      <button
        onClick={handleOpenChatPage}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-200 hover:scale-105"
        aria-label="Open Chat Page"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="font-semibold text-xs hidden sm:inline">Open Chat</span>
      </button>
    </div>
  );
}