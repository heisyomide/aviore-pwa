"use client";

import { useState, useCallback } from "react";
import { ShipmentFormData } from "../types";

const initialState: ShipmentFormData = {
  pickup: {
    address: "",
    latitude: 0,
    longitude: 0,
    placeId: "",
  },
  destination: {
    address: "",
    latitude: 0,
    longitude: 0,
    placeId: "",
  },
  sender: {
    senderName: "",
    senderPhone: "",
  },
  receiver: {
    receiverName: "",
    receiverPhone: "",
  },
  packageCategory: "SMALL_PARCEL",
  weightRange: "UNDER_1KG",
  deliveryType: "PARCEL",
  deliverySpeed: "STANDARD",
  deliveryMethod: "hand",
  deliveryNote: "",
  verificationPin: "",
  isFragile: false,
  waterproof: false,
  keepUpright: false,
  handleWithCare: false,
};

export function useShipment() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shipment, setShipment] = useState<ShipmentFormData>(initialState);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const updateShipment = useCallback((values: Partial<ShipmentFormData>) => {
    setShipment((prev) => ({
      ...prev,
      ...values,
    }));
  }, []);

  const updatePickup = useCallback((pickup: ShipmentFormData["pickup"]) => {
    setShipment((prev) => ({
      ...prev,
      pickup,
    }));
  }, []);

  const updateDestination = useCallback((destination: ShipmentFormData["destination"]) => {
    setShipment((prev) => ({
      ...prev,
      destination,
    }));
  }, []);

  const updateSender = useCallback((sender: ShipmentFormData["sender"]) => {
    setShipment((prev) => ({
      ...prev,
      sender,
    }));
  }, []);

  const updateReceiver = useCallback((receiver: ShipmentFormData["receiver"]) => {
    setShipment((prev) => ({
      ...prev,
      receiver,
    }));
  }, []);

  const setVerificationPin = useCallback((verificationPin: string) => {
    setShipment((prev) => ({
      ...prev,
      verificationPin,
    }));
  }, []);

  const resetShipment = useCallback(() => {
    setShipment(initialState);
    setCurrentStep(1);
  }, []);

  return {
    shipment,
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    updateShipment,
    updatePickup,
    updateDestination,
    updateSender,
    updateReceiver,
    setVerificationPin,
    resetShipment,
  };
}