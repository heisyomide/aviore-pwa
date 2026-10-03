export interface RiderProfile {
  id: string;
  userId?: string;

  firstName: string;
  lastName: string;
  fullName?: string;
  initials?: string;

  email: string;
  phoneNumber: string;

  status:
    | 'PENDING_VERIFICATION'
    | 'VERIFIED'
    | 'REJECTED'
    | 'SUSPENDED';

  avatarUrl: string | null;

  nin: string | null;
  driversLicense: string | null;

  isOnline: boolean;

  bankName: string | null;
  bankCode: string | null;
  accountNumber: string | null;
  accountName: string | null;

  completedDeliveries: number;
  ratingAverage: number;
  trustScore: number;

  createdAt: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;

  avatarUrl?: string;

  nin?: string;
  driversLicense?: string;
}

export interface UpdateBankRequest {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}