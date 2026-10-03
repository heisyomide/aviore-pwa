'use client';

import { useEffect } from 'react';
import { MapPin, Navigation, Clock3, Wallet, Compass } from 'lucide-react';

import { ShipmentFormData } from '../../types';
import {
  PlaceSuggestion,
  usePlacesAutocomplete,
} from '../../hooks/usePlacesAutocomplete';
import MiniMap from './MiniMap';

interface PickupStepProps {
  formData: ShipmentFormData;
  updateForm: (data: Partial<ShipmentFormData>) => void;
  onNext: () => void;

  distanceKm?: number;
  eta?: number;
  estimatedPrice?: number;
}

export default function PickupStep({
  formData,
  updateForm,
  onNext,
  distanceKm,
  eta,
  estimatedPrice,
}: PickupStepProps) {
  const pickup = usePlacesAutocomplete();
  const destination = usePlacesAutocomplete();

  useEffect(() => {
    if (formData.pickup?.address) {
      pickup.setInput(formData.pickup.address);
    }

    if (formData.destination?.address) {
      destination.setInput(formData.destination.address);
    }
  }, []);

  const selectPickup = (place: PlaceSuggestion) => {
    pickup.selectPlace(place);

    updateForm({
      pickup: {
        ...formData.pickup,
        placeId: place.id,
        address: `${place.name}, ${place.city}`,
        latitude: place.latitude,
        longitude: place.longitude,
      },
    });
  };

  const selectDestination = (place: PlaceSuggestion) => {
    destination.selectPlace(place);

    updateForm({
      destination: {
        ...formData.destination,
        placeId: place.id,
        address: `${place.name}, ${place.city}`,
        latitude: place.latitude,
        longitude: place.longitude,
      },
    });
  };

  const canContinue =
    !!formData.pickup?.address &&
    !!formData.destination?.address;

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-7">
        <div>
          <h2 className="text-2xl font-black">
            Pickup & Destination
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            Search using street names, prominent landmarks, or general city areas.
          </p>
        </div>

        {/* Pickup Section */}
        <div className="space-y-3">
          <label className="font-semibold block text-neutral-800">
            Pickup Location
          </label>

          <div className="relative">
            <input
              value={pickup.input}
              onChange={(e) => {
                pickup.search(e.target.value);
                updateForm({
                  pickup: {
                    ...formData.pickup,
                    address: e.target.value,
                  },
                });
              }}
              placeholder="Search pickup area (e.g. Ogo Oluwa, Osogbo)..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
            />

            {pickup.loading && (
              <p className="text-sm text-neutral-500 mt-1 pl-1">
                Searching locations...
              </p>
            )}

            {pickup.suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-2 rounded-xl border bg-white shadow-lg overflow-hidden">
                {pickup.suggestions.map((place, index) => (
                  <button
                    key={`${place.id}-${index}`}
                    type="button"
                    onClick={() => selectPickup(place)}
                    className="flex gap-3 w-full p-4 text-left hover:bg-neutral-50 border-b last:border-none"
                  >
                    <MapPin className="text-green-600 w-5 h-5 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-neutral-900">{place.name}</p>
                      <p className="text-sm text-neutral-500">
                        {place.address}, {place.city}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pickup Landmark / Detailed Directions */}
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 p-2.5 bg-neutral-50">
            <Compass className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={formData.pickup?.landmark || ''}
              onChange={(e) =>
                updateForm({
                  pickup: {
                    ...formData.pickup,
                    landmark: e.target.value,
                  },
                })
              }
              placeholder="Pickup landmark (e.g. Opposite Access Bank, Blue gate)"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Destination Section */}
        <div className="space-y-3">
          <label className="font-semibold block text-neutral-800">
            Destination Location
          </label>

          <div className="relative">
            <input
              value={destination.input}
              onChange={(e) => {
                destination.search(e.target.value);
                updateForm({
                  destination: {
                    ...formData.destination,
                    address: e.target.value,
                  },
                });
              }}
              placeholder="Search destination area (e.g. Old Garage, Osogbo)..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
            />

            {destination.loading && (
              <p className="text-sm text-neutral-500 mt-1 pl-1">
                Searching locations...
              </p>
            )}

            {destination.suggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-2 rounded-xl border bg-white shadow-lg overflow-hidden">
                {destination.suggestions.map((place, index) => (
                  <button
                    key={`${place.id}-${index}`}
                    type="button"
                    onClick={() => selectDestination(place)}
                    className="flex gap-3 w-full p-4 text-left hover:bg-neutral-50 border-b last:border-none"
                  >
                    <Navigation className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-neutral-900">{place.name}</p>
                      <p className="text-sm text-neutral-500">
                        {place.address}, {place.city}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination Landmark / Detailed Directions */}
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 p-2.5 bg-neutral-50">
            <Compass className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={formData.destination?.landmark || ''}
              onChange={(e) =>
                updateForm({
                  destination: {
                    ...formData.destination,
                    landmark: e.target.value,
                  },
                })
              }
              placeholder="Destination landmark (e.g. Beside GTBank, Yellow storey building)"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Route Preview */}
        {canContinue && (
          <div className="rounded-2xl border bg-neutral-50 p-4">
            <MiniMap
              pickup={formData.pickup}
              destination={formData.destination}
            />

            <div className="grid grid-cols-3 gap-4 mt-5">
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <Navigation className="mx-auto mb-2 w-5 h-5 text-neutral-600" />
                <p className="text-xs text-neutral-500">Distance</p>
                <p className="font-bold">{distanceKm ?? '--'} km</p>
              </div>

              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <Clock3 className="mx-auto mb-2 w-5 h-5 text-neutral-600" />
                <p className="text-xs text-neutral-500">ETA</p>
                <p className="font-bold">{eta ?? '--'} mins</p>
              </div>

              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <Wallet className="mx-auto mb-2 w-5 h-5 text-neutral-600" />
                <p className="text-xs text-neutral-500">Fare</p>
                <p className="font-bold">
                  ₦{estimatedPrice?.toLocaleString() ?? '--'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        disabled={!canContinue}
        onClick={onNext}
        className="mt-8 w-full rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:bg-neutral-300 disabled:text-neutral-500"
      >
        Continue
      </button>
    </div>
  );
}