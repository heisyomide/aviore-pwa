import axios from "axios";

import { API_BASE_URL } from "../constants";

import type {
  Payment,
  PaymentDetails,
  PaymentsResponse,
} from "../types";

export class PaymentsService {
  static async getPayments(
    token: string
  ): Promise<PaymentsResponse> {
    const { data } = await axios.get(
      `${API_BASE_URL}/payments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  }

  static async getPayment(
    paymentId: string,
    token: string
  ): Promise<PaymentDetails> {
    const { data } = await axios.get(
      `${API_BASE_URL}/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  }
}