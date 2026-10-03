import axios from "axios";

import {
  API_BASE_URL,
  PASSWORD_ENDPOINT,
  PROFILE_ENDPOINT,
} from "../constants";

import type {
  ChangePasswordDto,
  PasswordResponse,
  Profile,
  UpdateProfileDto,
} from "../types";

export class ProfileService {
  static async getProfile(
    token: string,
  ): Promise<Profile> {
    const { data } = await axios.get(
      `${API_BASE_URL}${PROFILE_ENDPOINT}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  }

  static async updateProfile(
    dto: UpdateProfileDto,
    token: string,
  ): Promise<Profile> {
    const { data } = await axios.patch(
      `${API_BASE_URL}${PROFILE_ENDPOINT}`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  }

  static async changePassword(
    dto: ChangePasswordDto,
    token: string,
  ): Promise<PasswordResponse> {
    const { data } = await axios.patch(
      `${API_BASE_URL}${PASSWORD_ENDPOINT}`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  }
}