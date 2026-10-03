// app/shipment/constants.ts

import {
  PackageCategory,
  WeightRange,
  DeliveryMethod,
  DeliverySpeed,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000";

export const PACKAGE_OPTIONS: {
  label: string;
  value: PackageCategory;
  icon: string;
}[] = [

  {
    label: "Small Parcel",
    value: "SMALL_PARCEL",
    icon: "📦",
  },
  {
    label: "Medium Parcel",
    value: "MEDIUM_PARCEL",
    icon: "📦",
  },
  {
    label: "Large Parcel",
    value: "LARGE_PARCEL",
    icon: "🚚",
  },
  {
    label: "Fragile Item",
    value: "FRAGILE_ITEM",
    icon: "🧊",
  },
  {
    label: "Electronics",
    value: "ELECTRONICS",
    icon: "💻",
  },


  {
    label: "Clothing",
    value: "CLOTHING",
    icon: "👕",
  },
];

export const WEIGHT_OPTIONS: {
  label: string;
  value: WeightRange;
}[] = [
  {
    label: "Under 1kg",
    value: "UNDER_1KG",
  },
  {
    label: "1kg - 3kg",
    value: "FROM_1_3KG",
  },
  {
    label: "3kg - 5kg",
    value: "FROM_3_5KG",
  },
  {
    label: "5kg - 10kg",
    value: "FROM_5_10KG",
  },
  {
    label: "10kg - 20kg",
    value: "FROM_10_20KG",
  },
  {
    label: "Above 20kg",
    value: "ABOVE_20KG",
  },
];

export const DELIVERY_SPEEDS: {
  title: string;
  value: DeliverySpeed;
  icon: string;
  description: string;
}[] = [
  {
    title: "Standard Delivery",
    value: "STANDARD",
    icon: "🚚",
    description: "Affordable everyday delivery.",
  },
  {
    title: "Express Delivery",
    value: "EXPRESS",
    icon: "⚡",
    description: "Fastest rider available.",
  },
  {
    title: "Scheduled Delivery",
    value: "SCHEDULED",
    icon: "📅",
    description: "Choose a preferred delivery time.",
  },
];

export const DELIVERY_METHODS: {
  title: string;
  value: DeliveryMethod;
  description: string;
}[] = [
  {
    title: "Hand Delivery",
    value: "hand",
    description: "Receiver must provide the verification PIN.",
  },
  {
    title: "Smart Delivery",
    value: "smart",
    description:
      "Package can be safely left with GPS and photo verification.",
  },
];

export const WIZARD_STEPS = [
  "Pickup",
  "Package",
  "Receiver",
  "Delivery",
  "Security",
  "Checkout",
];

export const DEFAULT_PIN_LENGTH = 6;