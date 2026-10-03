// src/app/rider/dashboard/jobs/[shipmentId]/types.ts

export type ShipmentStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Recipient {
  name: string;
  phone?: string;
  phoneNumber: string;
}

export interface LocationPoint {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

export interface ShipmentDetails {
  id: string;
  trackingCode: string;
  status: ShipmentStatus;
  packageCategory: string;
  deliveryType: string;
  weightRange: string;
  description: string;
  distanceKm: number;
  estimatedMinutes: number;
  totalPrice: number;
  riderShare: number;
  verificationPin: string;
  isExpress: boolean;
  isFragile: boolean;
  waterproof: boolean;
  keepUpright: boolean;
  handleWithCare: boolean;
  recipient: Recipient;
  pickup: LocationPoint;
  destination: LocationPoint;
}

export interface ShipmentResponse {
  shipment: ShipmentDetails;
}

export type Shipment = ShipmentDetails;