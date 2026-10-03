"tsx"
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AppLocation {
  latitude?: number;
  longitude?: number;
  address: string;
  city: string;
  state: string;
  country: string;
}

type LocationStatus = "unknown" | "selected" | "changing";

interface AppLocationContextType {
  appLocation: AppLocation | null;
  locationStatus: LocationStatus;
  setAppLocation: (loc: AppLocation) => void;
  startChangingLocation: () => void;
  clearAppLocation: () => void;
}

const AppLocationContext = createContext<AppLocationContextType | undefined>(undefined);

const STORAGE_KEY = "aviore_app_location";

export function AppLocationProvider({ children }: { children: React.ReactNode }) {
  const [appLocation, setAppLocationState] = useState<AppLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("unknown");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAppLocationState(parsed);
        setLocationStatus("selected");
      } else {
        setLocationStatus("unknown");
      }
    } catch (e) {
      console.error("Failed to load app location from storage:", e);
      setLocationStatus("unknown");
    }
  }, []);

  const setAppLocation = (loc: AppLocation) => {
    setAppLocationState(loc);
    setLocationStatus("selected");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  };

  const startChangingLocation = () => {
    setLocationStatus("changing");
  };

  const clearAppLocation = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAppLocationState(null);
    setLocationStatus("unknown");
  };

  return (
    <AppLocationContext.Provider
      value={{
        appLocation,
        locationStatus,
        setAppLocation,
        startChangingLocation,
        clearAppLocation,
      }}
    >
      {children}
    </AppLocationContext.Provider>
  );
}

export function useAppLocation() {
  const context = useContext(AppLocationContext);
  if (!context) {
    throw new Error("useAppLocation must be used within an AppLocationProvider");
  }
  return context;
}