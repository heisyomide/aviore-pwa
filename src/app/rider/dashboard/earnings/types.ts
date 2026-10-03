export interface RiderEarningsOverview {
  weekGross: number;
  completedTrips: number;
  activeHours: number;
  averagePerTrip: number;
  weekLabel: string;
}

export interface RiderChartItem {
  day: string;
  amount: number;
}

export interface RiderEarningHistory {
  id: string;
  trackingCode: string;
  customerName: string;
  amount: number;
  createdAt: string;
  status: 'SETTLED' | 'PROCESSING';
}

export interface RiderEarnings {
  overview: RiderEarningsOverview;

  chart: RiderChartItem[];

  history: RiderEarningHistory[];
}