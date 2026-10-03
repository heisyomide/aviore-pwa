export interface Profile {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  phoneNumber: string;

  avatarUrl: string | null;

  role: string;

  status: string;

  address: Address;

  createdAt: string;

  updatedAt: string;
}

export interface Address {

  street: string;

  city: string;

  state: string;

  country: string;

}

export interface UpdateProfileDto {
  firstName: string;

  lastName: string;

  phoneNumber: string;

  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;

  newPassword: string;
}

export interface ProfileResponse extends Profile {}

export interface PasswordResponse {
  message: string;
}