export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export const PROFILE_ENDPOINT = "/profile";

export const PASSWORD_ENDPOINT =
  "/profile/password";

export const PROFILE_AVATAR_FALLBACK =
  "/images/avatar-placeholder.png";