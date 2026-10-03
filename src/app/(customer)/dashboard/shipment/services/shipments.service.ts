import { Shipment } from "../types";

// Clean the API_URL to remove any accidental trailing slashes and provide a solid local fallback
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;

/**
 * Safely parses response JSON body.
 * Prevents "Unexpected end of JSON input" and empty body errors on HTTP 200 responses.
 */
async function parseResponseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  // If the server returned an empty body with 200 OK, return null gracefully instead of crashing
  if (!text || !text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON format returned from server (HTTP ${response.status})`);
  }
}

export class ShipmentService {
  static async getDashboard(token: string) {
    const response = await fetch(`${API_URL}/shipments/customer/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load shipment dashboard (HTTP ${response.status})`);
    }

    return (await parseResponseJson(response)) || { shipments: [], stats: { active: 0, inTransit: 0, delivered: 0 } };
  }

  static async getShipment(id: string, token: string): Promise<Shipment | null> {
    const response = await fetch(`${API_URL}/shipments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Shipment with ID "${id}" was not found.`);
      }
      throw new Error(`Unable to fetch shipment (HTTP ${response.status})`);
    }

    return parseResponseJson<Shipment>(response);
  }

  static async trackShipment(trackingCode: string, token: string) {
    const response = await fetch(`${API_URL}/shipments/track/${trackingCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Shipment track failed (HTTP ${response.status})`);
    }

    return parseResponseJson(response);
  }

  static async cancelShipment(id: string, token: string) {
    const response = await fetch(`${API_URL}/shipments/${id}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to cancel shipment (HTTP ${response.status})`);
    }

    return parseResponseJson(response);
  }
}