"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PlaceSuggestion {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  isVerifiedLandmark?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function usePlacesAutocomplete(defaultCity = "Osogbo") {
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceSuggestion | null>(null);

  const debounce = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(
    (query: string) => {
      setInput(query);

      if (debounce.current) {
        clearTimeout(debounce.current);
      }

      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      debounce.current = setTimeout(async () => {
        try {
          setLoading(true);

          // 1. Query NestJS In-Memory RAM Cache First
          const ramRes = await fetch(
            `${API_BASE_URL}/landmarks/search?city=${encodeURIComponent(
              defaultCity
            )}&query=${encodeURIComponent(query)}`
          );

          if (ramRes.ok) {
            const ramData = await ramRes.json();

            if (Array.isArray(ramData) && ramData.length > 0) {
              const ramResults: PlaceSuggestion[] = ramData.map((item: any) => ({
                id: item.id,
                name: item.name,
                address: item.description || item.name,
                city: item.city || defaultCity,
                state: item.state || "Osun",
                country: "Nigeria",
                latitude: item.latitude,
                longitude: item.longitude,
                isVerifiedLandmark: true,
              }));

              setSuggestions(ramResults);
              setLoading(false);
              return; // Return early with fast local RAM results
            }
          }

          // 2. Fallback to Photon/Komoot if no local RAM landmark was found
          const photonRes = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(
              `${query} ${defaultCity}`
            )}&limit=6`
          );

          const json = await photonRes.json();

          const photonResults: PlaceSuggestion[] = json.features.map(
            (feature: any) => ({
              id:
                feature.properties.osm_id?.toString() ??
                Math.random().toString(),

              name:
                feature.properties.name ||
                feature.properties.street ||
                "Unknown Location",

              address:
                feature.properties.street ||
                feature.properties.name ||
                "",

              city:
                feature.properties.city ||
                feature.properties.county ||
                defaultCity,

              state: feature.properties.state || "",

              country: feature.properties.country || "Nigeria",

              latitude: feature.geometry.coordinates[1],

              longitude: feature.geometry.coordinates[0],

              isVerifiedLandmark: false,
            })
          );

          setSuggestions(photonResults);
        } catch (error) {
          console.error("Error searching places:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 250); // 250ms debounce for quick response
    },
    [defaultCity]
  );

  const selectPlace = (place: PlaceSuggestion) => {
    setSelectedPlace(place);

    setInput(
      [place.name, place.city].filter(Boolean).join(", ")
    );

    setSuggestions([]);
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  const clearSelection = () => {
    setSelectedPlace(null);
    setInput("");
    setSuggestions([]);
  };

  useEffect(() => {
    return () => {
      if (debounce.current) {
        clearTimeout(debounce.current);
      }
    };
  }, []);

  return {
    inputRef,

    input,
    setInput,

    loading,

    suggestions,

    selectedPlace,

    search,

    selectPlace,

    clearSuggestions,

    clearSelection,
  };
}