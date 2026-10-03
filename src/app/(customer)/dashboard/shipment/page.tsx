"use client";

import ShipmentHeader from "./components/ShipmentHeader";
import ShipmentStats from "./components/ShipmentStats";
import ShipmentOverview from "./components/ShipmentOverview";
import { useShipments } from "./hooks/useShipments";

export default function ShipmentDashboardPage() {
  const {
    loading,
    shipments,
    stats,
    refresh,
  } = useShipments();

  // Map shipments to match the RecentShipment shape expected by ShipmentOverview
  const formattedShipments = shipments.map((s: any) => ({
    ...s,
    // Adjust field names below to match your actual Shipment data fields
    destination: s.destination || s.dropoffAddress || s.recipientAddress || "N/A",
    date: s.date || s.createdAt || new Date(s.timestamp || Date.now()).toLocaleDateString(),
  }));

  return (
    <div className="space-y-4 px-3 sm:px-4 py-7 text-sm">
      <ShipmentHeader
        onRefresh={refresh}
        onTrack={(trackingCode) => {
          console.log(trackingCode);
        }}
      />

      <ShipmentStats
        stats={stats}
        loading={loading}
      />

      <ShipmentOverview
        shipments={formattedShipments}
        loading={loading}
      />
    </div>
  );
}