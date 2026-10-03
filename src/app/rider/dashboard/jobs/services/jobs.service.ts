// src/app/rider/dashboard/jobs/services/jobs.service.ts
import { api } from '@/src/lib/api';

import type {
  AvailableJob,
  JobDetails,
} from '../types';

class RiderJobsService {
  /**
   * Available Jobs
   */
  async getAvailableJobs(): Promise<AvailableJob[]> {
    const response = await api.get(
      '/rider/jobs/available',
    );

    return response.data;
  }

  /**
   * Get Event Transit Jobs Feed
   */
  async getEventTransitJobs() {
    const response = await api.get(
      '/rider/jobs/events',
    );

    return response.data;
  }

  /**
   * Get Single Job
   */
  async getJob(
    shipmentId: string,
  ): Promise<JobDetails> {
    const response = await api.get(
      `/rider/jobs/${shipmentId}`,
    );

    return response.data.shipment;
  }

  /**
   * Get Active Event Trip Details (Manifest & Stops)
   */
  async getActiveEventTripDetails(tripId: string) {
    const response = await api.get(
      `/events/trips/${tripId}/active-details`,
    );

    return response.data;
  }

  /**
   * Check-in Passenger by QR Token
   */
async checkInPassenger(tripId: string, qrToken: string) {
    const response = await api.post(
      '/events/check-in',
      {
        tripId,
        qrToken,
      },
    );

    return response.data;
  }
  /**
   * Accept Job
   */
  async acceptJob(
    shipmentId: string,
  ) {
    const response = await api.post(
      `/rider/jobs/${shipmentId}/accept`,
    );

    return response.data;
  }

  /**
   * Accept Event Job
   */
  async acceptEventJob(tripId: string) {
    const response = await api.post(
      `/events/trips/${tripId}/accept`,
    );
    return response.data;
  }

  /**
   * Arrived at Pickup
   * Customer Timeline:
   * PICKED_UP
   */
  async arrivedAtPickup(
    shipmentId: string,
  ) {
    const response = await api.patch(
      `/rider/jobs/${shipmentId}/arrive-pickup`,
    );

    return response.data;
  }

  /**
   * Confirm Pickup
   * Customer Timeline:
   * IN_TRANSIT
   */
  async pickupShipment(
    shipmentId: string,
  ) {
    const response = await api.patch(
      `/rider/jobs/${shipmentId}/pickup`,
    );

    return response.data;
  }

  /**
   * Arrived at Destination
   * Customer Timeline:
   * OUT_FOR_DELIVERY
   */
  async arrivedAtDestination(
    shipmentId: string,
  ) {
    const response = await api.patch(
      `/rider/jobs/${shipmentId}/arrive-destination`,
    );

    return response.data;
  }

  /**
   * Get Accepted/Active Event Trips for the Rider
   */
  async getAcceptedEventTrips() {
    const response = await api.get(
      '/events/trips/accepted',
    );

    return response.data;
  }

  async advanceTripState(tripId: string, status: string) {
    const response = await api.patch(`/event-trips/${tripId}/status`, { status });
    return response.data;
  }

  /**
   * Complete Delivery
   * Customer Timeline:
   * DELIVERED
   */
  async completeDelivery(
    shipmentId: string,
    verificationPin: string,
  ) {
    const response = await api.post(
      `/rider/jobs/${shipmentId}/complete`,
      {
        verificationPin,
      },
    );

    return response.data;
  }
}

export default new RiderJobsService();