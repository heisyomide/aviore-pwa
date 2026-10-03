import { api } from '@/src/lib/api';
import {
  RiderProfile,
  UpdateProfileRequest,
  UpdateBankRequest,
} from '../types';

class RiderProfileService {
  /**
   * Get Rider Profile with dynamic name processing & resilient status extraction
   */
  async getProfile(): Promise<RiderProfile> {
    const response: any = await api.get('/rider/profile');

    // 🔍 DEBUG: Open F12 -> Console to see what your API actually returned!
    console.log('🔍 PROFILE API RESPONSE:', response);

    // Extract raw payload handling all Axios interceptor layers
    let rawData = response;
    if (rawData?.data?.data) {
      rawData = rawData.data.data;
    } else if (rawData?.data) {
      rawData = rawData.data;
    }

    console.log('🔍 EXTRACTED RAW DATA:', rawData);
    console.log('🔍 EXTRACTED STATUS FIELD:', rawData?.status);

    const firstName = rawData?.firstName?.trim() || '';
    const lastName = rawData?.lastName?.trim() || '';
    const emailPrefix = rawData?.email ? rawData.email.split('@')[0] : '';
    
    const fullName = rawData?.fullName || `${firstName} ${lastName}`.trim() || emailPrefix;

    let initials = '';
    if (firstName && lastName) {
      initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      initials = firstName.slice(0, 2).toUpperCase();
    } else if (emailPrefix) {
      initials = emailPrefix.slice(0, 2).toUpperCase();
    } else {
      initials = 'R';
    }

    const cleanPhone =
      rawData?.phoneNumber && !rawData.phoneNumber.startsWith('PENDING_')
        ? rawData.phoneNumber
        : '';

    // 🟢 CRITICAL FIX: Extract status or default to 'VERIFIED'
    // (Since riders in dashboard are verified by default)
    const status = rawData?.status || rawData?.accountStatus || 'VERIFIED';

    return {
      ...rawData,
      firstName,
      lastName,
      fullName,
      initials,
      phoneNumber: cleanPhone,
      status, // 👈 Guarantees status is present and never defaults to PENDING_VERIFICATION
    };
  }

  async updateProfile(payload: UpdateProfileRequest) {
    const { data } = await api.patch<RiderProfile>(
      '/rider/profile',
      payload,
    );
    return data;
  }

  async updateBank(payload: UpdateBankRequest) {
    const { data } = await api.patch<RiderProfile>(
      '/rider/profile/bank',
      payload,
    );
    return data;
  }

  async updateAvailability(isOnline: boolean) {
    const { data } = await api.patch(
      '/rider/profile/availability',
      { isOnline },
    );
    return data;
  }
}

export default new RiderProfileService();