"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Navigation, X, User, MapPin, Loader2 } from "lucide-react";
import { useAppLocation } from "@/src/context/AppLocationContext";
import { usePlacesAutocomplete, PlaceSuggestion } from "../(customer)/dashboard/shipment/hooks/usePlacesAutocomplete"; // Adjust path as necessary

export default function LocationSelectionPage() {
  const router = useRouter();
  const { setAppLocation } = useAppLocation();
  const [selectedCity, setSelectedCity] = useState("Osogbo");
  const [isDetecting, setIsDetecting] = useState(false);

  // Hook into your robust autocomplete hook that handles NestJS RAM and Photon fallback safely
  const { input, loading, suggestions, search, selectPlace, clearSuggestions } =
    usePlacesAutocomplete(selectedCity);

  const handleSelectLandmark = (place: PlaceSuggestion) => {
    selectPlace(place);
    setAppLocation({
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.name,
      city: place.city,
      state: place.state || (place.city === "Ibadan" ? "Oyo State" : "Osun State"),
      country: place.country || "Nigeria",
    });
    router.push("/login");
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetecting(false);
        setAppLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: "Current GPS Location",
          city: selectedCity,
          state: selectedCity === "Ibadan" ? "Oyo State" : "Osun State",
          country: "Nigeria",
        });
        router.push("/login");
      },
      (error) => {
        setIsDetecting(false);
        console.error("GPS Error:", error);
        alert("Unable to retrieve your location. Please type a landmark manually.");
      },
      { timeout: 10000 }
    );
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between p-5 max-w-md mx-auto relative">
      <div className="space-y-6">
        {/* Top Bar Header */}
        <div className="flex items-center justify-between pt-2">
          <h1 className="text-xl font-black tracking-tight text-neutral-900">
            Delivery address
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-bold text-neutral-800 transition-colors cursor-pointer"
            >
              <User size={13} />
              <span>Log in</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* City Scope Switcher Pills */}
        <div className="flex items-center gap-2">
          {["Osogbo", "Ibadan"].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCity === city
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Landmark Search Bar & Dropdown Results */}
        <div className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-neutral-400">
              {loading ? <Loader2 size={18} className="animate-spin text-emerald-600" /> : <Search size={18} />}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => search(e.target.value)}
              placeholder="Enter a new address or landmark"
              className="w-full pl-11 pr-10 py-3.5 bg-neutral-100/80 border border-transparent rounded-2xl text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-2xs"
            />
            {input && (
              <button
                type="button"
                onClick={() => clearSuggestions()}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown Results */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral-100 shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto divide-y divide-neutral-50">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectLandmark(item)}
                  className="w-full px-4 py-3 text-left hover:bg-emerald-50/60 transition-colors flex items-start gap-3 cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-neutral-900 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
                      {item.city}, {item.state} {item.address ? `• ${item.address}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Use Current Location Action */}
        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={isDetecting}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-xs font-bold transition-colors cursor-pointer pt-1"
        >
          <Navigation size={15} className={isDetecting ? "animate-spin" : ""} />
          <span>{isDetecting ? "Detecting location..." : "Use your current location"}</span>
        </button>
      </div>

      {/* Center Illustrated Pin Graphic matching design screenshot */}
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="relative flex flex-col items-center animate-pulse">
          <div className="text-emerald-500 filter drop-shadow-xl transform -translate-y-4">
            <svg
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 7.13 14.45 7.44 14.85a.75.75 0 001.12 0C12.87 22.45 20 13.25 20 8c0-4.42-3.58-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
            </svg>
          </div>
          <div className="w-24 h-3 bg-neutral-300/60 rounded-full blur-xs"></div>
        </div>
      </div>
    </main>
  );
}