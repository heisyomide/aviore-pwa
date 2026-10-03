import { useEffect, useState } from "react";

interface TelemetryCoords {
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
}

export function useRiderTelemetry(isActive: boolean) {
  const [coords, setCoords] = useState<TelemetryCoords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive || typeof window === "undefined" || !navigator.geolocation) {
      return;
    }

    // High accuracy configuration to wake up mobile GPS chips
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true, // Forces phone to use hardware GPS instead of slow IP caching
      timeout: 10000,           // 10 seconds timeout limit
      maximumAge: 0,            // Do not use cached older coordinates
    };

    const handleSuccess = (position: GeolocationPosition) => {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        heading: position.coords.heading,
        speed: position.coords.speed,
      });
      setError(null);
    };

    const handleError = (err: GeolocationPositionError) => {
      console.warn(`Telemetry tracking alert (${err.code}): ${err.message}`);
      setError(err.message);
    };

    // Watch position updates instantly when your phone moves locations
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      geoOptions
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isActive]);

  return { coords, error };
}