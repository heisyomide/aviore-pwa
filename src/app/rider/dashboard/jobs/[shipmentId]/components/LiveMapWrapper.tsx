"use client";

import dynamic from "next/dynamic";
import type { ShipmentDetails } from "../types";

// Force Next.js to only load Leaflet inside the client-side browser
const LiveMap = dynamic(
  () => import("./LiveMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] bg-neutral-900 flex items-center justify-center text-neutral-400 font-mono text-xs">
        Initializing GPS Satellite Engines...
      </div>
    )
  }
);

export default function LiveMapWrapper({ shipment }: { shipment: ShipmentDetails }) {
  return <LiveMap shipment={shipment} />;
}