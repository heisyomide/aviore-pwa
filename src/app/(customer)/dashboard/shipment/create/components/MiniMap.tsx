"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MiniMapProps {
  pickup?: Coordinate;
  destination?: Coordinate;
}

export default function MiniMap({
  pickup,
  destination,
}: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<maplibregl.Map | null>(null);

  const pickupMarker = useRef<maplibregl.Marker | null>(null);

  const destinationMarker = useRef<maplibregl.Marker | null>(null);

  // Create map ONCE
  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style:
        "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
      center: [4.55, 7.77],
      zoom: 11,
    });

    map.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    mapRef.current = map;

    return () => {
      try {
        pickupMarker.current?.remove();
        destinationMarker.current?.remove();
        map.remove();
      } catch (e) {
        console.warn("Map already destroyed");
      }

      mapRef.current = null;
      pickupMarker.current = null;
      destinationMarker.current = null;
    };
  }, []);

  // Update markers whenever pickup/destination changes
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    pickupMarker.current?.remove();
    destinationMarker.current?.remove();

    if (pickup) {
      pickupMarker.current = new maplibregl.Marker({
        color: "#16a34a",
      })
        .setLngLat([
          pickup.longitude,
          pickup.latitude,
        ])
        .addTo(map);
    }

    if (destination) {
      destinationMarker.current = new maplibregl.Marker({
        color: "#dc2626",
      })
        .setLngLat([
          destination.longitude,
          destination.latitude,
        ])
        .addTo(map);
    }

    if (pickup && destination) {
      const bounds = new maplibregl.LngLatBounds();

      bounds.extend([
        pickup.longitude,
        pickup.latitude,
      ]);

      bounds.extend([
        destination.longitude,
        destination.latitude,
      ]);

      map.fitBounds(bounds, {
        padding: 70,
        animate: true,
      });
    } else if (pickup) {
      map.flyTo({
        center: [
          pickup.longitude,
          pickup.latitude,
        ],
        zoom: 15,
      });
    }
  }, [pickup, destination]);

  return (
    <div
      ref={containerRef}
      className="h-64 w-full rounded-2xl overflow-hidden"
    />
  );
}