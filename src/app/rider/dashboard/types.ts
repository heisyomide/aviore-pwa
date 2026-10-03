export interface RiderOverview {
  rider: RiderSummary;
  statistics: RiderStatistics;
  recentDeliveries: RecentDelivery[];
}

export interface RiderSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string | null;
  isOnline: boolean;
}

export interface RiderStatistics {
  todaysEarnings: number;
  pendingWallet: number;
  availableJobs: number;
  completedDeliveries: number;
  riderRating: number;
}

export interface RecentDelivery {
  shipmentId: string;
  trackingCode: string;
  recipient: string;
  pickupAddress: string;
  destinationAddress: string;
  amountEarned: number;
  status: string;
  deliveredAt: string;
}