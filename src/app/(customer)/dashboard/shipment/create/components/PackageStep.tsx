'use client';

import { useEffect } from "react";
import { ShipmentFormData } from "../../types";   // ← Adjusted path
import { usePricing } from "../../hooks/usePricing";             // ← Adjusted path

interface PackageStepProps {
  formData: ShipmentFormData;
  updateForm: (data: Partial<ShipmentFormData>) => void;
  onNext: () => void;
}

const packageCategories = [
  { value: "SMALL_PARCEL", title: "Small Parcel", icon: "📦", description: "Accessories and small packages" },
  { value: "MEDIUM_PARCEL", title: "Medium Parcel", icon: "🧳", description: "Shoes, gadgets and boxes" },
  { value: "LARGE_PARCEL", title: "Large Parcel", icon: "🚚", description: "Large deliveries" },
  { value: "FRAGILE_ITEM", title: "Fragile", icon: "🥂", description: "Glass, ceramics and valuables" },
  { value: "ELECTRONICS", title: "Electronics", icon: "💻", description: "Phones, laptops and devices" },
];

const weights = [
  "UNDER_1KG", "FROM_1_3KG", "FROM_3_5KG", "FROM_5_10KG", "FROM_10_20KG", "ABOVE_20KG",
];

export default function PackageStep({
  formData,
  updateForm,
  onNext,
}: PackageStepProps) {
  const { pricing, isLoading, calculatePrice } = usePricing();

  // Auto-calculate pricing when key fields change
  useEffect(() => {
    const hasLocations = 
      formData.pickup?.latitude && 
      formData.destination?.latitude;

    if (hasLocations) {
      calculatePrice({
        pickupLat: formData.pickup.latitude,
        pickupLng: formData.pickup.longitude,
        destinationLat: formData.destination.latitude,
        destinationLng: formData.destination.longitude,
        packageCategory: formData.packageCategory,
        weightRange: formData.weightRange,
        // Fixed: Reading correctly from deliverySpeed instead of deliveryType
        isExpress: formData.deliverySpeed === "EXPRESS",
        waterproof: formData.waterproof ?? false,
      });
    }
    // Fixed: Stripped out raw dynamic hook references to avoid accidental loop cycles
  }, [
    formData.pickup?.latitude,
    formData.pickup?.longitude,
    formData.destination?.latitude,
    formData.destination?.longitude,
    formData.packageCategory,
    formData.weightRange,
    formData.deliverySpeed,
    formData.waterproof,
  ]);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-black">Package Details</h2>
          <p className="text-neutral-500 text-sm mt-2">
            Tell us about your shipment.
          </p>
        </div>

        {/* Package Categories */}
        <div>
          <label className="font-semibold block mb-3">Package Category</label>
          <div className="grid grid-cols-2 gap-4">
            {packageCategories.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => updateForm({ packageCategory: item.value as any })}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  formData.packageCategory === item.value
                    ? "border-green-600 bg-green-50"
                    : "border-neutral-200 hover:border-green-400"
                }`}
              >
                <div className="text-3xl">{item.icon}</div>
                <h3 className="font-bold mt-3">{item.title}</h3>
                <p className="text-xs text-neutral-500 mt-1">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Weight Selection */}
        <div>
          <label className="font-semibold block mb-3">Estimated Weight</label>
          <div className="grid grid-cols-2 gap-3">
            {weights.map((weight) => (
              <button
                key={weight}
                type="button"
                onClick={() => updateForm({ weightRange: weight as any })}
                className={`rounded-xl border py-3.5 font-medium text-sm transition-all ${
                  formData.weightRange === weight
                    ? "bg-green-600 text-white border-green-600"
                    : "border-neutral-300 hover:border-green-500"
                }`}
              >
                {weight.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Special Options */}
        <div className="space-y-4">
          <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer">
            <div>
              <p className="font-semibold">Express Delivery</p>
              <p className="text-sm text-neutral-500">Faster rider dispatch</p>
            </div>
            <input
              type="checkbox"
              // Fixed: Target deliverySpeed properties correctly
              checked={formData.deliverySpeed === "EXPRESS"}
              onChange={(e) =>
                updateForm({ deliverySpeed: e.target.checked ? "EXPRESS" : "STANDARD" })
              }
              className="h-5 w-5 accent-green-600"
            />
          </label>

          <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer">
            <div>
              <p className="font-semibold">Waterproof Packaging</p>
              <p className="text-sm text-neutral-500">Additional protective wrapping</p>
            </div>
            <input
              type="checkbox"
              checked={formData.waterproof ?? false}
              onChange={(e) => updateForm({ waterproof: e.target.checked })}
              className="h-5 w-5 accent-green-600"
            />
          </label>
        </div>

        {/* Live Pricing */}
        <div className="rounded-3xl border bg-neutral-50 p-6">
          <h3 className="font-bold text-lg mb-4">Live Pricing</h3>

          {isLoading ? (
            <div className="py-8 text-center text-neutral-500">
              Calculating delivery...
            </div>
          ) : pricing ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Distance</span>
                <strong>{pricing.distanceKm.toFixed(1)} km</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated Time</span>
                <strong>{pricing.estimatedMinutes} mins</strong>
              </div>
              <div className="flex justify-between">
                <span>Region</span>
                <strong>{pricing.detectedRegion?.replace("_", " ")}</strong>
              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-green-600">
                  ₦{pricing.totalDeliveryFee.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-neutral-500">
              Complete pickup &amp; destination to see pricing
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!pricing}
        className={`w-full mt-8 rounded-xl py-4 font-bold transition-all ${
          pricing
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}