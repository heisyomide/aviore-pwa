// types.ts
export interface ParcelJob {
  id: string;
  trackingCode: string;
  status: string;
  packageCategory: string;
  deliveryType: string;
  weightRange: string;
  description?: string;
  pickupAddress: string;
  destinationAddress: string;
  distanceKm: number;
  estimatedMinutes: number;
  totalPrice: number;
  riderShare: number;
  verificationPin?: string;
  isExpress: boolean;
  isFragile?: boolean;
  waterproof?: boolean;
  keepUpright?: boolean;
  handleWithCare?: boolean;
  createdAt?: string;
}

export interface TransitRoute {
  routeId: string;
  originCity: string;
  destination: string;
  price: number;
  pickupPoints?: Array<{
    id: string;
    name: string;
    address: string;
  }>;
}

export interface TransitEvent {
  eventId: string;
  id?: string;
  title: string;
  venue: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  bannerUrl?: string;
  organizer?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
}

export interface TransitJob {
  tripId: string;
  tripLeg: string;
  departureTime: string;
  arrivalTime: string | null;
  status: string;
  payout: number;
  route: TransitRoute;
  event: TransitEvent;
  pickupPoints?: Array<{
    id: string;
    name: string;
    address: string;
  }>;
}

export type AvailableJob = Partial<ParcelJob & TransitJob> & {
  payout?: number;
  id?: string;
  tripId?: string;
};

export interface ParcelJobDetails extends ParcelJob {
  recipient: {
    name: string;
    phoneNumber: string;
  };
  pickup: {
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
  };
  destination: {
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
  };
}

export interface TransitJobDetails extends TransitJob {}

export type JobDetailsResponse =
  | { jobType: 'PARCEL_DELIVERY'; job: ParcelJobDetails }
  | { jobType: 'EVENT_TRANSIT'; job: TransitJobDetails };

export type JobDetails = ParcelJobDetails;