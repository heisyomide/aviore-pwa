
export interface Payment {
  id: string;

  shipmentCode: string;

  flutterwaveReference: string;

  amount: number;

  paymentMethod: string;

  status: PaymentStatus;

  paidAt: string;
}


export interface PaymentSummary {
  totalSpent: number;

  totalTransactions: number;

  lastPaymentDate: string;
}

export type PaymentStatus =
  | "PENDING"
  | "SUCCESSFUL"
  | "FAILED"
  | "REFUNDED";

export interface PaymentShipment {
  id: string;
  trackingCode: string;
  pickupAddress: string;
  destinationAddress: string;
  recipient: string;
  recipientPhone: string;
  totalPrice: string;
  createdAt: string;
}

export interface PaymentDetails {
  id: string;
  shipmentId: string;
  customerId: string;

  gateway: string;

  txRef: string;

  flutterwaveTxId: string;

  flutterwaveRef: string;

  amount: string;

  currency: string;

  status: PaymentStatus;

  paymentMethod: string | null;

  createdAt: string;

  updatedAt: string;

  shipment: PaymentShipment;
  
}


export interface PaymentsResponse {
  payments: PaymentDetails[];

  summary: PaymentSummary;
}