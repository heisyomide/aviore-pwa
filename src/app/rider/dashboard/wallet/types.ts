export interface WalletOverview {
  availableBalance: number;
  pendingBalance: number;
  currency: string;

  bank: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface WalletTransaction {
  id: string;

  amount: number;

  type: 'CREDIT' | 'DEBIT';

  category:
    | 'DELIVERY_PAYMENT'
    | 'RIDER_EARNINGS'
    | 'PLATFORM_COMMISSION'
    | 'WALLET_TOPUP'
    | 'WITHDRAWAL'
    | 'INSURANCE_PREMIUM'
    | 'PROMO_DISCOUNT'
    | 'CASH_COLLECTION_REMITTANCE';

  description: string;

  referenceCode: string;

  createdAt: string;
}

export interface Withdrawal {
  id: string;

  amount: number;

  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'SUCCESS'
    | 'FAILED'
    | 'REJECTED';

  bankName: string;

  bankCode: string;

  accountNumber: string;

  accountName: string;

  createdAt: string;
}

export interface WithdrawRequest {
  amount: number;
}

export interface WalletHistoryResponse {
  transactions: WalletTransaction[];

  withdrawals: Withdrawal[];
}