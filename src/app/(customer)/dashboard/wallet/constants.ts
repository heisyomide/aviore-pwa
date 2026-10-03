import type {
  Payment,
  PaymentSummary,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export const PAYMENT_SUMMARY: PaymentSummary = {
  totalSpent: 689400,

  totalTransactions: 48,

  lastPaymentDate: "Jul 5, 2026",
};

export const PAYMENT_HISTORY: Payment[] = [
  {
    id: "TXN-99102",

    shipmentCode: "SH-8802-NX",

    flutterwaveReference:
      "FLW-20394922",

    amount: 3950,

    paymentMethod: "Flutterwave Card",

    status: "SUCCESSFUL",

    paidAt: "Jul 5, 2026",
  },

  {
    id: "TXN-99081",

    shipmentCode: "SH-1104-LK",

    flutterwaveReference:
      "FLW-19384553",

    amount: 5200,

    paymentMethod: "Bank Transfer",

    status: "PENDING",

    paidAt: "Jul 3, 2026",
  },

  {
    id: "TXN-98611",

    shipmentCode: "SH-7391-ZA",

    flutterwaveReference:
      "FLW-18377388",

    amount: 8500,

    paymentMethod: "Flutterwave Card",

    status: "SUCCESSFUL",

    paidAt: "Jun 28, 2026",
  },

  {
    id: "TXN-97554",

    shipmentCode: "SH-2209-TR",

    flutterwaveReference:
      "FLW-17290220",

    amount: 12400,

    paymentMethod: "Refund",

    status: "REFUNDED",

    paidAt: "Jun 15, 2026",
  },
];