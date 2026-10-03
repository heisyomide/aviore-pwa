"use client";

import { useMutation } from "@tanstack/react-query";
import { PricingRequest, PricingResponse } from "../types";

// API Call Function (Separate from hook)
const calculatePricingAPI = async (payload: PricingRequest): Promise<PricingResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pricing/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to calculate pricing");
  }

  return response.json();
};

export function usePricing() {
  const mutation = useMutation<PricingResponse, Error, PricingRequest>({
    mutationFn: calculatePricingAPI,
    onError: (error) => {
      console.error("Pricing calculation failed:", error);
    },
  });

  return {
    calculatePrice: mutation.mutateAsync,     // Call this to trigger calculation
    pricing: mutation.data,                   // Full response
    totalPrice: mutation.data?.totalDeliveryFee ?? 0,
    estimatedMinutes: mutation.data?.estimatedMinutes ?? 0,
    distanceKm: mutation.data?.distanceKm ?? 0,
    region: mutation.data?.detectedRegion ?? "",
    breakdown: mutation.data?.breakdown,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}