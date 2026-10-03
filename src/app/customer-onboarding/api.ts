import { api } from '@/src/lib/api';
import { CustomerRegistrationPayload } from "./types";

const CUSTOMER_API = "/auth";

export interface CustomerRegistrationResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
}

export const registerCustomer = async (
  payload: CustomerRegistrationPayload,
): Promise<CustomerRegistrationResponse> => {
  const { data } =
    await api.post<CustomerRegistrationResponse>(
      `${CUSTOMER_API}/register`,
      payload,
    );

  return data;
};