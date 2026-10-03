// src/app/rider/dashboard/jobs/[shipmentId]/services/shipment.service.ts

import { api } from '@/src/lib/api';

class JobService {
  async getJobDetails(jobId: string) {
    const response = await api.get(`/rider/jobs/${jobId}`);
    return response.data; // Returns { jobType, job: { ... } }
  }

  // Add these aliases to support any component calling getJob or getShipment
  async getJob(jobId: string) {
    return this.getJobDetails(jobId);
  }

  async getShipment(jobId: string) {
    return this.getJobDetails(jobId);
  }

  async acceptJob(jobId: string) {
    const response = await api.post(`/rider/jobs/${jobId}/accept`, {});
    return response.data;
  }

  async arrivedAtPickup(jobId: string) {
    const response = await api.patch(`/rider/jobs/${jobId}/arrive-pickup`, {});
    return response.data;
  }

  async pickup(jobId: string) {
    const response = await api.patch(`/rider/jobs/${jobId}/pickup`, {});
    return response.data;
  }

  async arrivedAtDestination(jobId: string) {
    const response = await api.patch(`/rider/jobs/${jobId}/arrive-destination`, {});
    return response.data;
  }

  async complete(jobId: string, verificationPin: string) {
    const response = await api.post(`/rider/jobs/${jobId}/complete`, {
      verificationPin,
    });
    return response.data;
  }
}

export default new JobService();