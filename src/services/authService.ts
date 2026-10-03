// services/authService.ts
export interface RegisterOrganizerPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export async function registerOrganizer(payload: RegisterOrganizerPayload) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  const response = await fetch(`${apiUrl}/auth/register/organizer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: payload.email.trim(),
      password: payload.password,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      phoneNumber: payload.phoneNumber?.trim() || undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to register organizer account.');
  }

  return data;
}