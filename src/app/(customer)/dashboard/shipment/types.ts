export type DeliverySpeed =
  | "STANDARD"
  | "EXPRESS"
  | "SCHEDULED";

export type DeliveryMethod =
  | "hand"
  | "smart";

export type DeliveryType =
  | "PARCEL"
  | "FOOD"
  | "GROCERY"
  | "PHARMACY"
  | "DOCUMENT";

export type WeightRange =
  | "UNDER_1KG"
  | "FROM_1_3KG"
  | "FROM_3_5KG"
  | "FROM_5_10KG"
  | "FROM_10_20KG"
  | "ABOVE_20KG";

export type PackageCategory =
  | "SMALL_PARCEL"
  | "MEDIUM_PARCEL"
  | "LARGE_PARCEL"
  | "FRAGILE_ITEM"
  | "CLOTHING"
  | "ELECTRONICS";

export interface AddressData {
  address: string;
  landmark?: string;          // Added: Vital for Nigerian logistics navigation
  latitude: number;
  longitude: number;
  placeId?: string;           // Updated: Optional for dropped pins / OSM searches
}

export interface SenderInformation {
  senderName: string;         // Added: Required so rider can contact pickup point
  senderPhone: string;
}

export interface ReceiverInformation {
  receiverName: string;
  receiverPhone: string;
}

// Main Form Data - Using Nested Structure (Recommended)
export interface ShipmentFormData {
  // Locations
  pickup: AddressData;
  destination: AddressData;
  deliverySpeed: DeliverySpeed;

  // Contact Info
  sender: SenderInformation;  // Added: Sender details block
  receiver: ReceiverInformation;

  // Package Details
  packageCategory: PackageCategory;
  weightRange: WeightRange;

  // Delivery Options
  deliveryType: DeliveryType;
  deliveryMethod: DeliveryMethod;
  phone?: string;        
  phoneNumber?: string;  
  // Additional
  deliveryNote: string;
  verificationPin: string;

  // Special Handling
  isFragile: boolean;
  waterproof: boolean;
  keepUpright: boolean;
  handleWithCare: boolean;
  isExpress?: boolean;
}

// Flat version for backend payload (DTO compatible)
export interface FlatShipmentPayload extends Omit<ShipmentFormData, 'pickup' | 'destination' | 'receiver' | 'sender'> {
  // Pickup Metadata
  pickupAddress: string;
  pickupLandmark?: string;
  pickupLat: number;
  pickupLng: number;
  pickupPlaceId?: string;
  senderName: string;
  senderPhone: string;

  // Destination Metadata
  destinationAddress: string;
  destinationLandmark?: string;
  destinationLat: number;
  destinationLng: number;
  destinationPlaceId?: string;
  receiverName: string;
  receiverPhone: string;
}

export interface PricingRequest {
  pickupLat: number;
  pickupLng: number;
  destinationLat: number;
  destinationLng: number;
  packageCategory: PackageCategory;
  weightRange: WeightRange;
  isExpress: boolean;
  waterproof: boolean;
}

export interface PricingResponse {
  distanceKm: number;
  estimatedMinutes: number;
  detectedRegion: string;
  breakdown: {
    baseFee: number;
    pickupDistanceFee: number;
    deliveryDistanceFee: number;
    extraCharges: number;
  };
  totalDeliveryFee: number;
}

export interface ShipmentResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    trackingCode: string;
    verificationPin: string;
    totalPrice: number;
  };
}

export type ShipmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "ARRIVED_AT_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle?: string;
}

export interface TimelineEvent {
  id: string;
  status: ShipmentStatus;
  description: string;
  changedBy: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingCode: string;
  status: ShipmentStatus;
  customerId?: string;
  // Pickup Metadata
  pickupAddress: string;
  pickupLandmark?: string | null;
  pickupLat: number;
  pickupLng: number;
  pickupPlaceId?: string | null;
  senderName?: string | null;
  senderPhone?: string | null;

  // Destination Metadata
  destinationAddress: string;
  destinationLandmark?: string | null;
  destinationLat: number;
  destinationLng: number;
  destinationPlaceId?: string | null;
  recipient: string;
  recipientPhone: string;

  packageCategory: string;
  weightRange: string;
  totalPrice: number;
  distanceKm: number;
  estimatedMinutes: number;
  createdAt: string;

  rider?: Rider | null;
  timelineEvents: TimelineEvent[];
}

export interface ShipmentStats {
  active: number;
  inTransit: number;
  delivered: number;
}

export interface RecentShipment {
  id: string;
  recipient: string;
  destination: string;
  status: "Active" | "In Transit" | "Delivered";
  date: string;
}

export interface LiveLocation {
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  updatedAt?: string;
}